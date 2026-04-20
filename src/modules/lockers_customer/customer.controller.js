const service = require('./customer.service');
const redisClient = require("../../config/redis");
const moment = require('moment');
const bcrypt = require('bcrypt');

exports.create = async (req, res) => {
  try {
    const ip =
      req.headers['x-forwarded-for']?.split(',')[0] ||
      req.socket.remoteAddress ||
      null;

    const { id, otp } = await service.create(req.body, ip);

    // ✅ clear all list cache
    await redisClient.del('allcustomerlist');

    return res.json({
      success: true,
      message: 'Customer created',
      data: { id, otp }
    });

  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.list = async (req, res) => {
  try {
    const { floor_no, flat_no, building_no } = req.query;

    const filters = {
      floor_no,
      flat_no,
      building_no
    };

    const keyParts = Object.entries(filters)
      .filter(([_, v]) => v !== null)
      .map(([k, v]) => `${k}:${v}`);

    const CACHE_KEY = 'customer_list_all';

    const cachedData = await redisClient.get(CACHE_KEY);

    if (cachedData) {
      return res.json({
        success: true,
        source: "redis",
        data: JSON.parse(cachedData)
      });
    }

    const dbData = await service.list(filters);

    await redisClient.setEx(CACHE_KEY, 300, JSON.stringify(dbData));

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
    const { customer_id } = req.params;

    const CACHE_KEY = `customer_details:${customer_id}`;

    const cachedData = await redisClient.get(CACHE_KEY);

    if (cachedData) {
      return res.json({
        success: true,
        source: "redis",
        data: JSON.parse(cachedData)
      });
    }

    const dbData = await service.details(customer_id);

    if (!dbData) {
      return res.status(404).json({
        success: false,
        message: "Customer not found"
      });
    }

    await redisClient.setEx(CACHE_KEY, 300, JSON.stringify(dbData));

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
    const { customer_id } = req.params;

    const ip =
      req.headers['x-forwarded-for']?.split(',')[0] ||
      req.socket.remoteAddress ||
      null;

    await service.update(req.body, customer_id, ip);

    // ✅ clear related caches
    await redisClient.del('customer_list_all');
    await redisClient.del(`customer_details:${customer_id}`);

    return res.json({
      success: true,
      message: 'Customer updated'
    });

  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.delete = async (req, res) => {
  try {
    const { customer_id } = req.params;

    await service.delete(customer_id);

    // ✅ clear caches
    await redisClient.del('customer_list_all');
    await redisClient.del(`customer_details:${customer_id}`);

    return res.json({
      success: true,
      message: "Customer deleted"
    });

  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.otpVerify = async (req, res) => {
  try {
    const { customer_id, otp } = req.body;

    // 1️⃣ Basic validation
    if (!customer_id || !otp) {
      return res.status(400).json({
        success: false,
        message: "customer_id and otp are required"
      });
    }

    // 2️⃣ Fetch Customer record
    const dbData = await service.otpVerify(customer_id);

    if (!dbData) {
      return res.status(404).json({
        success: false,
        message: "Customer not found"
      });
    }

    // 3️⃣ Check expiry
    if (moment().isAfter(dbData.expiration_date)) {
      return res.status(400).json({
        success: false,
        message: "OTP expired"
      });
    }

    // 4️⃣ Compare hashed OTP
    const isMatch = await bcrypt.compare(String(otp), dbData.otp);

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP"
      });
    }

    // 6️⃣ Success response (do NOT send hashed otp back)
    const { otp: _remove, ...safeData } = dbData;

    return res.status(200).json({
      success: true,
      source: "database",
      message: "OTP Verified",
      data: safeData
    });

  } catch (error) {
    console.error("OTP Verify Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message
    });
  }
};

exports.otpCheck = async (req, res) => { 
  try {
    const { customer_id, otp } = req.body;

    // 1️⃣ Basic validation
    if (!customer_id || !otp) {
      return res.status(400).json({
        success: false,
        message: "customer_id and otp are required"
      });
    }

    // 2️⃣ Fetch Customer record
    const dbData = await service.otpCheck(customer_id);

    if (!dbData) {
      return res.status(404).json({
        success: false,
        message: "Customer not found"
      });
    }

    // 3️⃣ Check expiry
    if (moment().isAfter(dbData.expiration_date)) {
      return res.status(400).json({
        success: false,
        message: "OTP expired"
      });
    }

    // 4️⃣ Compare hashed OTP
    const isMatch = await bcrypt.compare(String(otp), dbData.otp);

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP"
      });
    }

    // 6️⃣ Success response (do NOT send hashed otp back)
    const { otp: _remove, ...safeData } = dbData;

    return res.status(200).json({
      success: true,
      source: "database",
      message: "OTP Verified",
      data: safeData
    });

  } catch (error) {
    console.error("OTP Verify Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message
    });
  }
};

exports.allCustomerlist = async (req, res) => {
  try {

    const CACHE_KEY = 'allcustomerlist';

    const cachedData = await redisClient.get(CACHE_KEY);

    if (cachedData) {
      return res.json({
        success: true,
        source: "redis",
        data: JSON.parse(cachedData)
      });
    }

    const dbData = await service.allCustomerlist();

    if (!dbData) {
      return res.status(404).json({
        success: false,
        message: "Customer not found"
      });
    }

    await redisClient.setEx(CACHE_KEY, 300, JSON.stringify(dbData));

    return res.json({
      success: true,
      source: "database",
      data: dbData
    });

  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.customerlist = async (req, res) => {
  try {
    const { locker_id } = req.params;

    const CACHE_KEY = `customerlist:${locker_id}`;

    const cachedData = await redisClient.get(CACHE_KEY);

    if (cachedData) {
      return res.json({
        success: true,
        source: "redis",
        data: JSON.parse(cachedData)
      });
    }

    const dbData = await service.customerlist(locker_id);

    if (!dbData) {
      return res.status(404).json({
        success: false,
        message: "Customer not found"
      });
    }

    await redisClient.setEx(CACHE_KEY, 300, JSON.stringify(dbData));

    return res.json({
      success: true,
      source: "database",
      data: dbData
    });

  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

