import React, { useState, useEffect } from "react";
import { View, ActivityIndicator } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import jwtDecode from "jwt-decode";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "./constants/constants";
import Account from "../screens/Account"; // Redirect here if unauthorized

const API_REFRESH_URL = "https://rakuen-esfj.onrender.com/api/token/refresh/";

const ProtectedRoute = ({ children }) => {
  const [isAuthorized, setIsAuthorized] = useState(null);

  useEffect(() => {
    checkAuth();
  }, []);

  const refreshToken = async () => {
    const refreshToken = await AsyncStorage.getItem(REFRESH_TOKEN);
    if (!refreshToken) {
      setIsAuthorized(false);
      return;
    }
    try {
      const res = await axios.post(API_REFRESH_URL, { refresh: refreshToken });
      if (res.status === 200) {
        await AsyncStorage.setItem(ACCESS_TOKEN, res.data.access);
        setIsAuthorized(true);
      } else {
        setIsAuthorized(false);
      }
    } catch (error) {
      setIsAuthorized(false);
    }
  };

  const checkAuth = async () => {
    const token = await AsyncStorage.getItem(ACCESS_TOKEN);
    if (!token) {
      setIsAuthorized(false);
      return;
    }
    try {
      const decoded = jwtDecode(token);
      const tokenExpiration = decoded.exp;
      const now = Date.now() / 1000;

      if (tokenExpiration < now) {
        await refreshToken();
      } else {
        setIsAuthorized(true);
      }
    } catch (error) {
      setIsAuthorized(false);
    }
  };

  if (isAuthorized === null) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return isAuthorized ? children : <Account />;
};

export default ProtectedRoute;
