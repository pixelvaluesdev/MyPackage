const pool = require('../../config/database');
const moment = require('moment');
const bcrypt = require('bcrypt');
const { sendUserEmail } = require("../../middlewares/twilio_mail.middleware");
const { sendUserSMS } = require('../../middlewares/twillio.middleware');

exports.create = async (data, ip) => {
  const {
    locker_id,
    first_name,
    last_name,
    email,
    phone_no,
    floor_no,
    flat_no,
    building_no
  } = data;

  // 1️⃣ Clean IP
  const userIp = ip?.replace('::ffff:', '') || null;

  // 2️⃣ Generate OTP
  //const otp = "1234";
  const otp = Math.floor(1000 + Math.random() * 9000).toString();

  // 3️⃣ Expiry time (Date object, not string)
  const expiresAt = moment() .add(3, 'minutes') .format('YYYY-MM-DD HH:mm:ss');

  // 4️⃣ Hash OTP
  const hashedOtp = await bcrypt.hash(otp, 10);

  // 5️⃣ Check locker exists (only fetch id)
  const [lockerRows] = await pool.query(
    `SELECT locker_id FROM mypackages_locker WHERE locker_id = ? LIMIT 1`,
    [locker_id]
  );

  if (!lockerRows.length) {
    throw new Error("Locker not found");
  }

  // 6️⃣ Insert customer
  const [result] = await pool.query(
    `INSERT INTO mypackages_customers (
      locker_id,
      first_name,
      last_name,
      email,
      phone_no,
      floor_no,
      flat_no,
      building_no,
      otp,
      expiration_date,
      requested_payload,
      requested_ip
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      locker_id,
      first_name,
      last_name,
      email,
      phone_no,
      floor_no,
      flat_no,
      building_no,
      hashedOtp,
      expiresAt,
      JSON.stringify(data),
      userIp
    ]
  );

  const otp_text = `Your OTP verification code is: ${otp}`;
  const to = `+91${phone_no}`;
  await sendUserSMS(to, otp_text);
  
  // 7️⃣ Return only safe response
  return {
     id : result.insertId,
     otp
  };
};

exports.list = async (filters = {}) => {
  let query = `SELECT * FROM mypackages_customers WHERE 1=1`;
  const params = [];

  if (filters.floor_no) {
    query += ` AND floor_no = ?`;
    params.push(filters.floor_no);
  }

  if (filters.flat_no) {
    query += ` AND flat_no = ?`;
    params.push(filters.flat_no);
  }

  if (filters.building_no) {
    query += ` AND building_no = ?`;
    params.push(filters.building_no);
  }

  const [rows] = await pool.query(query, params);
  return rows;
};

exports.details = async (customer_id) => {
  const [rows] = await pool.query(`SELECT * FROM mypackages_customers WHERE id = ?`, customer_id);
  return rows[0];
};

exports.update = async (data, customer_id, ip) => {
  const { first_name, last_name, email, phone_no, floor_no, flat_no, building_no } = data;

  if (!customer_id) {
    throw new Error("customer_id is required");
  }
  
  const start = Date.now();

  const userIp = ip?.startsWith('::ffff:')
    ? ip.replace('::ffff:', '')
    : ip;

  const [result] = await pool.query(
    `UPDATE mypackages_customers
     SET first_name = ?,
         last_name = ?,
         email = ?,
         phone_no = ?,
         floor_no = ?,
         flat_no = ?,
         building_no = ?
     WHERE id = ?`,
    [
      first_name,
      last_name,
      email,
      phone_no,
      floor_no,
      flat_no,
      building_no,
      customer_id
    ]
  );

  if (result.affectedRows === 0) {
    throw new Error("Customer not found or no changes applied");
  }

  return true;
};

exports.delete = async (customer_id) => {
  const [rows] = await pool.query(`DELETE FROM mypackages_customers WHERE id = ?`, customer_id);
  return true;
};


exports.otpCheck = async (customer_id) => {
  const [rows] = await pool.query(`SELECT * FROM mypackages_customers WHERE id = ?`, customer_id);
  await pool.query(`UPDATE mypackages_customers SET status = 1 WHERE id = ?`, customer_id);
  return rows[0];
};

exports.otpVerify = async (customer_id) => {
  const pin = Math.random().toString(36).slice(-8);
  
  const hashedPassword = await bcrypt.hash(pin, 8);
  
  const [rows] = await pool.query(`SELECT * FROM mypackages_users WHERE usr_id = ?`, customer_id);
  await pool.query(`UPDATE mypackages_users SET is_active = 1, usr_password = ?, encryption = ? WHERE usr_id = ?`, [hashedPassword, pin, customer_id]);
  const user = { email: rows[0].usr_email, name: "MyPackage" };
  await sendUserEmail(user, pin);
    
  return rows[0];
};

exports.allCustomerlist = async () => {
  const [rows] = await pool.query(`SELECT c.*,l.locker_code 
   FROM mypackages_customers c 
   JOIN mypackages_locker l 
   ON c.locker_id = l.locker_id 
   WHERE c.status = 1 
   ORDER BY c.id DESC`);
  return rows;
};

exports.customerlist = async (locker_id) => {
  const [rows] = await pool.query(`SELECT c.*,l.locker_code 
   FROM mypackages_customers c 
   JOIN mypackages_locker l 
   ON c.locker_id = l.locker_id 
   WHERE c.locker_id = ? 
   AND c.status = 1 
   ORDER BY c.id DESC`, [locker_id]);
  return rows;
};