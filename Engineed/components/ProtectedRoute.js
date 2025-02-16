import { useState, useEffect } from "react";
import { View, ActivityIndicator } from "react-native";
import { jwtDecode } from "jwt-decode";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "../api";
import { useNavigation } from "@react-navigation/native";
import { REFRESH_TOKEN, ACCESS_TOKEN } from "../constants/constants";

const ProtectedRoute = ({ children }) => {
  const [isAuthorized, setIsAuthorized] = useState(null);
  const navigation = useNavigation();

  useEffect(() => {
    auth().catch(() => setIsAuthorized(false));
  }, []);

  useEffect(() => {
    if (isAuthorized === false) {
      navigation.reset({ index: 0, routes: [{ name: "Account" }] }); 
    }
  }, [isAuthorized, navigation]);

  const refreshToken = async () => {
    try {
      const refreshToken = await AsyncStorage.getItem(REFRESH_TOKEN);
      if (!refreshToken) {
        setIsAuthorized(false);
        return;
      }

      const res = await api.post("/api/token/refresh/", {
        refresh: refreshToken,
      });

      if (res.status === 200) {
        await AsyncStorage.setItem(ACCESS_TOKEN, res.data.access);
        setIsAuthorized(true);
      } else {
        setIsAuthorized(false);
      }
    } catch (error) {
      console.log(error);
      setIsAuthorized(false);
    }
  };

  const auth = async () => {
    try {
      const token = await AsyncStorage.getItem(ACCESS_TOKEN);
      if (!token) {
        setIsAuthorized(false);
        return;
      }

      const decoded = jwtDecode(token);
      const tokenExpiration = decoded.exp;
      const now = Date.now() / 1000;

      if (tokenExpiration < now) {
        await refreshToken();
      } else {
        setIsAuthorized(true);
      }
    } catch (error) {
      console.log(error);
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

  if (!isAuthorized) {
    return null; // Return nothing while navigation is happening in useEffect
  }

  return children;
};

export default ProtectedRoute;
