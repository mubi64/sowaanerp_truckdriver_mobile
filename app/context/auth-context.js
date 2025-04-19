import React, { createContext, useContext, useState } from 'react';
import { StoreItem, DeleteItem } from '../async-storage/async-storage';
import { httpGet } from '../network calls/networkCalls';
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // You can store user information here
  const [employee, setEmployee] = useState("");

  const login = (userData) => {
    // Logic for user login
    setUser(userData);
    getEmployee();
    StoreItem('userLoggedIn', 'true');
  };

  const logout = () => {
    // Logic for user logout
    setUser(null);
    DeleteItem('userLoggedIn');
  };

  const getEmployee = async () => {
    const employeeRes = await httpGet('/api/method/driver_tracker.api.mobile_api.get_employee_info');
    setEmployee(employeeRes.message);
  }

  return (
    <AuthContext.Provider value={{ employee, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};