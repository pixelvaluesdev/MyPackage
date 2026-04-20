const r=require('express').Router();
const c=require('./auth.controller');
const auth=require('../../middlewares/auth.middleware');
const perm=require('../../middlewares/permission.middleware');
const v=require('./auth.validation');
const validate=require('../../middlewares/validate.middleware');

/**
 * @swagger
 * /logins:
 *   post:
 *     summary: User login with email and password
 *     tags: [Login]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 example: 123456
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 token:
 *                   type: string
 *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9
 *                 user:
 *                   type: object
 *       401:
 *         description: Invalid email or password
 */
r.post('/', c.login);

r.post('/reset-password', c.resetPassword);

r.post('/logout', c.logout);

module.exports=r;