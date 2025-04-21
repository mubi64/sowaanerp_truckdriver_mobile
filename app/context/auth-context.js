import React, { createContext, useContext, useState } from 'react';
import { StoreItem, DeleteItem } from '../async-storage/async-storage';
import { httpGet } from '../network calls/networkCalls';
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // You can store user information here
  const [employee, setEmployee] = useState("");

  const login = async (userData) => {
    // Logic for user login
    setUser(userData);
    await getEmployee();
    StoreItem('userLoggedIn', 'true');
  };

  const logout = () => {
    // Logic for user logout
    setUser(null);
    DeleteItem('userLoggedIn');
  };

  const getEmployee = async () => {
    try {
      const employeeRes = await httpGet('/api/method/driver_tracker.api.mobile_api.get_employee_info');
      setEmployee(employeeRes.message);
    } catch (error) {
      console.log('Failed to fetch employee:', error);
      setEmployee(null);
    }
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