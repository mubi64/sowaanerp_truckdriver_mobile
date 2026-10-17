import React, { createContext, useContext, useState } from 'react';
import { StoreItem, DeleteItem } from '../async-storage/async-storage';
import { httpGet, httpPOST, ERROR_MESSAGES } from '../network calls/networkCalls';
const AuthContext = createContext();

const NO_EMPLOYEE_MESSAGE =
  "Your user isn't linked to an active Employee in SowaanERP. Please ask your administrator to link one.";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // You can store user information here
  const [employee, setEmployee] = useState("");

  // Resolves to {} on success or { error } with a message to show the user
  const login = async (userData) => {
    const result = await getEmployee();
    if (result.error) {
      if (result.endSession) {
        await httpPOST('/api/method/logout', {});
        DeleteItem('userLoggedIn');
      }
      return result;
    }
    setUser(userData);
    StoreItem('userLoggedIn', 'true');
    return {};
  };

  const logout = async () => {
    // End the ERP session so the next driver on this device can't reuse it
    await httpPOST('/api/method/logout', {});
    setUser(null);
    setEmployee('');
    DeleteItem('userLoggedIn');
  };

  const getEmployee = async () => {
    const employeeRes = await httpGet('/api/method/driver_tracker.api.mobile_api.get_employee_info');
    if (employeeRes.error) {
      const sessionExpired = employeeRes.status === 401 || employeeRes.status === 403;
      return {
        error: sessionExpired ? ERROR_MESSAGES.unauthorized : employeeRes.error,
        // Keep the saved session on network errors so the next launch can retry
        endSession: Boolean(employeeRes.status),
      };
    }
    if (!employeeRes.message?.name) {
      return { error: NO_EMPLOYEE_MESSAGE, endSession: true };
    }
    setEmployee(employeeRes.message);
    return {};
  };

  return (
    <AuthContext.Provider value={{ employee, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};