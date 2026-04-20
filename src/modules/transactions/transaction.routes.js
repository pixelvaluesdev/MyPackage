const r = require('express').Router();
const c = require('./transaction.controller');
const auth = require('../../middlewares/auth.middleware');
const permission = require('../../middlewares/permission.middleware');
const v = require('./transaction.validation');
const validate = require('../../middlewares/validate.middleware');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(process.cwd(), 'uploads/transaction/csv');
    fs.mkdirSync(uploadPath, { recursive: true });
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '.csv');
  }
});
const upload = multer({ storage });

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
 * /transactions:
 *   get:
 *     summary: Get transactions list
 *     tags: [Transactions]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Transactions fetched successfully
 */
r.get("/", c.list);

/**
 * @swagger
 * /transactions/add:
 *   post:
 *     summary: Add or update transaction
 *     tags: [Transactions]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - locker_id
 *               - vendor
 *               - event_type
 *               - compartment_size
 *               - timestamp
 *             properties:
 *               transaction_id:
 *                 type: string
 *                 example: ""
 *                 description: if exists then update otherwise insert
 *               locker_id:
 *                 type: string
 *                 example: ST-MUM-49
 *               vendor:
 *                 type: string
 *                 example: Amazon
 *               event_type:
 *                 type: string
 *                 example: PICKUP
 *               compartment_size:
 *                 type: string
 *                 example: M
 *               time_taken_seconds:
 *                 type: integer
 *                 example: 38
 *               timestamp:
 *                 type: string
 *                 format: date-time
 *                 example: "2026-03-28 03:26:38"
 *               delivery_person_name:
 *                 type: string
 *                 example: hytrfds
 *               flat_no:
 *                 type: integer
 *                 example: 101
 *               user_name:
 *                 type: string
 *                 example: hgfd
 *               whatsapp_status:
 *                 type: string
 *                 example: success
 *               otp:
 *                 type: integer
 *                 example: 9654
 *     responses:
 *       200:
 *         description: Transaction processed successfully
 *       400:
 *         description: Bad request
 *       404:
 *         description: Locker not found
 *       500:
 *         description: Internal server error
 */
r.post("/add", validate(v.create), c.create);

/**
 * @swagger
 * /transactions/details/{transaction_id}:
 *   get:
 *     summary: Get transaction details
 *     tags: [Transactions]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: transaction_id
 *         required: true
 *         schema:
 *           type: integer
 *         example: 15
 *     responses:
 *       200:
 *         description: Transaction details fetched successfully
 */
r.get('/details/:transaction_id', c.details);

/**
 * @swagger
 * /transactions/update/{transaction_id}:
 *   put:
 *     summary: Update a transaction
 *     tags: [Transactions]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: transaction_id
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
 *               - locker_id
 *               - vendor
 *               - event_type
 *               - compartment_size
 *             properties:
 *               locker_id:
 *                 type: string
 *               vendor:
 *                 type: string
 *               event_type:
 *                 type: string
 *               compartment_size:
 *                 type: string
 *               time_taken_seconds:
 *                 type: integer
 *                 example: 38
 *     responses:
 *       200:
 *         description: Transaction updated successfully
 */
r.put('/update/:transaction_id', validate(v.create), c.update);

/**
 * @swagger
 * /transactions/delete/{transaction_id}:
 *   delete:
 *     summary: Delete transaction
 *     tags: [Transactions]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: transaction_id
 *         required: true
 *         schema:
 *           type: integer
 *         example: 15
 *     responses:
 *       200:
 *         description: Transaction deleted successfully
 */
r.delete('/delete/:transaction_id', c.delete);

/**
 * @swagger
 * /transactions/upload:
 *   post:
 *     summary: Upload CSV file
 *     tags: [Transactions]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: File uploaded successfully
 */
r.post('/upload', auth, upload.single('file'), c.uploadCSV);

r.get('/export-users', c.exportUsersCSV);
r.get('/transactionList/:locker_id', c.transactionList);

module.exports = r;