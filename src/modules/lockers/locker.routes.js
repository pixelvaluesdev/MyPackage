const r = require('express').Router();
const c = require('./locker.controller');
const v = require('./locker.validation');
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
 * /lockers:
 *   get:
 *     summary: Get locker list
 *     tags: [Lockers]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Locker list fetched successfully
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
 * /lockers/add:
 *   post:
 *     summary: Create a locker
 *     tags: [Lockers]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - locker_name
 *               - city
 *               - area
 *               - latitude
 *               - longitude
 *               - status
 *             properties:
 *               locker_name:
 *                 type: string
 *                 example: Locker A1
 *               city:
 *                 type: integer
 *                 example: 1
 *               area:
 *                 type: string
 *                 example: Ajani
 *               latitude:
 *                 type: string
 *                 example: 54:00000
 *               longitude:
 *                 type: string
 *                 example: 58:00000
 *               status:
 *                 type: string
 *                 example: active
 *     responses:
 *       200:
 *         description: Locker created successfully
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
 * /lockers/details/{locker_id}:
 *   get:
 *     summary: Get locker details
 *     tags: [Lockers]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: locker_id
 *         required: true
 *         schema:
 *           type: integer
 *         example: 15
 *     responses:
 *       200:
 *         description: Locker details fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 locker_id:
 *                   type: integer
 *                   example: 15
 *                 data:
 *                   type: object
 *                   description: Locker details
 */
r.get('/details/:locker_id', c.details);


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
 *     summary: Update a locker
 *     tags: [Lockers]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: locker_id
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
 *               - locker_name
 *               - city
 *               - area
 *               - latitude
 *               - longitude
 *               - status
 *             properties:
 *               locker_name:
 *                 type: string
 *                 example: Locker A1
 *               city:
 *                 type: integer
 *                 example: 1
 *               area:
 *                 type: string
 *                 example: Ajani
 *               latitude:
 *                 type: string
 *                 example: "54.00000"
 *               longitude:
 *                 type: string
 *                 example: "58.00000"
 *               status:
 *                 type: string
 *                 example: active
 *     responses:
 *       200:
 *         description: Locker updated successfully
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
 *                   example: Locker updated successfully
 */
r.put('/update/:locker_id', validate(v.create), c.update);

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
 * /lockers/delete/{locker_id}:
 *   delete:
 *     summary: Delete locker details
 *     tags: [Lockers]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: locker_id
 *         required: true
 *         schema:
 *           type: integer
 *         example: 15
 *     responses:
 *       200:
 *         description: Locker details deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 locker_id:
 *                   type: integer
 *                   example: 15
 *                 data:
 *                   type: object
 *                   nullable: true
 */
r.delete('/delete/:locker_id', c.delete);

//r.get('/', auth, perm('LOCKER','view'), c.list);

//r.get('/', (req, res) => res.send('Locker route works'));


r.get('/debug', (req, res) => res.send('Locker debug works'));

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
 * /lockers/building-list:
 *   get:
 *     summary: Get locker building list
 *     tags: [Lockers]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Locker building list fetched successfully
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
r.get('/building-list', c.buildingList);

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
 * /lockers/building-list-all:
 *   get:
 *     summary: Get locker building list all
 *     tags: [Lockers]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Locker building list all fetched successfully
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
r.get('/building-list-all', c.buildingListAll);


r.get('/building-details/:building_no', c.buildingDetails);

r.get('/building-list-locker_id/:locker_id', c.buildingListByLockerId);
r.get('/building-list-all-locker_id/:locker_id', c.buildingListAllByLockerId);

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
 * /lockers/building-details-locker_id/{building_no}/{locker_id}:
 *   get:
 *     summary: Get locker building details
 *     tags: [Lockers]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: building_no
 *         required: true
 *         schema:
 *           type: string
 *         example: B101
 *       - in: path
 *         name: locker_id
 *         required: true
 *         schema:
 *           type: string
 *         example: ST-MUM-49
 *     responses:
 *       200:
 *         description: Locker building details fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 locker_id:
 *                   type: string
 *                   example: ST-MUM-49
 *                 data:
 *                   type: object
 *                   description: Locker building details
 *                   example:
 *                     building_no: B101
 *                     address: "Mumbai"
 *                     total_lockers: 50
 *       400:
 *         description: Invalid parameters
 *       404:
 *         description: Locker not found
 *       500:
 *         description: Internal server error
 */
r.get('/building-details-locker_id/:building_no/:locker_id', c.buildingDetailsByLockerId);

module.exports = r;
