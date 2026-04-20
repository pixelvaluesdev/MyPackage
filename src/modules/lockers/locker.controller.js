const service = require('./locker.service');
const redisClient = require("../../config/redis");

// exports.create = async (req,res)=>{
//   // ❗ Clear old cache
//   await redisClient.del("locker_list");
//   res.json({ id: await service.create(req.body) });
// };

exports.create = async (req, res) => {
  try {
    const CACHE_KEY = "locker_list";

    const ip =
      req.headers['x-forwarded-for']?.split(',')[0] ||
      req.socket.remoteAddress ||
      null;

    // 1️⃣ Insert into DB
    await service.create(req.body, ip);
    // 2️⃣ Fetch latest data
    const freshData = await service.list();

    // 3️⃣ Update Redis immediately
    await redisClient.setEx(
      CACHE_KEY,
      300, // 5 minutes
      JSON.stringify(freshData)
    );

    res.json({
      success: true,
      message: 'Locker log created'
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.list = async (req, res) => {
  try {
    const CACHE_KEY = "locker_list";

    const cachedData = await redisClient.get(CACHE_KEY);

    if (cachedData) {
      return res.json({
        success: true,
        source: "redis",
        data: JSON.parse(cachedData)
      });
    }

    const dbData = await service.list();

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
    const { locker_id } = req.params;

    if (!locker_id) {
      return res.status(400).json({
        success: false,
        message: "locker_id is required"
      });
    }

    // ✅ unique cache per customer
    const CACHE_KEY = `locker_details:${locker_id}`;

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
    const dbData = await service.details(locker_id);

    if (!dbData) {
      return res.status(404).json({
        success: false,
        message: "Locker not found"
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
    console.error("Locker details error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message
    });
  }
};

exports.update = async (req, res) => {
  try {
    const { locker_id } = req.params;
    
    const CACHE_KEY = "locker_list";

    const ip =
      req.headers['x-forwarded-for']?.split(',')[0] ||
      req.socket.remoteAddress ||
      null;

    // 1️⃣ Insert into DB
    await service.update(req.body, locker_id, ip);

    // 2️⃣ Fetch latest data
    const freshData = await service.list();

    // 3️⃣ Update Redis immediately
    await redisClient.setEx(
      CACHE_KEY,
      300, // 5 minutes
      JSON.stringify(freshData)
    );

    res.json({
      success: true,
      message: 'Locker log updated'
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.delete = async (req, res) => {
  try {
    
    const { locker_id } = req.params;
    
    const CACHE_KEY = "locker_list";

    const cachedData = await redisClient.get(CACHE_KEY);

    if (cachedData) {
      return res.json({
        success: true,
        source: "redis",
        data: JSON.parse(cachedData)
      });
    }

    const dbData = await service.delete(locker_id);

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

exports.buildingList = async (req, res) => {
  try {
    const CACHE_KEY = "building_list";

    const cachedData = await redisClient.get(CACHE_KEY);

    if (cachedData) {
      return res.json({
        success: true,
        source: "redis",
        data: JSON.parse(cachedData)
      });
    }

    const dbData = await service.buildingList();

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

exports.buildingListAll = async (req, res) => {
  try {
    const CACHE_KEY = "building_list_All";

    const cachedData = await redisClient.get(CACHE_KEY);

    if (cachedData) {
      return res.json({
        success: true,
        source: "redis",
        data: JSON.parse(cachedData)
      });
    }

    const dbData = await service.buildingListAll();

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

exports.buildingDetails = async (req, res) => {
  try {
    const { building_no } = req.params;

    if (!building_no) {
      return res.status(400).json({
        success: false,
        message: "building_no is required"
      });
    }

    // ✅ unique cache per customer
    const CACHE_KEY = `building_details:${building_no}`;

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
    const dbData = await service.buildingDetails(building_no);

    if (!dbData) {
      return res.status(404).json({
        success: false,
        message: "Locker building details not found"
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
    console.error("Locker building details error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message
    });
  }
};


exports.buildingListByLockerId = async (req, res) => {
  try {
    const { locker_id } = req.params;
    
    const dbData = await service.buildingListByLockerId(locker_id);

    return res.json({
      success: true,
      source: "database",
      data: dbData
    });

  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.buildingListAllByLockerId = async (req, res) => {
  try {
    const { locker_id } = req.params;
    

    const dbData = await service.buildingListAllByLockerId(locker_id);

    return res.json({
      success: true,
      source: "database",
      data: dbData
    });

  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.buildingDetailsByLockerId = async (req, res) => {
  try {
    const { building_no, locker_id } = req.params;

    if (!building_no) {
      return res.status(400).json({
        success: false,
        message: "building_no is required"
      });
    }

    // 2️⃣ Fetch DB
    const dbData = await service.buildingDetailsByLockerId(building_no,locker_id);

    if (!dbData) {
      return res.status(404).json({
        success: false,
        message: "Locker building details not found"
      });
    }

    // 4️⃣ Return
    return res.status(200).json({
      success: true,
      source: "database",
      data: dbData
    });

  } catch (error) {
    console.error("Locker building details error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message
    });
  }
};