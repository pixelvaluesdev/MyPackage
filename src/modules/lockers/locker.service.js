require('dotenv').config();
const pool = require('../../config/database');
const redisClient = require("../../config/redis");
const QRCode = require('qrcode');

exports.create = async (data,ip) => {
  const { locker_name, state, city, area, latitude, longitude, status, s_compartment,m_compartment,l_compartment,exl_compartment } = data;

  const start = Date.now();

  const userIp = ip?.startsWith('::ffff:') ? ip.replace('::ffff:', '') : ip;

  const responseTime = Date.now() - start;
   
  if ([s_compartment, m_compartment, l_compartment, exl_compartment]
    .some(v => isNaN(Number(v)))) {
    throw new Error("Invalid compartment values");
  }
  
  const total_compartment =
  Number(s_compartment || 0) +
  Number(m_compartment || 0) +
  Number(l_compartment || 0) +
  Number(exl_compartment || 0);

  const [result] = await pool.query(
    `INSERT INTO mypackages_locker
     (locker_name, state, city, area, latitude, longitude, status, install_date,
      requested_payload, requested_ip, response_time,
      s_compartment, m_compartment, l_compartment, exl_compartment, no_of_compartment)
     VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      locker_name, state, city, area, latitude, longitude, status,
      JSON.stringify(data), userIp, responseTime,
      s_compartment, m_compartment, l_compartment, exl_compartment,
      total_compartment
    ]
  );
  
  const lockerId = result.insertId;

  const [cityRows] = await pool.query(
    `SELECT city_code FROM mypackages_geo_city WHERE city_id = ?`,
    [city]
  );

  if (!cityRows.length) {
    throw new Error("City not found");
  }

  const locker_code = `ST-${cityRows[0].city_code}-${lockerId}`;
  const locker_id_encrypted = btoa(lockerId); 
  const qrData = `${process.env.BASE_URL_FRONTEND}/register/${locker_id_encrypted}`;
  
  const qr_code = await QRCode.toDataURL(qrData, {
    errorCorrectionLevel: 'H',
    type: 'image/png',
    width: 300,
    margin: 2,
    color: {
      dark: '#FF981B',
      light: '#FFFFFF'
    }
  });
  
  await pool.query(
    `UPDATE mypackages_locker SET locker_code = ?, qr_code = ? WHERE locker_id = ?`,
    [locker_code, qrData, lockerId]
  );
  return lockerId;
};


exports.list = async () => {
  const [rows] = await pool.query(`
    SELECT l.*,COALESCE(h.overall_status, 'new') as overall_status,COALESCE(h.logged_at, '2026-03-20 08:52:38') as logged_at
    FROM mypackages_locker AS l
    LEFT JOIN mypackages_healthlog h ON h.locker_id = l.locker_id
	ORDER BY l.locker_id DESC;
  `);
   return rows;
};

exports.details = async (locker_id) => {
  const [rows] = await pool.query(`SELECT * FROM mypackages_locker WHERE locker_id = ?`, locker_id);
  return rows[0];
};

exports.update = async (data, locker_id, ip) => {
  const {
    locker_name,
    city,
    area,
    latitude,
    longitude,
    status
  } = data;

  if (!locker_id) {
    throw new Error("locker_id is required");
  }
  
  const start = Date.now();

  const userIp = ip?.startsWith('::ffff:')
    ? ip.replace('::ffff:', '')
    : ip;

  const [result] = await pool.query(
    `UPDATE mypackages_locker
     SET locker_name = ?,
         city = ?,
         area = ?,
         latitude = ?,
         longitude = ?,
         status = ?,
         requested_payload = ?,
         requested_ip = ?
     WHERE locker_id = ?`,
    [
      locker_name,
      city,
      area,
      latitude,
      longitude,
      status,
      JSON.stringify(data),
      userIp,
      locker_id
    ]
  );

  if (result.affectedRows === 0) {
    throw new Error("Locker not found or no changes applied");
  }

  const [cityRows] = await pool.query(
    `SELECT city_code FROM mypackages_geo_city WHERE city_id = ?`,
    [city]
  );

  if (!cityRows.length) {
    throw new Error("City not found");
  }

  const responseTime = Date.now() - start;

  await pool.query(
    `UPDATE mypackages_locker SET response_time = ? WHERE locker_id = ?`,
    [responseTime, locker_id]
  );

  return true;
};

exports.delete = async (locker_id) => {
  const [rows] = await pool.query(`DELETE FROM mypackages_locker WHERE locker_id = ?`, locker_id);
  return true;
};

exports.buildingList = async () => {
  const [rows] = await pool.query(`
    SELECT id, first_name, last_name, phone_no, flat_no
    FROM mypackages_customers
    ORDER BY flat_no
  `);

  const result = {};

  for (const row of rows) {
    // group by flat_no
    if (!result[row.flat_no]) {
      result[row.flat_no] = {
        flat_no: row.flat_no,
        users: []
      };
    }

    result[row.flat_no].users.push({
      id: row.id,
      name: `${row.first_name} ${row.last_name || ''}`,
      mobile_no: row.phone_no
    });
  }

  return Object.values(result);
};

exports.buildingListAll = async () => {
  const [rows] = await pool.query(`
    SELECT MIN(id) AS id, flat_no
    FROM mypackages_customers GROUP BY flat_no
  `);
  return rows;
};

exports.buildingDetails = async (building_no) => {
  const [rows] = await pool.query(`SELECT id,locker_id,first_name,last_name,email,phone_no,floor_no,flat_no,building_no FROM mypackages_customers WHERE flat_no = ?`, building_no);
  return rows;
};

exports.buildingListByLockerId = async (locker_id) => {
  const [lockerRows] = await pool.query(`SELECT * FROM mypackages_locker WHERE locker_code = ?`, locker_id);
  if (!lockerRows.length) {
    return [];
  }

  const lockerId = lockerRows[0].locker_id;
  const [rows] = await pool.query(`
    SELECT id, first_name, last_name, phone_no, flat_no
    FROM mypackages_customers WHERE locker_id = ?
    ORDER BY flat_no
  `,lockerId);

  const result = {};

  for (const row of rows) {
    // group by flat_no
    if (!result[row.flat_no]) {
      result[row.flat_no] = {
        flat_no: row.flat_no,
        users: []
      };
    }

    result[row.flat_no].users.push({
      id: row.id,
      name: `${row.first_name} ${row.last_name || ''}`,
      mobile_no: row.phone_no
    });
  }

  return Object.values(result);
};

exports.buildingListAllByLockerId = async (locker_code) => {
  // Step 1: Get locker details
  const [lockerRows] = await pool.query(
    `SELECT * FROM mypackages_locker WHERE locker_code = ?`,
    [locker_code] // ✅ pass as array
  );

  // Step 2: Check if locker exists
  if (!lockerRows.length) {
    return [];
  }

  const lockerId = lockerRows[0].locker_id;

  // Step 3: Get unique flat numbers
  const [rows] = await pool.query(
    `
    SELECT MIN(id) AS id, flat_no
    FROM mypackages_customers 
    WHERE locker_id = ? 
    GROUP BY flat_no
    `,
    [lockerId] // ✅ correct param
  );

  return rows;
};
exports.buildingDetailsByLockerId = async (building_no,locker_id) => {
  const [lockerRows] = await pool.query(`SELECT * FROM mypackages_locker WHERE locker_code = ?`, locker_id);
  if (!lockerRows.length) {
    return [];
  }

  const lockerId = lockerRows[0].locker_id;
  const [rows] = await pool.query(`SELECT id,locker_id,first_name,last_name,email,phone_no,floor_no,flat_no,building_no FROM mypackages_customers WHERE flat_no = ? AND locker_id = ?`, [building_no, lockerId]);
  return rows;
};