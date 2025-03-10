import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Image,
  ImageBackground,
  Dimensions,
} from "react-native";
import { ACCENT, TEXT } from "../../assets/misc/colors";
import * as Font from "expo-font";
import { useNavigation } from "@react-navigation/native";
import api from "../../api";
import AsyncStorage from "@react-native-async-storage/async-storage";

const AdviHome = () => {
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState("");
  const navigation = useNavigation();

  useEffect(() => {
    async function loadFonts() {
      await Font.loadAsync({
        Outfit: require("../../assets/fonts/Outfit-VariableFont_wght.ttf"),
      });
      setFontsLoaded(true);
    }

    async function fetchUserData() {
      try {
        let response = await api.get("api/user/profile/");
        console.log("User data:", response.data);
        setUsername(response.data.username || "User");
      } catch (error) {
        console.error("Error fetching user data:", error);

        if (error.response?.status === 401) {
          console.log("Access token expired. Trying to refresh...");
          try {
            const refreshToken = await AsyncStorage.getItem("REFRESH_TOKEN");
            if (!refreshToken) throw new Error("No refresh token found");

            const refreshRes = await api.post("api/token/refresh/", {
              refresh: refreshToken,
            });

            await AsyncStorage.setItem("ACCESS_TOKEN", refreshRes.data.access);
            console.log("Token refreshed. Retrying user data fetch...");
            return fetchUserData();
          } catch (refreshError) {
            console.error("Error refreshing token:", refreshError);
          }
        }
      } finally {
        setLoading(false);
      }
    }

    loadFonts();
    fetchUserData();
  }, []);

  return (
    <ImageBackground
      source={require("../../assets/images/BG.png")}
      style={styles.container}
      resizeMode="cover"
    >
      <Text style={styles.welcomeText}>
        {loading ? "Loading..." : `Welcome, ${username}!`}
      </Text>

      <Image
        style={styles.logo}
        source={require("../../assets/images/ENGINEED LOGO.png")}
      />

      <TouchableOpacity
        style={styles.btn}
        onPress={() => navigation.navigate("AdviMainContainer", { screen: "Report" })}
      >
        <Text style={styles.btnText}>See the tickets</Text>
      </TouchableOpacity>
    </ImageBackground>
  );
};

const { width } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  btn: {
    backgroundColor: ACCENT,
    paddingVertical: 14,
    paddingHorizontal: 25,
    borderRadius: 30,
    margin: 5,
    zIndex: 100,
    bottom: 50,
  },
  btnText: {
    color: TEXT,
    fontSize: 16,
    fontFamily: "Outfit",
  },
  logo: {
    width: width * 0.85,
    height: width * 0.5,
    resizeMode: "contain",
    marginBottom: 20,
  },
  welcomeText: {
    color: "white",
    fontSize: 24,
    fontFamily: "Outfit",
    marginBottom: 20,
  },
});

export default AdviHome;
