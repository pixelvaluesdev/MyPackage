import api from './axios';

export const login = (data) => api.post('/logins', data);

export const resetPassword = (data) => {
  return api.post("/logins/reset-password", data);
};

export const dashboard = (id) => {
  const token = localStorage.getItem("token");
  return api.get(`/dashboard/details/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const dashboardFilter = (user_id, state = "", city = "", area = "", period = "") => {
  const token = localStorage.getItem("token");
  return api.post(
    `/dashboard/filter/${user_id}`,
    { state, city, area, period },
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );
};

export const getStates = () => api.get('/states');

export const getCitiesByStateId = (state_id) => api.get(`/city/cityList/${state_id}`);

export const getCities = () => api.get('/city');

export const lockers = () => api.get('/lockers');

export const lockersCount = () => api.get('/pinglogs/count');

export const lockerAdd = (data) => {
  const token = localStorage.getItem("token");

  return api.post('/lockers/add', data, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
};

export const lockersDetails = (locker_id) => {
  const token = localStorage.getItem("token");
  return api.get(`/lockers/details/${locker_id}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
};

export const customerAdd = (data) => api.post('/customers/add', data);

export const otpCheck = (data) => api.post('/customers/otpCheck', data);

export const profileDetails = () => {
  const token = localStorage.getItem("token");
  const user_id = localStorage.getItem("user_id");
  return api.get(`/profile/details/${user_id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const updateProfile = (data) => {
  const token = localStorage.getItem("token");
  const user_id = localStorage.getItem("user_id");
  return api.put(`/profile/update/${user_id}`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
    },
  });
};

export const users = () => {
  const token = localStorage.getItem("token");
  return api.get('/users', {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
};

export const userAdd = (data) => {
  const token = localStorage.getItem("token");

  return api.post('/users/add', data, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
};

export const userDetails = (user_id) => {
  const token = localStorage.getItem("token");

  return api.get(`/users/details/${user_id}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
};

export const userEdit = (user_id, data) => {
  const token = localStorage.getItem("token");

  return api.put(`/users/update/${user_id}`, data, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
};

export const verifyOtp = (data) => {
  const token = localStorage.getItem("token");

  return api.post('/customers/otpVerify', data, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
};

export const userDelete = (user_id) => {
  const token = localStorage.getItem("token");
  return api.delete(`/users/delete/${user_id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const transactions = () => {
  const token = localStorage.getItem("token");
  return api.get('/transactions', {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
};

export const customerList = (locker_id) => api.get(`/customers/customer-list/${locker_id}`);

export const customerAllList = () => api.get(`/customers/all-customer-list`);

export const transactionList = (locker_id) => api.get(`/transactions/transactionList/${locker_id}`);
