const s=require('./profile.service');
const redisClient = require("../../config/redis");

exports.update = async (req, res) => {
  try {
    const { user_id } = req.params;
    //const CACHE_KEY = "city_list";

    // 1️⃣ Insert into DB
    await s.update(req.body, req.file, user_id);

    // 3️⃣ Update Redis immediately
    /*await redisClient.setEx(
      CACHE_KEY,
      300, // 5 minutes
      JSON.stringify(freshData)
    );*/

    res.json({
      success: true,
      message: 'Profle updated'
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.details = async (req, res) => {
  try {
    
    const { user_id } = req.params;
    
    /*const CACHE_KEY = "city_list";

    const cachedData = await redisClient.get(CACHE_KEY);

    if (cachedData) {
      return res.json({
        success: true,
        source: "redis",
        data: JSON.parse(cachedData)
      });
    }*/

    const dbData = await s.details(user_id);

    /*await redisClient.setEx(
      CACHE_KEY,
      300,
      JSON.stringify(dbData)
    );*/

    return res.json({
      success: true,
      source: "database",
      data: dbData
    });

  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.settings = async (req, res) => {
  try {
    
    const dbData = await s.settings();

    return res.json({
      success: true,
      source: "database",
      data: dbData
    });

  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
