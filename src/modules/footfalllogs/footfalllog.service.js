const pool=require('../../config/database');

exports.create=async(d)=>{
  await pool.query(
    `INSERT INTO storetech_footfall_logs
     (locker_id,count,logged_at)
     VALUES (?,?,NOW())`,
    [d.locker_id,d.count]
  );
};
