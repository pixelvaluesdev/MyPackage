const r=require('express').Router();
const c=require('./healthlog.controller');
const v=require('./healthlog.validation');
const auth=require('../../middlewares/auth.middleware');
const perm=require('../../middlewares/permission.middleware');
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
 * /healthlogs:
 *   get:
 *     summary: Get health logs list
 *     tags: [HealthLogs]
 *     security:
 *       - bearerAuth: []   # Assuming you use JWT bearer token for auth
 *     responses:
 *       200:
 *         description: Health logs fetched successfully
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
r.get("/", c.list);

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
 * /healthlogs/add:
 *   post:
 *     summary: Add health log
 *     tags: [HealthLogs]
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
 *               - temperature
 *               - overall_status
 *             properties:
 *               locker_id:
 *                 type: string
 *                 example: ST-DEL-001
 *               temperature:
 *                 type: number
 *                 example: 42
 *               network:
 *                 type: string
 *                 example: ok
 *               lock_status:
 *                 type: string
 *                 example: ok
 *               camera:
 *                 type: string
 *                 example: ok
 *               overall_status:
 *                 type: string
 *                 example: healthy
 *     responses:
 *       200:
 *         description: Health log added successfully
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
 *                   example: Health log added successfully
 */
r.post("/add", validate(v.create), c.create);

module.exports=r;
