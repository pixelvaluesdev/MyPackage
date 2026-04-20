const fs = require('fs');
const csv = require('csv-parser');
const pool = require('../../config/database');
const repo = require('./transaction.repository');
const { Parser } = require('json2csv');

exports.create = async (d, ip) => {
  const start = Date.now();

  try {
    // Normalize IPv6
    const userIp = ip?.startsWith('::ffff:')
      ? ip.replace('::ffff:', '')
      : ip;

    // Get locker
    const [lockerRows] = await pool.query(
      `SELECT locker_id FROM mypackages_locker WHERE locker_code = ?`,
      [d.locker_id]
    );

    if (!lockerRows || lockerRows.length === 0) {
      throw new Error('Locker not found');
    }

    const locker = lockerRows[0];

    const responseTime = Date.now() - start;
    const transaction_id = d.transaction_id ?? null;

    // INSERT CASE
    if (!transaction_id) {
      const [result] = await pool.query(
        `INSERT INTO mypackages_txn_events 
        (locker_id, locker_no, vendor, event_type, time_taken_seconds, compartment_size, event_timestamp, requested_payload, requested_ip, delivery_person_name, flat_no, user_name, whatsapp_status, otp) 
        VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
        [
          locker.locker_id,
          d.locker_id,
          d.vendor,
          d.event_type,
          responseTime, // use calculated time
          d.compartment_size,
          d.timestamp,
          JSON.stringify(d),
          userIp,
          d.delivery_person_name,
          d.flat_no,
          d.user_name,
          d.whatsapp_status,
          d.otp
        ]
      );

      const [insertedRows] = await pool.query(
        `SELECT * FROM mypackages_txn_events WHERE transaction_id = ?`,
        [result.insertId]
      );

      return insertedRows[0];
    }

    // UPDATE CASE
    await pool.query(
      `UPDATE mypackages_txn_events SET
        vendor = ?,
        pickup_status = ?,
        time_taken_seconds = ?,
        compartment_size = ?,
        pick_time = ?,
        requested_payload = ?,
        requested_ip = ?,
        delivery_person_name = ?,
        flat_no = ?,
        user_name = ?,
        whatsapp_status = ?,
        otp = ?
      WHERE transaction_id = ?`,
      [
        d.vendor,
        d.event_type, // maps to pickup_status
        responseTime,
        d.compartment_size,
        d.timestamp,
        JSON.stringify(d),
        userIp,
        d.delivery_person_name,
        d.flat_no,
        d.user_name,
        d.whatsapp_status,
        d.otp,
        transaction_id
      ]
    );

    const [updatedRows] = await pool.query(
      `SELECT * FROM mypackages_txn_events WHERE transaction_id = ?`,
      [transaction_id]
    );

    return updatedRows[0];

  } catch (err) {
    console.error('Error in create txn:', err);
    throw err;
  }
};

exports.importCSVOLD = async (filePath) => {
  const rows = [];

  return new Promise((resolve, reject) => {
    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (row) => rows.push(row))
      .on('end', async () => {
        const conn = await pool.getConnection();
        try {
          await conn.beginTransaction();

          for (const r of rows) {
            await repo.insertTransaction(conn, {
              locker_id: r.locker_id,
              vendor: r.vendor,
              customer_type: r.customer_type,
              event_type: r.event_type,
              time_taken_seconds: r.time_taken_seconds,
              created_at: r.timestamp
            });
          }

          await conn.commit();
          resolve({ inserted: rows.length });
        } catch (err) {
          await conn.rollback();
          reject(err);
        } finally {
          conn.release();
        }
      });
  });
};

exports.importCSV = async (filePath, ip) => {
  const rows = [];
  const userIp = ip?.startsWith('::ffff:') ? ip.replace('::ffff:', '') : ip;

  return new Promise((resolve, reject) => {
    fs.createReadStream(filePath)
      .pipe(csv({ separator: ',', mapHeaders: ({ header }) => header.trim() }))
      .on('data', (row) => {
        if (Object.keys(row).length === 1) {
            // CSV was read as one column, split manually
            const values = Object.values(row)[0].split(',');
            const keys = ['locker_id','locker_no','vendor','event_type','time_taken_seconds','compartment_size','created_at'];
            const cleanedRow = {};
            keys.forEach((k, i) => cleanedRow[k] = values[i]?.trim() || null);
            rows.push(cleanedRow);
        } else {
            const cleanedRow = {};
            for (const key in row) cleanedRow[key] = row[key]?.trim() || null;
            rows.push(cleanedRow);
        }
      })
      .on('end', async () => {
        if (!rows.length) {
          fs.unlinkSync(filePath);
          return resolve({ inserted: 0 });
        }

        const conn = await pool.getConnection();
        try {
          await conn.beginTransaction();

          for (const data of rows) {
            await conn.execute(
              `
              INSERT INTO mypackages_txn_events
                (locker_id, locker_no, vendor, event_type, time_taken_seconds, compartment_size, event_timestamp, requested_payload, requested_ip)
              VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
              `,
              [
                data.locker_id ?? null,
                data.locker_no ?? null,
                data.vendor ?? null,
                data.event_type ?? null,
                data.time_taken_seconds ?? null,
                data.compartment_size ?? null,
                data.created_at ? new Date(data.created_at) : new Date(),
                JSON.stringify(data),
                userIp
              ]
            );
          }

          await conn.commit();
          resolve({ inserted: rows.length });
        } catch (err) {
          await conn.rollback();
          reject(err);
        } finally {
          conn.release();
          fs.unlinkSync(filePath);
        }
      })
      .on('error', (err) => {
        fs.unlinkSync(filePath);
        reject(err);
      });
  });
};

exports.list = async () => {
  const [rows] = await pool.query(`SELECT * FROM mypackages_txn_events ORDER BY transaction_id DESC`);
  return rows;
};

exports.transactionList = async (locker_id) => {
  const [rows] = await pool.query(`SELECT * FROM mypackages_txn_events WHERE locker_id = ? ORDER BY transaction_id DESC`, locker_id);
  return rows;
};
    
exports.details = async (transaction_id) => {
  const [rows] = await pool.query(`SELECT * FROM mypackages_txn_events WHERE transaction_id = ?`, transaction_id);
  return rows[0];
};

exports.update = async (data, transaction_id, ip) => {
  const {
    locker_id,
    locker_no,
    vendor,
    event_type,
    time_taken_seconds,
    compartment_size
  } = data;

  if (!transaction_id) {
    throw new Error("transaction_id is required");
  }
  
  const start = Date.now();

  const userIp = ip?.startsWith('::ffff:')
    ? ip.replace('::ffff:', '')
    : ip;

  const [result] = await pool.query(
    `UPDATE mypackages_txn_events
     SET locker_id = ?,
         locker_no = ?,
         vendor = ?,
         event_type = ?,
         time_taken_seconds = ?,
         compartment_size = ?,
         requested_payload = ?,
         requested_ip = ?
     WHERE transaction_id = ?`,
    [
      locker_id,
      locker_no,
      vendor,
      event_type,
      time_taken_seconds,
      compartment_size,
      JSON.stringify(data),
      userIp,
      transaction_id
    ]
  );

  if (result.affectedRows === 0) {
    throw new Error("Transaction not found or no changes applied");
  }

  const responseTime = Date.now() - start;

  return true;
};

exports.delete = async (transaction_id) => {
  const [rows] = await pool.query(`DELETE FROM mypackages_txn_events WHERE transaction_id = ?`, transaction_id);
  return true;
};    

exports.exportUsersCSV = async (req, res) => {
  try {
    // 1️⃣ Fetch data
    const [rows] = await pool.query(`
      SELECT 
        usr_id,
        usr_name,
        usr_email,
        mobile_no,
        created_at
      FROM mypackages_users
    `);

    if (!rows.length) {
      return res.status(404).json({ message: 'No data found' });
    }

    // 2️⃣ Custom headers mapping
    const fields = [
      { label: 'User ID', value: 'usr_id' },
      { label: 'Full Name', value: 'usr_name' },
      { label: 'Email Address', value: 'usr_email' },
      { label: 'Mobile Number', value: 'mobile_no' },
      { label: 'Created Date', value: 'created_at' }
    ];

    const parser = new Parser({ fields });
    const csv = parser.parse(rows);

    // 3️⃣ Download
    res.header('Content-Type', 'text/csv');
    res.attachment('users.csv');

    res.send(csv);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
    