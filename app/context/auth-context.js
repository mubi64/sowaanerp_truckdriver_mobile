import React, { createContext, useContext, useState } from 'react';
import { GetItem , StoreItem,DeleteItem } from '../async-storage/async-storage';
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // You can store user information here

  const login = (userData) => {
    // Logic for user login
      setUser(userData);
      StoreItem('userLoggedIn','true')
  };

  const logout = () => {
    // Logic for user logout
      setUser(null);
      DeleteItem('userLoggedIn')
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};