const r = require('express').Router();
const c = require('./dashboard.controller');
const v = require('./dashboard.validation');
const auth = require('../../middlewares/auth.middleware');
const perm = require('../../middlewares/permission.middleware');
const validate = require('../../middlewares/validate.middleware');

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     BearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */
/**
 * @swagger
 * /dashboard/details/{user_id}:
 *   get:
 *     summary: Get dashboard details
 *     tags: [Dashboard]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: user_id
 *         required: true
 *         schema:
 *           type: integer
 *         example: 15
 *     responses:
 *       200:
 *         description: Dashboard details fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 user_id:
 *                   type: integer
 *                   example: 15
 *                 data:
 *                   type: object
 *                   description: Dashboard details
 */
r.get('/details/:user_id', auth, c.details);

r.post('/filter/:user_id', auth, c.filter);

module.exports = r;
