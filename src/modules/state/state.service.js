const pool=require('../../config/database');

exports.create=async(d)=>{
  const [rows] = await pool.query(`SELECT * FROM mypackages_geo_country WHERE country_id = ?`, d.country_id);
  if(rows[0].length < 0){
    throw new Error("Country Not Found");
  }else{
  	await pool.query(
      `INSERT INTO mypackages_geo_state
       (country_id,state_name,state_code,is_active)
       VALUES (?, ?, ?, 1)`,
      [d.country_id, d.state_name, d.state_code]
    );
  }
};

exports.list = async () => {
  const [rows] = await pool.query(`SELECT * FROM mypackages_geo_state WHERE is_active = 1`);
  return rows;
};

exports.details = async (state_id) => {
  const [rows] = await pool.query(`SELECT * FROM mypackages_geo_state WHERE state_id = ?`, state_id);
  return rows[0];
};

exports.update=async(data, state_id)=>{
  const {
    country_id,
    state_name,
    state_code
  } = data;

  if (!state_id) {
    throw new Error("state_id is required");
  }
  
  const [result] = await pool.query(
    `UPDATE mypackages_geo_state
     SET country_id = ?,
         state_name = ?
         state_code = ?,
     WHERE state_id = ?`,
    [
      country_id,
      state_name,
      state_code,
      state_id
    ]
  );
  
  if (result.affectedRows === 0) {
    throw new Error("State not found or no changes applied");
  }
  
  return true;
};

exports.delete = async (state_id) => {
  const [rows] = await pool.query(`DELETE FROM mypackages_geo_state WHERE state_id = ?`, state_id);
  return true;
};