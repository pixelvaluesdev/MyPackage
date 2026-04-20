const r = require('express').Router();
const c = require('./customer.controller');
const v = require('./customer.validation');
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
 * /customers:
 *   get:
 *     summary: Get locker customer list
 *     tags: [Lockers Customer]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: floor_no
 *         required: false
 *         schema:
 *           type: integer
 *         example: 1
 *
 *       - in: query
 *         name: flat_no
 *         required: false
 *         schema:
 *           type: string
 *         example: A-101
 *
 *       - in: query
 *         name: building_no
 *         required: false
 *         schema:
 *           type: string
 *         example: B1
 *
 *     responses:
 *       200:
 *         description: Locker customer list fetched successfully
 */
r.get('/', c.list);

r.get('/floor_no/:floor_no', c.list);
r.get('/flat_no/:flat_no', c.list);
r.get('/building_no/:building_no', c.list);

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
 * /customers/add: 
 *   post:
 *     summary: Create a locker customer
 *     tags: [Lockers Customer]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - first_name
 *               - last_name
 *               - email
 *               - phone_no
 *               - floor_no
 *               - flat_no
 *               - building_no
 *             properties:
 *               first_name:
 *                 type: string
 *                 example: Locker A1
 *               last_name:
 *                 type: string
 *                 example: dvdv
 *               email:
 *                 type: string
 *                 example: fdsg@yopmail.com
 *               phone_no:
 *                 type: integer
 *                 example: 9685412134
 *               floor_no:
 *                 type: string
 *                 example: cefr
 *               flat_no:
 *                 type: string
 *                 example: 1-B
 *               building_no:
 *                 type: string
 *                 example: c-9
 *     responses:
 *       200:
 *         description: Locker Customer created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 */
r.post('/add', validate(v.create), c.create);

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
 * /customers/details/{customer_id}:
 *   get:
 *     summary: Get locker customer details
 *     tags: [Lockers Customer]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: customer_id
 *         required: true
 *         schema:
 *           type: integer
 *         example: 15
 *     responses:
 *       200:
 *         description: Locker customer details fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 customer_id:
 *                   type: integer
 *                   example: 15
 *                 data:
 *                   type: object
 *                   description: Locker customer details
 */
r.get('/details/:customer_id', auth, c.details);


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
 * /lockers/update/{locker_id}:
 *   put:
 *     summary: Update a locker customer
 *     tags: [Lockers Customer]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: customer_id
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
 *               - first_name
 *               - last_name
 *               - email
 *               - phone_no
 *               - floor_no
 *               - flat_no
 *               - building_no
 *             properties:
  *               first_name:
 *                 type: string
 *                 example: Locker A1
 *               last_name:
 *                 type: string
 *                 example: dvdv
 *               email:
 *                 type: string
 *                 example: fdsg@yopmail.com
 *               phone_no:
 *                 type: integer
 *                 example: 9685412134
 *               floor_no:
 *                 type: string
 *                 example: cefr
 *               flat_no:
 *                 type: string
 *                 example: 1-B
 *               building_no:
 *                 type: string
 *                 example: c-9
 *     responses:
 *       200:
 *         description: Locker customer updated successfully
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
 *                   example: Locker customer updated successfully
 */
r.put('/update/:customer_id', auth, validate(v.create), c.update);

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
 * /customers/delete/{customer_id}:
 *   delete:
 *     summary: Delete locker customer details
 *     tags: [Lockers Customer]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: customer_id
 *         required: true
 *         schema:
 *           type: integer
 *         example: 15
 *     responses:
 *       200:
 *         description: Locker customer details deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 customer_id:
 *                   type: integer
 *                   example: 15
 *                 data:
 *                   type: object
 *                   nullable: true
 */
r.delete('/delete/:customer_id', auth, c.delete);

r.get('/customer-list/:locker_id', c.customerlist);

r.get('/all-customer-list', c.allCustomerlist);

r.post('/otpVerify', auth, c.otpVerify);

r.post('/otpCheck', c.otpCheck);

module.exports = r;
