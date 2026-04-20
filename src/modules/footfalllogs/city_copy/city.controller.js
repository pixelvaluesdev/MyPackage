const s=require('./city.service');
const redisClient = require("../../config/redis");

exports.create = async (req, res) => {
  try {
    const CACHE_KEY = "city_list";

    // 1️⃣ Insert into DB
    await s.create(req.body);

    // 2️⃣ Fetch latest data
    const freshData = await s.list();

    // 3️⃣ Update Redis immediately
    await redisClient.setEx(
      CACHE_KEY,
      300, // 5 minutes
      JSON.stringify(freshData)
    );

    res.json({
      success: true,
      message: 'City created'
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.list = async (req, res) => {
  try {
    const CACHE_KEY = "city_list";

    const cachedData = await redisClient.get(CACHE_KEY);

    if (cachedData) {
      return res.json({
        success: true,
        source: "redis",
        data: JSON.parse(cachedData)
      });
    }

    const dbData = await s.list();

    await redisClient.setEx(
      CACHE_KEY,
      300,
      JSON.stringify(dbData)
    );

    return res.json({
      success: true,
      source: "database",
      data: dbData
    });

  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.details = async (req, res) => {
  try {
    
    const { city_id } = req.params;
    
    const CACHE_KEY = "city_list";

    const cachedData = await redisClient.get(CACHE_KEY);

    if (cachedData) {
      return res.json({
        success: true,
        source: "redis",
        data: JSON.parse(cachedData)
      });
    }

    const dbData = await s.details(city_id);

    await redisClient.setEx(
      CACHE_KEY,
      300,
      JSON.stringify(dbData)
    );

    return res.json({
      success: true,
      source: "database",
      data: dbData
    });

  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.update = async (req, res) => {
  try {
    const { city_id } = req.params;
    
    const CACHE_KEY = "city_list";

    // 1️⃣ Insert into DB
    await s.update(req.body, city_id);

    // 2️⃣ Fetch latest data
    const freshData = await s.list();

    // 3️⃣ Update Redis immediately
    await redisClient.setEx(
      CACHE_KEY,
      300, // 5 minutes
      JSON.stringify(freshData)
    );

    res.json({
      success: true,
      message: 'City updated'
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.delete = async (req, res) => {
  try {
    
    const { city_id } = req.params;
    
    const CACHE_KEY = "city_list";

    const cachedData = await redisClient.get(CACHE_KEY);

    if (cachedData) {
      return res.json({
        success: true,
        source: "redis",
        data: JSON.parse(cachedData)
      });
    }

    const dbData = await s.delete(city_id);

    await redisClient.setEx(
      CACHE_KEY,
      300,
      JSON.stringify(dbData)
    );

    return res.json({
      success: true,
      source: "database",
      data: dbData
    });

  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
