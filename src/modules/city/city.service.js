const pool=require('../../config/database');

exports.create=async(d)=>{
  const [rows] = await pool.query(`SELECT * FROM mypackages_geo_state WHERE state_id = ?`, d.state_id);
  if(rows[0].length < 0){
    throw new Error("State Not Found");
  }else{
  	await pool.query(
      `INSERT INTO mypackages_geo_city
       (state_id,city_name,city_code,is_active)
       VALUES (?, ?, ?, 1)`,
      [d.state_id, d.city_name, d.city_code]
    );
  }
};

exports.list = async () => {
  const [rows] = await pool.query(`SELECT * FROM mypackages_geo_city WHERE is_active = 1`);
  return rows;
};

exports.details = async (city_id) => {
  const [rows] = await pool.query(`SELECT * FROM mypackages_geo_city WHERE city_id = ?`, city_id);
  return rows[0];
};

exports.update=async(data, city_id)=>{
  const {
    state_id,
    city_name,
    city_code
  } = data;

  if (!city_id) {
    throw new Error("city_id is required");
  }
  
  const [result] = await pool.query(
    `UPDATE mypackages_geo_city
     SET state_id = ?,
         city_name = ?
         city_code = ?,
     WHERE city_id = ?`,
    [
      state_id,
      city_name,
      city_code,
      city_id
    ]
  );
  
  if (result.affectedRows === 0) {
    throw new Error("City not found or no changes applied");
  }
  
  return true;
};

exports.delete = async (city_id) => {
  const [rows] = await pool.query(`DELETE FROM mypackages_geo_city WHERE city_id = ?`, city_id);
  return true;
};

exports.cityList = async (state_id) => {
  const [rows] = await pool.query(`SELECT * FROM mypackages_geo_city WHERE is_active = 1 AND state_id = ?`, state_id);
  return rows;
};