const pool=require('../../config/database');

exports.details = async (user_id) => {
  const [rows] = await pool.query(`SELECT * FROM mypackages_users WHERE usr_id = ?`, user_id);
  return rows[0];
};

exports.update=async(data, file, user_id)=>{
  const {
    first_name,
    last_name,
    email,
    mobile_no,
    app_name
  } = data;

  if (!user_id) {
    throw new Error("user_id is required");
  }
  
  let profileImgUrl = null;

  if (file) {
    const baseUrl = process.env.BASE_URL;
    profileImgUrl = `${baseUrl}/${file.path.replace(/\\/g, '/')}`;
  }
  
  const [result] = await pool.query(
    `UPDATE mypackages_users
     SET usr_name = ?,
         usr_last_name = ?,
         usr_email = ?,
         mobile_no = ?,
         requested_payload = ?,
         profile_img = ?,
         app_name = ?
     WHERE usr_id = ?`,
    [
      first_name,
      last_name,
      email,
      mobile_no,
      JSON.stringify(data),
      profileImgUrl,
      app_name,
      user_id
    ]
  );
  
  if (result.affectedRows === 0) {
    throw new Error("User not found or no changes applied");
  }
  
  return true;
};

exports.settings = async () => {
  const [rows] = await pool.query(`SELECT * FROM mypackages_users WHERE usr_id = 1`);
  return rows[0];
};
