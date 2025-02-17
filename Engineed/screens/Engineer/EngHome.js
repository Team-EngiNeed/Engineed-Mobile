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

const EngHome = () => {
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState(""); // Store the username

  const navigation = useNavigation();

  useEffect(() => {
    // Load custom fonts
    async function loadFonts() {
      await Font.loadAsync({
        Outfit: require("../../assets/fonts/Outfit-VariableFont_wght.ttf"),
      });
      setFontsLoaded(true);
    }

    // Fetch the username
    async function fetchUserData() {
      try {
        const response = await api.get("api/user/profile/");
        console.log("User data:", response.data); // Log the response to check the structure
        setUsername(response.data.username || "User"); // Default to "User" if no username
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    }


    loadFonts();
    fetchUserData();
  }, []);

  if (!fontsLoaded || loading) {
    return <Text>Loading...</Text>; // Show loading state until data is loaded
  }

  return (
    <ImageBackground
      source={require("../../assets/images/BG.png")}
      style={styles.container}
      resizeMode="cover"
    >
      <Text style={styles.welcomeText}>Welcome, {username}!</Text>
      <Image
        style={styles.logo}
        source={require("../../assets/images/ENGINEED LOGO.png")}
      />
      <TouchableOpacity
        style={styles.btn}
        onPress={() => navigation.navigate("Account")}
      >
        <Text style={styles.btnText}>Submit a Report</Text>
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

export default EngHome;
