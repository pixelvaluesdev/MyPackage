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
        source: "redisxsx",
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

    if (!city_id) {
      return res.status(400).json({
        success: false,
        message: "city_id is required"
      });
    }

    // ✅ unique cache per customer
    const CACHE_KEY = `city_details:${city_id}`;

    // 1️⃣ Check Redis
    const cachedData = await redisClient.get(CACHE_KEY);

    if (cachedData) {
      return res.status(200).json({
        success: true,
        source: "redis",
        data: JSON.parse(cachedData)
      });
    }

    // 2️⃣ Fetch DB
    const dbData = await s.details(city_id);

    if (!dbData) {
      return res.status(404).json({
        success: false,
        message: "City not found"
      });
    }

    // 3️⃣ Save cache
    try {
      await redisClient.setEx(
        CACHE_KEY,
        300, // 5 min
        JSON.stringify(dbData)
      );
    } catch (redisErr) {
      console.error("Redis cache failed:", redisErr.message);
    }

    // 4️⃣ Return
    return res.status(200).json({
      success: true,
      source: "database",
      data: dbData
    });

  } catch (error) {
    console.error("city details error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message
    });
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

exports.cityList = async (req, res) => {
  try {
    const { state_id } = req.params;

    if (!state_id) {
      return res.status(400).json({
        success: false,
        message: "state_id is required"
      });
    }

    // ✅ unique cache per customer
    const CACHE_KEY = `city_list:${state_id}`;

    // 1️⃣ Check Redis
    const cachedData = await redisClient.get(CACHE_KEY);

    if (cachedData) {
      return res.status(200).json({
        success: true,
        source: "redis",
        data: JSON.parse(cachedData)
      });
    }

    // 2️⃣ Fetch DB
    const dbData = await s.cityList(state_id);

    if (!dbData) {
      return res.status(404).json({
        success: false,
        message: "City not found"
      });
    }

    // 3️⃣ Save cache
    try {
      await redisClient.setEx(
        CACHE_KEY,
        300, // 5 min
        JSON.stringify(dbData)
      );
    } catch (redisErr) {
      console.error("Redis cache failed:", redisErr.message);
    }

    // 4️⃣ Return
    return res.status(200).json({
      success: true,
      source: "database",
      data: dbData
    });

  } catch (error) {
    console.error("city details error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
      error: error.message
    });
  }
};
