const pool = require('../../config/database');

exports.details = async (user_id) => {
  
  const [
    [lockers],
    [customers],
    [occupancyrate],
    [footfall],
    [deliveries],
    [small],
    [large],
    [medium],
    [exl],
    [vendor],
    [occupancyovertime],
    [avg_pickup_time],
    [customer_pickup_time]
  ] = await Promise.all([

    pool.query(`SELECT COUNT(*) AS activeLockerTotal FROM mypackages_locker WHERE status = 'active'`), 
    
    pool.query(`SELECT COUNT(*) AS customerTotal FROM mypackages_customers WHERE status = 1`), 
    
    pool.query(`SELECT SUM(no_of_compartment) AS occupiedLockers FROM mypackages_locker WHERE status = 'active'`),

    pool.query(`SELECT COUNT(*) AS footFallTotal FROM mypackages_footfalllog`),
        
    pool.query(`SELECT COUNT(*) AS deliveriesTotal FROM mypackages_txn_events WHERE event_type = 'DELIVERY' AND pickup_status IS NULL`),

    pool.query(`SELECT l.occupied - (l.occupied - t.total) AS total FROM ( SELECT SUM(s_compartment) AS occupied FROM mypackages_locker WHERE status = 'active' ) l, ( SELECT COUNT(*) AS total FROM mypackages_txn_events WHERE compartment_size = 'S' AND event_type = 'DELIVERY' AND pickup_status IS NULL ) t`),

    pool.query(`SELECT l.occupied - (l.occupied - t.total) AS total FROM ( SELECT SUM(l_compartment) AS occupied FROM mypackages_locker WHERE status = 'active' ) l, ( SELECT COUNT(*) AS total FROM mypackages_txn_events WHERE compartment_size = 'L' AND event_type = 'DELIVERY' AND pickup_status IS NULL ) t`),

    pool.query(`SELECT l.occupied - (l.occupied - t.total) AS total FROM ( SELECT SUM(m_compartment) AS occupied FROM mypackages_locker WHERE status = 'active' ) l, ( SELECT COUNT(*) AS total FROM mypackages_txn_events WHERE compartment_size = 'M' AND event_type = 'DELIVERY' AND pickup_status IS NULL ) t`),

    pool.query(`SELECT l.occupied - (l.occupied - t.total) AS total FROM ( SELECT SUM(exl_compartment) AS occupied FROM mypackages_locker WHERE status = 'active' ) l, ( SELECT COUNT(*) AS total FROM mypackages_txn_events WHERE compartment_size = 'EXL' AND event_type = 'DELIVERY' AND pickup_status IS NULL ) t`),

    pool.query(`
      SELECT
        SUM(vendor = 'Flipkart') AS flipkart,
        SUM(vendor = 'Amazon') AS amazon,
        SUM(vendor = 'BlueDart') AS blueDart,
        SUM(vendor = 'Delhivery') AS delhivery,
        SUM(vendor = 'Zepto') AS zepto,
        SUM(vendor = 'Zomato') AS zomato,
        SUM(vendor = 'Swiggy') AS swiggy,
        SUM(vendor = 'Blinkit') AS blinkit,
        SUM(vendor = 'Myntra') AS myntra
      FROM mypackages_txn_events
    `),
    
    pool.query(`SELECT 
            range_label,
            SUM(net_change) OVER (ORDER BY min_date) AS occupancy
        FROM (
            SELECT 
                CASE 
                    WHEN DAY(created_at) BETWEEN 1 AND 5 THEN '1-5 Jan'
                    WHEN DAY(created_at) BETWEEN 6 AND 10 THEN '6-10 Jan'
                    WHEN DAY(created_at) BETWEEN 11 AND 15 THEN '11-15 Jan'
                    WHEN DAY(created_at) BETWEEN 16 AND 20 THEN '16-20 Jan'
                    WHEN DAY(created_at) BETWEEN 21 AND 25 THEN '21-25 Jan'
                    ELSE '26-31 Jan'
                END AS range_label,

                MIN(created_at) AS min_date,

                SUM(
                    CASE 
                        WHEN event_type = 'DELIVERY' THEN 1
                        WHEN event_type IN ('PICKUP', 'RETURN') THEN -1
                        ELSE 0
                    END
                ) AS net_change

            FROM mypackages_txn_events
            WHERE event_type IN ('DELIVERY', 'PICKUP', 'RETURN')
            GROUP BY range_label
        ) t
        ORDER BY min_date
	`),
    
    pool.query(`SELECT 
          CASE 
            WHEN ROUND(AVG(TIMESTAMPDIFF(SECOND, event_timestamp, pick_time)) / 3600, 2) = 
                 ROUND(AVG(TIMESTAMPDIFF(SECOND, event_timestamp, pick_time)) / 3600, 0)
            THEN ROUND(AVG(TIMESTAMPDIFF(SECOND, event_timestamp, pick_time)) / 3600, 0)
            ELSE ROUND(AVG(TIMESTAMPDIFF(SECOND, event_timestamp, pick_time)) / 3600, 2)
          END AS avg_pickup_duration_hours
        FROM mypackages_txn_events
        WHERE pickup_status = 'PICKUP'
          AND pick_time IS NOT NULL
          AND TIMESTAMPDIFF(SECOND, event_timestamp, pick_time) > 0
  	`),
    
    pool.query(`SELECT 
        CASE 
          WHEN diff_hours <= 1 THEN '0-1 Hr'
          WHEN diff_hours <= 3 THEN '1-3 Hr'
          WHEN diff_hours <= 6 THEN '3-6 Hr'
          WHEN diff_hours <= 12 THEN '6-12 Hr'
          WHEN diff_hours <= 15 THEN '15-18 Hr'
          ELSE '18+ Hr'
        END AS time_range,
        COUNT(*) AS total
      FROM (
        SELECT 
          TIMESTAMPDIFF(SECOND, event_timestamp, pick_time) / 3600 AS diff_hours
        FROM mypackages_txn_events
        WHERE pickup_status = 'PICKUP'
          AND pick_time IS NOT NULL
          AND TIMESTAMPDIFF(SECOND, event_timestamp, pick_time) > 0
      ) t
      GROUP BY time_range
      ORDER BY MIN(diff_hours)
      `)
  ]);
  
  const s = small[0].total;
  const l = large[0].total;
  const m = medium[0].total;
  const e = exl[0].total;

  const grandTotalC = s + l + m + e;

  const percentageC = (val) =>
    grandTotalC ? ((val / grandTotalC) * 100).toFixed(2) + '%' : '0%';

  const compartmentSizeOccupency = {
    Small: { total: s, percentage: percentageC(s) },
    Medium: { total: m, percentage: percentageC(m) },
    Large: { total: l, percentage: percentageC(l) },
    ExtraLarge: { total: e, percentage: percentageC(e) }
  };
  
  const vendorRow = vendor[0] || {};

  const flipcart = Number(vendorRow.flipcart) || 0;
  const amazon   = Number(vendorRow.amazon) || 0;
  const myntra    = Number(vendorRow.myntra) || 0;
  const blueDart = Number(vendorRow.blueDart) || 0;
  const delhivery   = Number(vendorRow.delhivery) || 0;
  const zepto    = Number(vendorRow.zepto) || 0;
  const zomato = Number(vendorRow.zomato) || 0;
  const swiggy   = Number(vendorRow.swiggy) || 0;
  const blinkit    = Number(vendorRow.blinkit) || 0;

  const grandTotalV = flipcart + amazon + myntra + blueDart + delhivery + zepto + zomato + swiggy + blinkit;

  const percentageV = (val) =>
    grandTotalV > 0
      ? ((val / grandTotalV) * 100).toFixed(2) + '%'
      : '0%';

  const vendorComparision = {
    Flipcart: { total: flipcart, percentage: percentageV(flipcart) },
    Amazon:   { total: amazon, percentage: percentageV(amazon) },
    Myntra:    { total: myntra, percentage: percentageV(myntra) },
    BlueDart: { total: blueDart, percentage: percentageV(blueDart) },
    Delhivery:   { total: delhivery, percentage: percentageV(delhivery) },
    Zepto:    { total: zepto, percentage: percentageV(zepto) },
    Zomato:    { total: zomato, percentage: percentageV(zomato) },
    Swiggy: { total: swiggy, percentage: percentageV(swiggy) },
    Blinkit:   { total: blinkit, percentage: percentageV(blinkit) }
  };
  
  const activeLockers = lockers[0].activeLockerTotal;
  const activeCustomers = customers[0].customerTotal;
  const occupiedLockers = occupancyrate[0].occupiedLockers;

  const occupancyRate =
  occupiedLockers > 0
    ? (((occupiedLockers - (occupiedLockers- deliveries[0].deliveriesTotal)) / occupiedLockers) * 100).toFixed(2) + '%'
    : '0%';
  
  const avgPickupTime = avg_pickup_time[0].avg_pickup_duration_hours;
  
  const customerPickupTime = customer_pickup_time;
  
  return {
    activeLockerTotal: lockers[0].activeLockerTotal,
    activeCustomers: customers[0].customerTotal,
    occupancyRate: occupancyRate,
    footFallTotal: footfall[0].footFallTotal,
    deliveriesTotal: deliveries[0].deliveriesTotal,
    compartmentSizeOccupency,
    vendorComparision,
    occupancyOverTime: occupancyovertime,
    avgPickupTime,
    customerPickupTime
  };
};

