const r=require('express').Router();
const c=require('./pinglog.controller');
const auth=require('../../middlewares/auth.middleware');
const perm=require('../../middlewares/permission.middleware');
const v=require('./pinglog.validation');
const validate=require('../../middlewares/validate.middleware');

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
 * /pinglogs:
 *   get:
 *     summary: Get ping logs list
 *     tags: [PingLogs]
 *     security:
 *       - bearerAuth: []   # Assuming you use JWT bearer token for auth
 *     responses:
 *       200:
 *         description: Ping logs fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 */
r.get('/', c.list);

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
 * /pinglogs/add:
 *   post:
 *     summary: Add ping log
 *     tags: [PingLogs]
 *     security:
 *       - bearerAuth: []   # Assuming you use JWT bearer token for auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - locker_id
 *               - status
 *             properties:
 *               locker_id:
 *                 type: string
 *                 example: ST-DEL-001
 *               status:
 *                 type: string
 *                 example: online
 *     responses:
 *       200:
 *         description: Ping log added successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Ping log added successfully
 */
r.post('/add', validate(v.create), c.create);

r.get('/count', c.count);

module.exports=r;
