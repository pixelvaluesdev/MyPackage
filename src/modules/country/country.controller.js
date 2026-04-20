const s=require('./user.service');
const redisClient = require("../../config/redis");

exports.create = async (req, res) => {
  try {
    const CACHE_KEY = "user_list";

    const ip =
      req.headers['x-forwarded-for']?.split(',')[0] ||
      req.socket.remoteAddress ||
      null;

    // 1️⃣ Insert into DB
    await s.create(req.body, ip);

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
      message: 'User created'
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.list = async (req, res) => {
  try {
    const CACHE_KEY = "user_list";

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
    
    const { user_id } = req.params;
    
    const CACHE_KEY = "user_list";

    const cachedData = await redisClient.get(CACHE_KEY);

    if (cachedData) {
      return res.json({
        success: true,
        source: "redis",
        data: JSON.parse(cachedData)
      });
    }

    const dbData = await s.details(user_id);

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
    const { user_id } = req.params;
    
    const CACHE_KEY = "user_list";

    const ip =
      req.headers['x-forwarded-for']?.split(',')[0] ||
      req.socket.remoteAddress ||
      null;

    // 1️⃣ Insert into DB
    await s.update(req.body, user_id, ip);

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
      message: 'User log updated'
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.delete = async (req, res) => {
  try {
    
    const { user_id } = req.params;
    
    const CACHE_KEY = "user_list";

    const cachedData = await redisClient.get(CACHE_KEY);

    if (cachedData) {
      return res.json({
        success: true,
        source: "redis",
        data: JSON.parse(cachedData)
      });
    }

    const dbData = await s.delete(user_id);

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
