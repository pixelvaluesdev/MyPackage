const pool=require('../../config/database');
const bcrypt = require('bcrypt');

exports.create=async(d, ip)=>{
  const start = Date.now();

  // Normalize IPv6
  const userIp = ip?.startsWith('::ffff:') ? ip.replace('::ffff:', '') : ip;

  const responseTime = Date.now() - start;

  const password = Math.random().toString(36).slice(-8);
  
  const hashedPassword = await bcrypt.hash(password, 8);
  if(d.role_type === 'superadmin'){
    throw new Error("You can't add superadmin.");
  }else{
  	await pool.query(
      `INSERT INTO mypackages_users
       (usr_name,usr_email,requested_payload,requested_ip,role_type,is_active,usr_password, encryption)
       VALUES (?, ?, ?, ?, ?, 1, ?, ?)`,
      [d.name, d.email, JSON.stringify(d), userIp, d.role_type, hashedPassword, password]
    );
  }
};

exports.list = async () => {
  const [rows] = await pool.query(`SELECT * FROM mypackages_users`);
  return rows;
};

exports.details = async (user_id) => {
  const [rows] = await pool.query(`SELECT * FROM mypackages_users WHERE usr_id = ?`, user_id);
  return rows[0];
};

exports.update=async(data, user_id, ip)=>{
  const {
    name,
    email
  } = data;

  if (!user_id) {
    throw new Error("user_id is required");
  }
  
  // Normalize IPv6
  const userIp = ip?.startsWith('::ffff:') ? ip.replace('::ffff:', '') : ip;

  const [result] = await pool.query(
    `UPDATE mypackages_users
     SET usr_name = ?,
         usr_email = ?
         requested_payload = ?,
         requested_ip = ?
     WHERE usr_id = ?`,
    [
      name,
      email,
      JSON.stringify(data),
      userIp,
      user_id
    ]
  );
  
  if (result.affectedRows === 0) {
    throw new Error("User not found or no changes applied");
  }
  
  return true;
};

exports.delete = async (user_id) => {
  const [rows] = await pool.query(`DELETE FROM mypackages_users WHERE usr_id = ? AND role_type != 'superadmin'`, user_id);
  return true;
};