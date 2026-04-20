const service = require('./transaction.service');
const redisClient = require("../../config/redis");
const { Parser } = require('json2csv');
const pool = require('../../config/database');

exports.create = async (req, res) => {
  try {
    const CACHE_KEY = "transaction_list";

    const ip =
      req.headers['x-forwarded-for']?.split(',')[0] ||
      req.socket.remoteAddress ||
      null;

    // 1️⃣ Insert into DB
    const insertedRow = await service.create(req.body, ip);

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
      message: 'Transaction log created',
      data: insertedRow
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.uploadCSV = async (req, res) => {
  const ip =
      req.headers['x-forwarded-for']?.split(',')[0] ||
      req.socket.remoteAddress ||
      null;
  try {
    const result = await service.importCSV(req.file.path, ip);
    res.json({ success: true, data: result });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.list = async (req, res) => {
  try {
    const CACHE_KEY = "transaction_list";

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

exports.transactionList = async (req, res) => {
  try {
    const { locker_id } = req.params;

    if (!locker_id) {
      return res.status(400).json({
        success: false,
        message: "locker_id is required"
      });
    }

    // ✅ unique cache per customer
    const CACHE_KEY = `transaction_details:${locker_id}`;

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
    const dbData = await service.transactionList(locker_id);

    if (!dbData) {
      return res.status(404).json({
        success: false,
        message: "Transaction not found"
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
    console.error("Transaction details error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message
    });
  }
};

exports.details = async (req, res) => {
  try {
    const { transaction_id } = req.params;

    if (!transaction_id) {
      return res.status(400).json({
        success: false,
        message: "transaction_id is required"
      });
    }

    // ✅ unique cache per customer
    const CACHE_KEY = `transaction_details:${transaction_id}`;

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
    const dbData = await service.details(transaction_id);

    if (!dbData) {
      return res.status(404).json({
        success: false,
        message: "Transaction not found"
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
    console.error("Transaction details error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message
    });
  }
};

exports.update = async (req, res) => {
  try {
    const { transaction_id } = req.params;
    
    const CACHE_KEY = "transaction_list";

    const ip =
      req.headers['x-forwarded-for']?.split(',')[0] ||
      req.socket.remoteAddress ||
      null;

    // 1️⃣ Insert into DB
    await service.update(req.body, transaction_id, ip);

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
      message: 'Transaction log updated'
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.delete = async (req, res) => {
  try {
    
    const { transaction_id } = req.params;
    
    const CACHE_KEY = "transaction_list";

    const cachedData = await redisClient.get(CACHE_KEY);

    if (cachedData) {
      return res.json({
        success: true,
        source: "redis",
        data: JSON.parse(cachedData)
      });
    }

    const dbData = await service.delete(transaction_id);

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

exports.exportUsersCSV = async (req, res) => {
  try {
    // 1️⃣ Fetch data
    const [rows] = await pool.query(`
      SELECT 
        usr_id,
        usr_name,
        usr_email,
        mobile_no,
        created_at
      FROM mypackages_users
    `);

    if (!rows.length) {
      return res.status(404).json({ message: 'No data found' });
    }

    // 2️⃣ Custom headers mapping
    const fields = [
      { label: 'User ID', value: 'usr_id' },
      { label: 'Full Name', value: 'usr_name' },
      { label: 'Email Address', value: 'usr_email' },
      { label: 'Mobile Number', value: 'mobile_no' },
      { label: 'Created Date', value: 'created_at' }
    ];

    const parser = new Parser({ fields });
    const csv = parser.parse(rows);

    // 3️⃣ Download
    res.header('Content-Type', 'text/csv');
    res.attachment('users.csv');

    res.send(csv);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
