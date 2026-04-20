const s=require('./auth.service');
const pool = require('../../config/database');
const bcrypt = require('bcrypt');
const redisClient = require("../../config/redis");

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      });
    }

    const cacheKey = `login_session:${email}`;

    // 1️⃣ Check Redis first
    const cachedSession = await redisClient.get(cacheKey);

    if (cachedSession) {
      const session = JSON.parse(cachedSession);

      return res.json({
        success: true,
        source: 'redis',
        token: session.token,
        data: session.user
      });
    }

    // 2️⃣ Call MODEL (DB)
    const result = await s.login(email, password);
    // result = { token, user }

    // 3️⃣ Store token + user in Redis
    await redisClient.setEx(
      cacheKey,
      3600, // 1 hour
      JSON.stringify({
        token: result.token,
        user: result.user
      })
    );

    return res.json({
      success: true,
      source: 'database',
      token: result.token,
      data: result.user
    });

  } catch (error) {
    return res.status(401).json({
      success: false,
      message: error.message || 'Login failed'
    });
  }
};

exports.resetPassword = async (req, res) => {

  try {

    const {
      email,
      password
    } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password required"
      });
    }

    const [users] = await pool.query(
      `SELECT usr_id 
       FROM mypackages_users
       WHERE usr_email = ?`,
      [email]
    );

    if (users.length === 0) {

      return res.status(404).json({
        success: false,
        message: "This Email is not registered.Please check your email!"
      });

    }

    const user_id = users[0].usr_id;

    const hashedPassword = await bcrypt.hash(password, 10);

    await pool.query(
      `UPDATE mypackages_users
       SET usr_password = ?,encryption = ?
       WHERE usr_id = ?`,
      [hashedPassword, password, user_id]
    );

    await redisClient.del(
      `login_session:${email}`
    );

    await redisClient.del(
      `user_details:${user_id}`
    );

    res.json({
      success: true,
      message: "Password reset successfully"
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      success: false,
      message: "Reset failed"
    });

  }

};

exports.logout = async (req, res) => {
  try {

    // delete all redis data
    await redisClient.flushDb();

    res.json({
      success: true,
      message: "All Redis data cleared"
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
