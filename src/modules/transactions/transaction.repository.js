const pool = require('../../config/database');

exports.insertTransaction = async (data) => {
  const sql = `
    INSERT INTO storetech_transactions
      (locker_id, vendor, customer_type, event_type, time_taken_seconds, created_at)
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  return pool.execute(sql, [
    data.locker_id,
    data.vendor,
    data.customer_type,
    data.event_type,
    data.time_taken_seconds,
    data.created_at
  ]);
};
