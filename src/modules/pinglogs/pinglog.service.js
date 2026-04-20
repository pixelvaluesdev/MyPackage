const pool=require('../../config/database');

exports.create=async(d, ip)=>{
  const start = Date.now();

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

  const responseTime = Date.now() - start;

  const [result] = await pool.query(
    `INSERT INTO mypackages_pinglog
     (locker_no,locker_id,ping_status,response_time_ms,requested_payload,requested_ip,timestamp)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [d.locker_id, locker.locker_id, d.status, responseTime, JSON.stringify(d), userIp,d.timestamp]
  );
  
  const [rowss] = await pool.query(
    `SELECT * FROM mypackages_pinglog WHERE ping_id = ?`,
    [result.insertId]
  );

  return rowss[0];
};

exports.list = async () => {
  const [rows] = await pool.query(`SELECT * FROM mypackages_pinglog`);
  return rows;
};

exports.countOnline = async () => {
  const [rows] = await pool.query(`SELECT COUNT(*) AS online_count FROM mypackages_healthlog WHERE overall_status = 'healthy'`);
  return rows;
};