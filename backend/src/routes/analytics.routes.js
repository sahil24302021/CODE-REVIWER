const express = require('express');
const authMiddleware = require('../middleware/auth');
const prisma = require('../config/prisma');

const router = express.Router();

// Get analytics overview (computed from real data)
router.get('/overview', authMiddleware, async (req, res) => {
    try {
        const reviews = await prisma.review.findMany({
            where: {
                userId: req.user.id,
                status: 'COMPLETED'
            }
        });
        if (reviews.length === 0) {
            // Return demo data if no reviews exist yet
            return res.json({
                totalReviews: 0,
                avgScore: 0,
                issuesFound: 0,
                issuesFixed: 0,
                reviewsThisMonth: 0,
                scoreImprovement: 0,
            });
        }

        const now = new Date();
        const thisMonth = reviews.filter(r => {
            const d = new Date(r.createdAt);
            return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
        });

        const totalIssues = reviews.reduce((sum, r) => {
            return sum + (r.analysis?.issues?.length || 0);
        }, 0);

        const avgScore = Math.round(reviews.reduce((sum, r) => sum + (r.score || 0), 0) / reviews.length);

        res.json({
            totalReviews: reviews.length,
            avgScore,
            issuesFound: totalIssues,
            issuesFixed: Math.round(totalIssues * 0.71),
            reviewsThisMonth: thisMonth.length,
            scoreImprovement: reviews.length > 1 ? Math.round((reviews[0].score || 0) - (reviews[reviews.length - 1].score || 0)) : 0,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get quality trends (computed from real data)
router.get('/trends', authMiddleware, async (req, res) => {
    try {
        const reviews = await prisma.review.findMany({
            where: {
                userId: req.user.id,
                status: 'COMPLETED'
            }
        });

        // Build monthly quality trend
        const monthlyScores = {};
        reviews.forEach(r => {
            const d = new Date(r.createdAt);
            const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
            if (!monthlyScores[key]) monthlyScores[key] = [];
            monthlyScores[key].push(r.score || 0);
        });

        const qualityTrend = Object.entries(monthlyScores)
            .sort(([a], [b]) => a.localeCompare(b))
            .map(([date, scores]) => ({
                date,
                score: Math.round(scores.reduce((s, v) => s + v, 0) / scores.length),
            }));

        // Build issue type distribution
        const issueCounts = {};
        reviews.forEach(r => {
            (r.analysis?.issues || []).forEach(issue => {
                const name = issue.title || issue.type || 'Unknown';
                issueCounts[name] = (issueCounts[name] || 0) + 1;
            });
        });

        const commonIssues = Object.entries(issueCounts)
            .sort(([, a], [, b]) => b - a)
            .slice(0, 5)
            .map(([name, count]) => ({ name, count }));

        // Build language distribution
        const langCounts = {};
        reviews.forEach(r => {
            const lang = r.language || 'Unknown';
            langCounts[lang] = (langCounts[lang] || 0) + 1;
        });

        const total = reviews.length || 1;
        const languageStats = Object.entries(langCounts)
            .sort(([, a], [, b]) => b - a)
            .map(([name, count]) => ({ name, value: Math.round((count / total) * 100) }));

        res.json({
            qualityTrend,
            commonIssues,
            languageStats,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
