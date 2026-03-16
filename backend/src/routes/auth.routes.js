const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const authMiddleware = require('../middleware/auth');
const prisma = require('../config/prisma');

const router = express.Router();

// Register
router.post('/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }

        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            return res.status(409).json({ error: 'Email already registered' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await prisma.user.create({
            data: {
                name: name || email.split('@')[0],
                email,
                password: hashedPassword,
                plan: 'FREE',
            }
        });

        const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '7d' });
        const { password: _, ...userWithoutPassword } = user;
        res.status(201).json({ user: userWithoutPassword, token });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user || (!user.password && user.githubId)) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '7d' });
        const { password: _, ...userWithoutPassword } = user;
        res.json({ user: userWithoutPassword, token });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GitHub OAuth — find or create user from GitHub profile data
router.post('/github', async (req, res) => {
    try {
        const { githubId, email, name, avatarUrl } = req.body;
        
        if (!email) {
            return res.status(400).json({ error: 'Email is required from GitHub profile' });
        }

        // Try to find by githubId first, then by email
        let user = null;
        if (githubId) {
            user = await prisma.user.findUnique({ where: { githubId: String(githubId) } });
        }
        if (!user) {
            user = await prisma.user.findUnique({ where: { email } });
        }

        if (user) {
            // Update existing user with GitHub info if needed
            if (githubId && !user.githubId) {
                user = await prisma.user.update({
                    where: { id: user.id },
                    data: { 
                        githubId: String(githubId),
                        avatarUrl: avatarUrl || user.avatarUrl,
                        name: user.name || name,
                    }
                });
            }
        } else {
            // Create new user
            user = await prisma.user.create({
                data: {
                    name: name || email.split('@')[0],
                    email,
                    plan: 'FREE',
                    githubId: githubId ? String(githubId) : null,
                    avatarUrl: avatarUrl || null,
                }
            });
        }

        const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '7d' });
        const { password: _, ...userWithoutPassword } = user;
        res.json({ user: userWithoutPassword, token });
    } catch (error) {
        console.error('GitHub auth error:', error);
        res.status(500).json({ error: error.message });
    }
});

// Google OAuth — find or create user from Google profile data
router.post('/google', async (req, res) => {
    try {
        const { email, name, avatarUrl } = req.body;
        
        if (!email) {
            return res.status(400).json({ error: 'Email is required from Google profile' });
        }

        // Find by email
        let user = await prisma.user.findUnique({ where: { email } });

        if (user) {
            // Update name/avatar if missing
            if (!user.name || !user.avatarUrl) {
                user = await prisma.user.update({
                    where: { id: user.id },
                    data: {
                        name: user.name || name,
                        avatarUrl: user.avatarUrl || avatarUrl,
                    }
                });
            }
        } else {
            // Create new user
            user = await prisma.user.create({
                data: {
                    name: name || email.split('@')[0],
                    email,
                    plan: 'FREE',
                    avatarUrl: avatarUrl || null,
                }
            });
        }

        const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '7d' });
        const { password: _, ...userWithoutPassword } = user;
        res.json({ user: userWithoutPassword, token });
    } catch (error) {
        console.error('Google auth error:', error);
        res.status(500).json({ error: error.message });
    }
});

// Get current user
router.get('/me', authMiddleware, async (req, res) => {
    try {
        const user = await prisma.user.findUnique({ where: { id: req.user.id } });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        const { password: _, ...userWithoutPassword } = user;
        res.json({ user: userWithoutPassword });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update profile
router.put('/profile', authMiddleware, async (req, res) => {
    try {
        const { name } = req.body;
        
        const user = await prisma.user.update({
            where: { id: req.user.id },
            data: { name }
        });
        
        const { password: _, ...userWithoutPassword } = user;
        res.json({ user: userWithoutPassword });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
