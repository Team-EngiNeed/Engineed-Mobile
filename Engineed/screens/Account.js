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
import api from "../api"; // Ensure you have your API setup

const Account = () => {
  const [activeTab, setActiveTab] = useState("login");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();

  const handleSubmit = async () => {
    setLoading(true);

    try {
      const route = activeTab === "login" ? "/login" : "/register";
      const res = await api.post(route, { username, password });
      console.log("API response:", res.data);

      if (activeTab === "login") {
        await AsyncStorage.setItem("ACCESS_TOKEN", res.data.access);
        await AsyncStorage.setItem("REFRESH_TOKEN", res.data.refresh);
        console.log("Logged in as:", username);

        if (username.includes("Executive")) {
          navigation.navigate("Executive");
        } else if (username.includes("Adviser")) {
          navigation.navigate("Adviser");
        } else if (username.includes("Engineer")) {
          navigation.navigate("Engineer");
        } else if (username.includes("Utility")) {
          navigation.navigate("Utility");
        } else if (username.includes("Labtech")) {
          navigation.navigate("Labtech");
        } else if (username.includes("Librarian")) {
          navigation.navigate("Librarian");
        } else if (username.includes("Nurse")) {
          navigation.navigate("Nurse");
        } else {
          navigation.navigate("NotFound");
        }
      } else {
        navigation.navigate("Login");
      }
    } catch (error) {
      console.error("Login error:", error);
      Alert.alert("Error", "There was an error. Please try again.");
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
            style={[styles.tab, activeTab === "login" ? styles.activeTab : styles.inactiveTab]}
            onPress={() => setActiveTab("login")}
          >
            <Text style={[styles.tabText, activeTab === "login" && styles.activeTabText]}>Log In</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tab, activeTab === "signup" ? styles.activeTab : styles.inactiveTab]}
            onPress={() => setActiveTab("signup")}
          >
            <Text style={[styles.tabText, activeTab === "signup" && styles.activeTabText]}>Sign Up</Text>
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

          <TouchableOpacity style={styles.loginButton} onPress={handleSubmit} disabled={loading}>
            {loading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text style={styles.loginButtonText}>{activeTab === "login" ? "Log In" : "Sign Up"}</Text>
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