exports.filter = async (user_id, state, city, area, period) => {

  let where = "WHERE l.status = 'active'";
  let eventWhere = "";
  let footfallWhere = "";
  let pickupWhere = "";
  
  const params = [];

  if (state) {
    where += " AND l.state = ?";
    params.push(state);
  }

  if (city) {
    where += " AND l.city = ?";
    params.push(city);
  }

  // (optional) area filter
  if (area) {
    where += " AND l.area LIKE ?";
    params.push(`%${area}%`);
  }

  // period filter
  if (period === "today") {
    where += " AND DATE(l.install_date) = CURDATE()";
    eventWhere += " AND DATE(e.created_at) = CURDATE()";
    footfallWhere += " AND DATE(f.created_at) = CURDATE()";
    pickupWhere += " AND DATE(e.pick_time) = CURDATE()";
  } 
  else if (period === "week") {
    where += " AND YEARWEEK(l.install_date,1) = YEARWEEK(CURDATE(),1)";
    eventWhere += " AND YEARWEEK(e.created_at,1)=YEARWEEK(CURDATE(),1)";
    footfallWhere += " AND YEARWEEK(f.created_at,1)=YEARWEEK(CURDATE(),1)";
    pickupWhere += " AND YEARWEEK(e.pick_time,1)=YEARWEEK(CURDATE(),1)";
  } 
  else if (period === "month") {
    where += " AND MONTH(l.install_date) = MONTH(CURDATE()) AND YEAR(l.install_date)=YEAR(CURDATE())";
    eventWhere += " AND MONTH(e.created_at)=MONTH(CURDATE()) AND YEAR(e.created_at)=YEAR(CURDATE())";
    footfallWhere += " AND MONTH(f.created_at)=MONTH(CURDATE()) AND YEAR(f.created_at)=YEAR(CURDATE())";
    pickupWhere += " AND MONTH(e.pick_time)=MONTH(CURDATE()) AND YEAR(e.pick_time)=YEAR(CURDATE())";
  } 
  else if (period === "year") {
    where += " AND YEAR(l.install_date) = YEAR(CURDATE())";
    eventWhere += " AND YEAR(e.created_at)=YEAR(CURDATE())";
    footfallWhere += " AND YEAR(f.created_at)=YEAR(CURDATE())";
    pickupWhere += " AND YEAR(e.pick_time)=YEAR(CURDATE())";
  }

  const [
    [lockers],
    [occupancy],
    [footfall],
    [deliveries],
    [small],
    [large],
    [medium],
    [exl],
    [vendor],
    [avg_pickup_time],
    [customer_pickup_time]
  ] = await Promise.all([

    pool.query(`
      SELECT COUNT(*) AS activeLockerTotal
      FROM mypackages_locker l
      ${where}
    `, params),

    pool.query(`
      SELECT SUM(no_of_compartment) AS occupiedLockers
      FROM mypackages_locker l
      ${where}
    `, params),

    pool.query(`
      SELECT COUNT(*) AS footFallTotal
      FROM mypackages_footfalllog f
      JOIN mypackages_locker l ON f.locker_id = l.locker_id
      ${where} ${footfallWhere}
    `, params),

    pool.query(`
      SELECT COUNT(*) AS deliveriesTotal
      FROM mypackages_txn_events e
      JOIN mypackages_locker l ON e.locker_id = l.locker_id
      ${where} ${eventWhere} AND e.event_type='DELIVERY' AND pickup_status IS NULL
    `, params),

    pool.query(`
      SELECT COUNT(*) AS total
      FROM mypackages_txn_events e
      JOIN mypackages_locker l ON e.locker_id = l.locker_id
      ${where} ${eventWhere} AND e.compartment_size='S' AND e.event_type='DELIVERY' AND pickup_status IS NULL
    `, params),

    pool.query(`
      SELECT COUNT(*) AS total
      FROM mypackages_txn_events e
      JOIN mypackages_locker l ON e.locker_id = l.locker_id
      ${where} ${eventWhere} AND e.compartment_size='L' AND e.event_type='DELIVERY' AND pickup_status IS NULL
    `, params),

    pool.query(`
      SELECT COUNT(*) AS total
      FROM mypackages_txn_events e
      JOIN mypackages_locker l ON e.locker_id = l.locker_id
      ${where} ${eventWhere} AND e.compartment_size='M' AND e.event_type='DELIVERY' AND pickup_status IS NULL
    `, params),

    pool.query(`
      SELECT COUNT(*) AS total
      FROM mypackages_txn_events e
      JOIN mypackages_locker l ON e.locker_id = l.locker_id
      ${where} ${eventWhere} AND e.compartment_size='EXL' AND e.event_type='DELIVERY' AND pickup_status IS NULL
    `, params),

    pool.query(`
      SELECT
        SUM(e.vendor = 'Flipkart') AS flipkart,
        SUM(e.vendor = 'Amazon') AS amazon,
        SUM(e.vendor = 'BlueDart') AS blueDart,
        SUM(e.vendor = 'Delhivery') AS delhivery,
        SUM(e.vendor = 'Zepto') AS zepto,
        SUM(e.vendor = 'Zomato') AS zomato,
        SUM(e.vendor = 'Swiggy') AS swiggy,
        SUM(e.vendor = 'Blinkit') AS blinkit,
        SUM(e.vendor = 'Myntra') AS myntra
      FROM mypackages_txn_events e
      JOIN mypackages_locker l ON e.locker_id = l.locker_id
      ${where} ${eventWhere}
    `, params),
    
    pool.query(`SELECT 
          CASE 
            WHEN ROUND(AVG(TIMESTAMPDIFF(SECOND, e.event_timestamp, e.pick_time)) / 3600, 2) = 
                 ROUND(AVG(TIMESTAMPDIFF(SECOND, e.event_timestamp, e.pick_time)) / 3600, 0)
            THEN ROUND(AVG(TIMESTAMPDIFF(SECOND, e.event_timestamp, e.pick_time)) / 3600, 0)
            ELSE ROUND(AVG(TIMESTAMPDIFF(SECOND, e.event_timestamp, e.pick_time)) / 3600, 2)
          END AS avg_pickup_duration_hours
        FROM mypackages_txn_events e
        WHERE e.pickup_status = 'PICKUP'
          AND e.pick_time IS NOT NULL
          AND TIMESTAMPDIFF(SECOND, e.event_timestamp, e.pick_time) > 0
  	${eventWhere}
    `, params),
    
    pool.query(`
        SELECT 
          time_range,
          COUNT(*) AS total
        FROM (
          SELECT 
            TIMESTAMPDIFF(SECOND, e.event_timestamp, e.pick_time) / 3600 AS diff_hours,
            CASE 
              WHEN TIMESTAMPDIFF(SECOND, e.event_timestamp, e.pick_time) / 3600 <= 1 THEN '0-1 Hr'
              WHEN TIMESTAMPDIFF(SECOND, e.event_timestamp, e.pick_time) / 3600 <= 3 THEN '1-3 Hr'
              WHEN TIMESTAMPDIFF(SECOND, e.event_timestamp, e.pick_time) / 3600 <= 6 THEN '3-6 Hr'
              WHEN TIMESTAMPDIFF(SECOND, e.event_timestamp, e.pick_time) / 3600 <= 12 THEN '6-12 Hr'
              WHEN TIMESTAMPDIFF(SECOND, e.event_timestamp, e.pick_time) / 3600 <= 18 THEN '12-18 Hr'
              ELSE '18+ Hr'
            END AS time_range
          FROM mypackages_txn_events e
          WHERE e.pickup_status = 'PICKUP'
            AND e.pick_time IS NOT NULL
            AND TIMESTAMPDIFF(SECOND, e.event_timestamp, e.pick_time) > 0
            ${eventWhere}
        ) t
        GROUP BY time_range
        ORDER BY FIELD(time_range, '0-1 Hr','1-3 Hr','3-6 Hr','6-12 Hr','12-18 Hr','18+ Hr')
      `, params)

  ]);

  const s = small[0].total;
  const l = large[0].total;
  const m = medium[0].total;
  const e = exl[0].total;

  const grandTotalC = s + l + m + e;

  const percentageC = (val) =>
    grandTotalC ? ((val / grandTotalC) * 100).toFixed(2) + '%' : '0%';

  const compartmentSizeOccupency = {
    Small: { total: s, percentage: percentageC(s) },
    Medium: { total: m, percentage: percentageC(m) },
    Large: { total: l, percentage: percentageC(l) },
    ExtraLarge: { total: e, percentage: percentageC(e) }
  };
  
  const vendorRow = vendor[0] || {};

  const flipcart = Number(vendorRow.flipcart) || 0;
  const amazon   = Number(vendorRow.amazon) || 0;
  const myntra    = Number(vendorRow.myntra) || 0;
  const blueDart = Number(vendorRow.blueDart) || 0;
  const delhivery   = Number(vendorRow.delhivery) || 0;
  const zepto    = Number(vendorRow.zepto) || 0;
  const zomato = Number(vendorRow.zomato) || 0;
  const swiggy   = Number(vendorRow.swiggy) || 0;
  const blinkit    = Number(vendorRow.blinkit) || 0;

  const grandTotalV = flipcart + amazon + myntra + blueDart + delhivery + zepto + zomato + swiggy + blinkit;

  const percentageV = (val) =>
    grandTotalV > 0
      ? ((val / grandTotalV) * 100).toFixed(2) + '%'
      : '0%';

  const vendorComparision = {
    Flipcart: { total: flipcart, percentage: percentageV(flipcart) },
    Amazon:   { total: amazon, percentage: percentageV(amazon) },
    Myntra:    { total: myntra, percentage: percentageV(myntra) },
    BlueDart: { total: blueDart, percentage: percentageV(blueDart) },
    Delhivery:   { total: delhivery, percentage: percentageV(delhivery) },
    Zepto:    { total: zepto, percentage: percentageV(zepto) },
    Zomato:    { total: zomato, percentage: percentageV(zomato) },
    Swiggy: { total: swiggy, percentage: percentageV(swiggy) },
    Blinkit:   { total: blinkit, percentage: percentageV(blinkit) }
  };

  const activeLockers = lockers[0].activeLockerTotal;
  const occupiedLockers = occupancy[0].occupiedLockers;

  const occupancyRate =
  occupiedLockers > 0
    ? (((occupiedLockers - deliveries[0].deliveriesTotal) / occupiedLockers) * 100).toFixed(2) + '%'
    : '0%';

  const avgPickupTime = avg_pickup_time[0].avg_pickup_duration_hours;
  
  const customerPickupTime = customer_pickup_time;
  
  return {
    activeLockerTotal: activeLockers,
    occupancyRate,
    footFallTotal: footfall[0].footFallTotal,
    deliveriesTotal: deliveries[0].deliveriesTotal,
    compartmentSizeOccupency,
    vendorComparision,
    avgPickupTime,
    customerPickupTime
  };
};
