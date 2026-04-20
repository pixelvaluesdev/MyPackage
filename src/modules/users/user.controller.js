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
    const {id , email, mobile, otp} = await s.create(req.body, ip);
    
    await redisClient.del(CACHE_KEY);
    
    // 2️⃣ Fetch latest data
    const freshData = await s.list();

    res.json({
      success: true,
      message: 'User created',
      data: {id, email, otp}
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

    if (!user_id) {
      return res.status(400).json({
        success: false,
        message: "user_id is required"
      });
    }

    // ✅ unique cache per customer
    const CACHE_KEY = `user_details:${user_id}`;

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
    const dbData = await s.details(user_id);

    if (!dbData) {
      return res.status(404).json({
        success: false,
        message: "User not found"
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
    console.error("User details error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message
    });
  }
};

exports.update = async (req, res) => {
  try {

    const { user_id } = req.params;

    const ip =
      req.headers['x-forwarded-for']?.split(',')[0] ||
      req.socket.remoteAddress ||
      null;

    // Update DB
    await s.update(req.body, user_id, ip);

    // Cache Keys
    const listKey = "user_list";
    const detailKey = `user_details:${user_id}`;

    // Delete cache
    const del1 = await redisClient.del(listKey);
    const del2 = await redisClient.del(detailKey);

    console.log("Deleted:", del1, del2);

    res.json({
      success: true,
      message: 'User updated successfully'
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      success: false,
      error: error.message
    });

  }
};

exports.delete = async (req, res) => {
  try {
    
    const { user_id } = req.params;
    
    const CACHE_KEY = "user_list";
    
    const detailKey = `user_details:${user_id}`;
    
    const dbData = await s.delete(user_id);

    await redisClient.del(CACHE_KEY);
    
    await redisClient.del(detailKey);
    
    return res.json({
      success: true,
      source: "database",
      data: dbData
    });

  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
