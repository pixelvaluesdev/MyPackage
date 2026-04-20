const r=require('express').Router();
const c=require('./profile.controller');
const auth=require('../../middlewares/auth.middleware');
const perm=require('../../middlewares/permission.middleware');
const v=require('./profile.validation');
const validate=require('../../middlewares/validate.middleware');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/profile');
  },

  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname); // ✅ keep extension
    const name = Date.now() + ext;
    cb(null, name);
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
 * /profile/details/{user_id}:
 *   get:
 *     summary: Get profile details
 *     tags: [Profile]
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
 *         description: Profile details fetched successfully
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
 *                   type: array
 *                   items:
 *                     type: object
 */
r.get('/details/:user_id', auth, c.details);

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
 * /profile/update/{user_id}:
 *   put:
 *     summary: Update a profile
 *     tags: [Profile]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: user_id
 *         required: true
 *         schema:
 *           type: integer
 *         example: 15
 *     requestBody:
 *       required: true
*       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - first_name
 *               - last_name
 *               - email
 *               - mobile_no
 *             properties:
 *               first_name:
 *                 type: string
 *                 example: dsfsd
 *               last_name:
 *                 type: string
 *                 example: Nagpur
 *               email:
 *                 type: string
 *                 example: csdcd@yopmail.com
 *               mobile_no:
 *                 type: integer
 *                 example: 9685142413
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Profile updated successfully
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
 *                   example: Profile updated successfully
 */
r.put('/update/:user_id', auth, upload.single('file'), c.update);

r.get('/settings/', c.settings);

module.exports=r;
