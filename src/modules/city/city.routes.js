const r=require('express').Router();
const c=require('./city.controller');
const auth=require('../../middlewares/auth.middleware');
const perm=require('../../middlewares/permission.middleware');
const v=require('./city.validation');
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
 * /city:
 *   get:
 *     summary: Get users list
 *     tags: [Citys]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: City fetched successfully
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
 * /city/add:
 *   post:
 *     summary: Add city
 *     tags: [City]
  *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - state_id
 *               - city_name
 *               - city_code
 *             properties:
 *               state_id:
 *                 type: integer
 *                 example: 12
 *               city_name:
 *                 type: string
 *                 example: Nagpur
 *               city_code:
 *                 type: string
 *                 example: NGP
 *     responses:
 *       200:
 *         description: City added successfully
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
 *                   example: City added successfully
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
 * /city/details/{city_id}:
 *   get:
 *     summary: Get city details
 *     tags: [City]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: city_id
 *         required: true
 *         schema:
 *           type: integer
 *         example: 15
 *     responses:
 *       200:
 *         description: City details fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 city_id:
 *                   type: integer
 *                   example: 15
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 */
r.get('/details/:city_id', c.details);

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
 * /city/update/{city_id}:
 *   put:
 *     summary: Update a city
 *     tags: [City]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: city_id
 *         required: true
 *         schema:
 *           type: integer
 *         example: 15
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - state_id
 *               - city_name
 *               - city_code
 *             properties:
 *               state_id:
 *                 type: integer
 *                 example: 15
 *               city_name:
 *                 type: string
 *                 example: Nagpur
 *               city_code:
 *                 type: string
 *                 example: NGP
 *     responses:
 *       200:
 *         description: City updated successfully
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
 *                   example: City updated successfully
 */
r.put('/update/:city_id', auth, c.update);

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
 * /city/delete/{city_id}:
 *   delete:
 *     summary: Delete city details
 *     tags: [City]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: city_id
 *         required: true
 *         schema:
 *           type: integer
 *         example: 15
 *     responses:
 *       200:
 *         description: City deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 city_id:
 *                   type: integer
 *                   example: 15
 *                 data:
 *                   type: object
 *                   nullable: true
 */
r.delete('/delete/:city_id', auth, c.delete);


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
 * /city/cityList/{state_id}:
 *   get:
 *     summary: Get city details
 *     tags: [City]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: state_id
 *         required: true
 *         schema:
 *           type: integer
 *         example: 15
 *     responses:
 *       200:
 *         description: City details fetched successfully
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
 *                   example: 15
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 */
r.get('/cityList/:state_id', c.cityList);

module.exports=r;
