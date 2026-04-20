const pool = require('../../config/database');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { secret, expiresIn } = require('../../config/jwt');

exports.login = async (email, password) => {
  // 1️⃣ Fetch user
  const [rows] = await pool.query(
    `SELECT usr_id, usr_email, usr_name, usr_password, role_type, profile_img
     FROM mypackages_users
     WHERE usr_email = ? AND is_active = 1
     LIMIT 1`,
    [email]
  );

  const user = rows[0];

  if (!user) {
    throw new Error('Invalid credentialss');
  }

  const isPasswordMatch = await bcrypt.compare(
    password,
    user.usr_password
  );

  if (!isPasswordMatch) {
    throw new Error('Invalid credentials1');
  }

  const safeUser = {
    id: user.usr_id,
    email: user.usr_email,
    name: user.usr_name,
    role: user.role_type,
    profile_img: user.profile_img
  };

  // 4️⃣ Generate JWT
  const token = jwt.sign(
    {
      id: user.usr_id,
      role: user.role_type
    },
    secret,
    { expiresIn }
  );

  // 5️⃣ Return token + user
  return {
    token,
    user: safeUser
  };
};
