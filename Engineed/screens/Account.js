import React, { useState } from "react";
import { StatusBar } from "expo-status-bar";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Checkbox from "expo-checkbox";
import { ACCENT, TEXT, BASE, LINE } from "../assets/misc/colors";
import api from "../api";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants/constants";

const Account = () => {
  const [activeTab, setActiveTab] = useState("login");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();

  const handleSubmit = async () => {
    if (!username || !password) {
      Alert.alert("Error", "Username and password cannot be empty.");
      return;
    }

    setLoading(true);

    try {
      const route = activeTab === "login" ? "api/token/" : "api/user/register/";
      const payload = { username, password };

      const res = await api.post(route, payload, {
        headers: { "Content-Type": "application/json" },
      });

      if (activeTab === "login") {
        await AsyncStorage.setItem(ACCESS_TOKEN, res.data.access);
        await AsyncStorage.setItem(REFRESH_TOKEN, res.data.refresh);
        console.log("Login successful. Tokens stored.");

        // Fetch user data from API
        const userResponse = await api.get("api/user/profile/", {
          headers: { Authorization: `Bearer ${res.data.access}` },
        });

        if (userResponse.data) {
          console.log("User data:", userResponse.data);

          // Clear previous data and store new user data
          await AsyncStorage.removeItem("userData"); // Clear old data
          await AsyncStorage.setItem(
            "userData",
            JSON.stringify(userResponse.data)
          );

          console.log(
            "Stored User Data:",
            await AsyncStorage.getItem("userData")
          );
        }

        // Determine the appropriate container based on the username
        let containerName = "EngiMainContainer"; // Default container

        if (username.includes("Executive")) {
          containerName = "ExeMainContainer";
        } else if (username.includes("Engineer")) {
          containerName = "EngiMainContainer";
        } else if (username.includes("Adviser")) {
          containerName = "AdviContainer";
        }

        navigation.reset({
          index: 0,
          routes: [{ name: containerName }],
        });
      } else {
        Alert.alert("Success", "Registration successful. You can now log in.");
        setActiveTab("login");
      }
    } catch (error) {
      console.error("Authentication failed:", error);
      Alert.alert(
        "Error",
        "Authentication failed. Check credentials or server."
      );
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
      <StatusBar hidden />
      <View style={styles.container}>
        <Text style={styles.c1}>Account</Text>

        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[
              styles.tab,
              activeTab === "login" ? styles.activeTab : styles.inactiveTab,
            ]}
            onPress={() => {
              setActiveTab("login");
              setUsername("");
              setPassword("");
            }}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === "login" && styles.activeTabText,
              ]}
            >
              Log In
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.tab,
              activeTab === "signup" ? styles.activeTab : styles.inactiveTab,
            ]}
            onPress={() => {
              setActiveTab("signup");
              setUsername("");
              setPassword("");
            }}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === "signup" && styles.activeTabText,
              ]}
            >
              Sign Up
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.formContainer}>
          <Text style={styles.label}>Username</Text>
          <TextInput
            style={styles.input}
            value={username}
            onChangeText={setUsername}
            placeholder="Enter your username"
            placeholderTextColor="#888"
          />

          <Text style={styles.label}>Password</Text>
          <TextInput
            style={styles.input}
            value={password}
            onChangeText={setPassword}
            placeholder="Enter your password"
            placeholderTextColor="#888"
            secureTextEntry={!showPassword}
          />

          <View style={styles.checkboxContainer}>
            <Checkbox value={showPassword} onValueChange={setShowPassword} />
            <Text style={styles.checkboxText}>Show Password</Text>
          </View>

          <TouchableOpacity
            style={styles.loginButton}
            onPress={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text style={styles.loginButtonText}>
                {activeTab === "login" ? "Log In" : "Sign Up"}
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </>
  );
};

const { width } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  c1: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  tabContainer: {
    flexDirection: "row",
    width: width * 0.9,
    borderWidth: 1,
    borderColor: LINE,
    borderRadius: 5,
    overflow: "hidden",
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
  },
  activeTab: {
    backgroundColor: ACCENT,
  },
  inactiveTab: {
    backgroundColor: "white",
  },
  tabText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "black",
  },
  activeTabText: {
    color: "white",
  },
  formContainer: {
    marginTop: 20,
    padding: 20,
    width: width * 0.9,
    backgroundColor: TEXT,
    alignItems: "center",
    borderRadius: 5,
  },
  label: {
    alignSelf: "flex-start",
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  input: {
    width: "100%",
    height: 40,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
    backgroundColor: "white",
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    marginBottom: 15,
  },
  checkboxText: {
    marginLeft: 8,
    fontSize: 14,
    fontStyle: "italic",
  },
  loginButton: {
    marginTop: 10,
    backgroundColor: ACCENT,
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 5,
  },
  loginButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default Account;
