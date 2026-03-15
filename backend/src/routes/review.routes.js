const express = require('express');
const authMiddleware = require('../middleware/auth');
const { analyzeCode } = require('../services/ai.service');
const prisma = require('../config/prisma');

const router = express.Router();

// Create a new code review
router.post('/', authMiddleware, async (req, res) => {
    try {
        const { code, language, title } = req.body;
        if (!code || !language) {
            return res.status(400).json({ error: 'Code and language are required' });
        }

        // Run AI analysis first before saving to DB
        // Determine status and analysis results
        let status = 'ANALYZING';
        let analysis = null;
        let score = null;
        let metrics = null;
        
        try {
            analysis = await analyzeCode(code, language);
            score = analysis.score;
            metrics = analysis.metrics;
            status = 'COMPLETED';
        } catch (aiError) {
            console.error('AI Analysis failed:', aiError);
            status = 'FAILED';
        }

        const review = await prisma.review.create({
            data: {
                userId: req.user.id,
                title: title || `${language} Review - ${new Date().toLocaleDateString()}`,
                language,
                code,
                status,
                score,
                analysis: analysis ? analysis : {},
                metrics: metrics ? metrics : {},
            }
        });

        res.status(201).json({ review });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get all reviews for current user
router.get('/', authMiddleware, async (req, res) => {
    try {
        const reviews = await prisma.review.findMany({
            where: { userId: req.user.id },
            orderBy: { createdAt: 'desc' }
        });
        res.json({ reviews });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get single review
router.get('/:id', authMiddleware, async (req, res) => {
    try {
        const review = await prisma.review.findFirst({
            where: { id: req.params.id, userId: req.user.id }
        });
        if (!review) {
            return res.status(404).json({ error: 'Review not found' });
        }
        res.json({ review });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Delete review
router.delete('/:id', authMiddleware, async (req, res) => {
    try {
        const review = await prisma.review.findFirst({
            where: { id: req.params.id, userId: req.user.id }
        });
        if (!review) {
            return res.status(404).json({ error: 'Review not found' });
        }
        await prisma.review.delete({ where: { id: review.id } });
        res.json({ message: 'Review deleted' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Export review as PDF
router.get('/:id/export', authMiddleware, async (req, res) => {
    try {
        const PDFDocument = require('pdfkit');
        const review = await prisma.review.findFirst({
            where: { id: req.params.id, userId: req.user.id }
        });
        if (!review) {
            return res.status(404).json({ error: 'Review not found' });
        }

        const doc = new PDFDocument({ margin: 50, size: 'A4' });
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename="codelens-review-${review.id.slice(0, 8)}.pdf"`);
        doc.pipe(res);

        // Header
        doc.fontSize(24).fillColor('#3b82f6').text('CodeLens AI', { align: 'center' });
        doc.fontSize(10).fillColor('#888').text('Code Review Report', { align: 'center' });
        doc.moveDown(1.5);

        // Review Info
        doc.fontSize(16).fillColor('#333').text(review.title || 'Code Review');
        doc.fontSize(10).fillColor('#666')
            .text(`Language: ${review.language}  |  Date: ${new Date(review.createdAt).toLocaleString()}  |  Score: ${review.score}/100`);
        doc.moveDown(1);

        // Score
        const scoreColor = review.score >= 80 ? '#10b981' : review.score >= 60 ? '#f59e0b' : '#ef4444';
        doc.fontSize(40).fillColor(scoreColor).text(`${review.score}`, { align: 'center' });
        doc.fontSize(10).fillColor('#888').text('/100 Quality Score', { align: 'center' });
        doc.moveDown(1.5);

        // Summary
        if (review.analysis?.summary) {
            doc.fontSize(12).fillColor('#333').text('Summary');
            doc.fontSize(10).fillColor('#555').text(review.analysis.summary);
            doc.moveDown(1);
        }

        // Issues
        if (review.analysis?.issues?.length > 0) {
            doc.fontSize(12).fillColor('#333').text(`Issues Found (${review.analysis.issues.length})`);
            doc.moveDown(0.5);
            review.analysis.issues.forEach((issue, i) => {
                const sevColor = issue.severity === 'critical' ? '#ef4444' : issue.severity === 'warning' ? '#f59e0b' : '#3b82f6';
                doc.fontSize(10).fillColor(sevColor).text(`[${issue.severity.toUpperCase()}] ${issue.title}`, { continued: false });
                doc.fontSize(9).fillColor('#666').text(issue.description);
                if (issue.suggestion) {
                    doc.fontSize(9).fillColor('#10b981').text(`→ ${issue.suggestion}`);
                }
                doc.moveDown(0.5);
            });
            doc.moveDown(0.5);
        }

        // Suggestions
        if (review.analysis?.suggestions?.length > 0) {
            doc.fontSize(12).fillColor('#333').text(`Improvement Suggestions (${review.analysis.suggestions.length})`);
            doc.moveDown(0.5);
            review.analysis.suggestions.forEach(sug => {
                doc.fontSize(10).fillColor('#333').text(`• ${sug.title} (${sug.priority} priority)`);
                doc.fontSize(9).fillColor('#666').text(sug.description);
                doc.moveDown(0.3);
            });
            doc.moveDown(0.5);
        }

        // Metrics
        if (review.analysis?.metrics) {
            const m = review.analysis.metrics;
            doc.fontSize(12).fillColor('#333').text('Metrics');
            doc.moveDown(0.3);
            doc.fontSize(9).fillColor('#555')
                .text(`Cyclomatic Complexity: ${m.cyclomaticComplexity}  |  Functions: ${m.functionCount}  |  Code Lines: ${m.codeLines}  |  Comments: ${m.commentLines}  |  Duplicates: ${m.duplicatePatterns}`);
        }

        // Footer
        doc.moveDown(3);
        doc.fontSize(8).fillColor('#aaa').text(`Generated by CodeLens AI on ${new Date().toLocaleString()}`, { align: 'center' });

        doc.end();
    } catch (error) {
        res.status(500).json({ error: 'Failed to generate PDF: ' + error.message });
    }
});

module.exports = router;
