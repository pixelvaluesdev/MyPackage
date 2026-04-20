const r=require('express').Router();
const c=require('./state.controller');
const auth=require('../../middlewares/auth.middleware');
const perm=require('../../middlewares/permission.middleware');
const v=require('./state.validation');
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
 * /states:
 *   get:
 *     summary: Get states list
 *     tags: [State]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: States fetched successfully
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
 * /states/add:
 *   post:
 *     summary: Add state
 *     tags: [States]
  *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - country_id
 *               - state_name
 *               - state_code
 *             properties:
 *               country_id:
 *                 type: integer
 *                 example: abcd
 *               state_name:
 *                 type: string
 *                 example: Andhra Pradesh
 *               state_code:
 *                 type: string
 *                 example: AP
 *     responses:
 *       200:
 *         description: State added successfully
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
 *                   example: State added successfully
 */
r.post('/add', auth, validate(v.create), c.create);

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
 * /states/details/{state_id}:
 *   get:
 *     summary: Get state details
 *     tags: [States]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: state_id
 *         required: true
 *         schema:
 *           type: integer
 *         example: 12
 *     responses:
 *       200:
 *         description: State details fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 state_id:
 *                   type: integer
 *                   example: 12
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 */
r.get('/details/:state_id', auth, c.details);

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
 * /states/update/{state_id}:
 *   put:
 *     summary: Update a state
 *     tags: [States]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: state_id
 *         required: true
 *         schema:
 *           type: integer
 *         example: 12
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - country_id
 *               - state_name
 *               - state_code
 *             properties:
 *               country_id:
 *                 type: integer
 *                 example: 15
 *               state_name:
 *                 type: string
 *                 example: Andhra Pradesh
 *               state_code:
 *                 type: string
 *                 example: AP
 *     responses:
 *       200:
 *         description: State updated successfully
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
 *                   example: State updated successfully
 */
r.put('/update/:state_id', auth, c.update);

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
 * /states/delete/{state_id}:
 *   delete:
 *     summary: Delete state details
 *     tags: [States]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: state_id
 *         required: true
 *         schema:
 *           type: integer
 *         example: 12
 *     responses:
 *       200:
 *         description: State deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 state_id:
 *                   type: integer
 *                   example: 12
 *                 data:
 *                   type: object
 *                   nullable: true
 */
r.delete('/delete/:state_id', auth, c.delete);

module.exports=r;
