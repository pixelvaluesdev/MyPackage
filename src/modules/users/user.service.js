const pool=require('../../config/database');
const bcrypt = require('bcrypt');
const moment = require('moment');
const { sendUserSMS } = require('../../middlewares/twillio.middleware');

exports.create=async(d, ip)=>{
  const start = Date.now();

  // Normalize IPv6
  const userIp = ip?.startsWith('::ffff:') ? ip.replace('::ffff:', '') : ip;

  const responseTime = Date.now() - start;

  const password = Math.random().toString(36).slice(-8);
  
  const hashedPassword = await bcrypt.hash(password, 8);
  
  //const otp = Math.floor(1000 + Math.random() * 9000).toString();
  const otp = '1234';
  
  const hashedOtp = await bcrypt.hash(otp, 8);
    
  const expiresAt = moment().add(10, "minutes").toDate();
  
  if(d.role_type === 'superadmin'){
    throw new Error("You can't add superadmin.");
  }else{
  	const [result] = await pool.query(
      `INSERT INTO mypackages_users
       (usr_name,usr_last_name,usr_email,mobile_no,requested_payload,requested_ip,is_active,otp,expiration_date,role_type)
       VALUES (?, ?, ?, ?, ?, ?, 0, ?, ?, 'manager')`,
      [d.usr_name, d.usr_last_name, d.usr_email, d.mobile_no, JSON.stringify(d), userIp, hashedOtp, expiresAt]
    );
    
	const otp_text = `Your OTP verification code is: ${otp}`;
    const to = `+91${d.mobile_no}`;
    await sendUserSMS(to, otp_text);
    
    return {
       id : result.insertId,
       email: d.usr_email,
       mobile:d.mobile_no,
       otp
    };
  }
};

exports.list = async () => {
  const [rows] = await pool.query(`SELECT * FROM mypackages_users WHERE is_active = 1 AND is_superadmin != 1 AND role_type = 'manager' ORDER BY usr_id DESC`);
  return rows;
};

exports.details = async (user_id) => {
  const [rows] = await pool.query(`SELECT * FROM mypackages_users WHERE usr_id = ?`, user_id);
  return rows[0];
};

exports.update=async(data, user_id, ip)=>{
  const {
    usr_name,
    usr_last_name,
    mobile_no,
    usr_email
  } = data;

  if (!user_id) {
    throw new Error("user_id is required");
  }
  
  // Normalize IPv6
  const userIp = ip?.startsWith('::ffff:') ? ip.replace('::ffff:', '') : ip;

  const [result] = await pool.query(
    `UPDATE mypackages_users
     SET usr_name = ?,
         usr_last_name = ?,
         mobile_no = ?,
         usr_email = ?,
         requested_payload = ?,
         requested_ip = ?
     WHERE usr_id = ?`,
    [
      usr_name,
      usr_last_name,
      mobile_no,
      usr_email,
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