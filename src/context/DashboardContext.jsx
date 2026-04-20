import React, { createContext, useState, useEffect } from "react";
import { dashboard, dashboardFilter } from "api/auth.api";

export const DashboardContext = createContext();

export const DashboardProvider = ({ children }) => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchDashboard = async () => {
    try {
      const res = await dashboard(15);
      setDashboardData(res.data.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  const filterDashboard = async (state, city, area, period) => {
    setLoading(true);
    try {
      let res;

      if (!state && !city && !area && !period) {
        res = await dashboard(15);
      } else {
        res = await dashboardFilter(
          15,
          state || "",
          city || "",
          area || "",
          period || ""
        );
      }

      setDashboardData(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardContext.Provider
      value={{ dashboardData, loading, filterDashboard }}
    >
      {children}
    </DashboardContext.Provider>
  );
};