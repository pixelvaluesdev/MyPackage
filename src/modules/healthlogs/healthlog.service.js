const pool = require('../../config/database');

exports.create = async (d, ip)=>{

  // Normalize IPv6
  const userIp = ip?.startsWith('::ffff:') ? ip.replace('::ffff:', '') : ip;

  const [rows] = await pool.query(
    `SELECT locker_id FROM mypackages_locker WHERE locker_code = ?`,
    [d.locker_id]
  );

  if (!rows || rows.length === 0) {
    throw new Error('Locker not found');
  }

  const locker = rows[0];

  const [result] = await pool.query(
    `INSERT INTO mypackages_healthlog
     (locker_id,locker_no,network,lock_status,camera,temperature,overall_status,requested_payload,requested_ip)
     VALUES (?,?,?,?,?,?,?,?,?)`,
    [locker.locker_id,d.locker_id, d.network, d.lock_status, d.camera, d.temperature, d.overall_status,JSON.stringify(d),userIp]
  );
  
  const [rowss] = await pool.query(
    `SELECT * FROM mypackages_healthlog WHERE health_id = ?`,
    [result.insertId]
  );

  return rowss[0];
};

exports.list = async () => {
  const [rows] = await pool.query(`SELECT * FROM mypackages_healthlog`);
  return rows;
};