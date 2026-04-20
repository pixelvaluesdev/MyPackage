const pool=require('../../config/database');

exports.create=async(d)=>{
  await pool.query(
    `INSERT INTO storetech_usage_logs
     (locker_id,event_type,used_at)
     VALUES (?,?,NOW())`,
    [d.locker_id,d.event_type]
  );
};
