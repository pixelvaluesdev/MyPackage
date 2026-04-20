const service = require('./dashboard.service');
const redisClient = require("../../config/redis");

exports.details = async (req, res) => {
  try {
    
   const {
      user_id
    } = req.params;
    
    /*const CACHE_KEY = "dashboard_list";

    const cachedData = await redisClient.get(CACHE_KEY);

    if (cachedData) {
      return res.json({
        success: true,
        source: "redis",
        data: JSON.parse(cachedData)
      });
    }*/

    const dbData = await service.details(user_id);

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

exports.filter = async (req, res) => {
  try {
    
    const { user_id } = req.params;
    const { state, city, area, period } = req.body;
    
    /*const CACHE_KEY = "dashboard_list";

    const cachedData = await redisClient.get(CACHE_KEY);

    if (cachedData) {
      return res.json({
        success: true,
        source: "redis",
        data: JSON.parse(cachedData)
      });
    }*/

    const dbData = await service.filter(user_id, state, city, area, period);

    /*await redisClient.setEx(
      CACHE_KEY,
      300,
      JSON.stringify(dbData)
    );*/

    return res.json({
      success: true,
      source: "databasess",
      data: dbData
    });

  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
