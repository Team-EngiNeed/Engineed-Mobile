import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  Dimensions,
  Modal,
  TextInput,
  Button,
  Linking,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Font from "expo-font";
import api from "../../api";
import { ACCENT } from "../../assets/misc/colors";

const ExeProfile = () => {
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState({});
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editableData, setEditableData] = useState({});

  const today = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // Load fonts and user data
  useEffect(() => {
    const loadFonts = async () => {
      await Font.loadAsync({
        Outfit: require("../../assets/fonts/Outfit-VariableFont_wght.ttf"),
      });
      setFontsLoaded(true);
    };

    const fetchUserProfile = async () => {
      try {
        const storedUserData = await AsyncStorage.getItem("userData");
        console.log("Stored User Data:", storedUserData); // DEBUGGING

        const parsedData = storedUserData ? JSON.parse(storedUserData) : {};

        if (parsedData && parsedData.username) {
          console.log("Parsed Data:", parsedData); // DEBUGGING

          // Extract section and role from username
          const [section, role] = parsedData.username.split("-");
          const updatedUserData = {
            ...parsedData,
            section: section || "No Section", // Fallback if section is missing
            role: role || "No Role", // Fallback if role is missing
          };

          setUserData(updatedUserData);
        } else {
          const response = await api.get("api/user/profile/");
          console.log("Fetched user data:", response.data); // DEBUGGING

          if (response.data) {
            // Extract section and role from username
            const [section, role] = response.data.username.split("-");
            const userProfile = {
              username: response.data.username,
              name: response.data.name,
              section: section || "No Section",
              role: role || "No Role",
            };

            setUserData(userProfile);
            await AsyncStorage.setItem("userData", JSON.stringify(userProfile));
          }
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
      } finally {
        setLoading(false);
      }
    };

    loadFonts();
    fetchUserProfile();
  }, []);

  const handleSave = async () => {
    setUserData(editableData);
    setIsModalVisible(false);
    await AsyncStorage.setItem("userData", JSON.stringify(editableData));
  };

  const username = userData.username || "User";
  const splitUsername = username.includes("-")
    ? username.split("-").join(" ")
    : username;

  if (!fontsLoaded || loading) {
    return <Text>Loading...</Text>;
  }

  return (
    <ScrollView style={styles.container}>
      <Image
        style={styles.logo}
        source={require("../../assets/images/ENGINEED LOGO.png")}
      />
      {/* Displaying full name in the greeting */}
      <Text style={styles.greeting}>Hello, {splitUsername}!</Text>
      <Text style={styles.date}>{today}</Text>

      <TouchableOpacity onPress={() => setIsModalVisible(true)}>
        <View style={styles.profileCard}>
          <Image
            source={require("../../assets/images/user-placeholder.png")}
            style={styles.profileImage}
          />
          <View>
            <Text style={styles.section}>{userData.section}</Text>
            <Text style={styles.role}>{userData.role}</Text>
          </View>
        </View>
      </TouchableOpacity>

      <Modal visible={isModalVisible} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Edit Profile</Text>

            <TextInput
              style={styles.input}
              placeholder="Name"
              value={editableData.name}
              onChangeText={(text) =>
                setEditableData({ ...editableData, name: text })
              }
            />
            <TextInput
              style={styles.input}
              placeholder="Role"
              value={editableData.role}
              onChangeText={(text) =>
                setEditableData({ ...editableData, role: text })
              }
            />

            <Button title="Save Changes" onPress={handleSave} color="#5A54F9" />
            <Button
              title="Cancel"
              onPress={() => setIsModalVisible(false)}
              color="#888"
            />
          </View>
        </View>
      </Modal>

      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Submit a Report</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>How to Use?</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.button}
        onPress={() => Linking.openURL("https://valmasciengineed.com")}
      >
        <Text style={styles.buttonText}>EngiNeed Website</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.button}
        onPress={() => Linking.openURL("mailto:teamengineed@gmail.com")}
      >
        <Text style={styles.buttonText}>Contact Us</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const { width } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#5A54F9",
    padding: 20,
  },
  greeting: {
    fontSize: 18,
    color: "#fff",
    fontFamily: "Outfit",
    textAlign: "left",
    marginTop: -45,
  },
  date: {
    fontSize: 18,
    color: "#fff",
    textAlign: "left",
    fontFamily: "Outfit",
    marginBottom: 20,
  },
  profileCard: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 20,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 30,
    marginRight: 15,
  },
  section: {
    fontSize: 24,
    fontWeight: "bold",
    fontFamily: "Outfit",
  },
  role: {
    fontSize: 18,
    color: "#666",
    fontFamily: "Outfit",
  },
  button: {
    backgroundColor: "#fff",
    paddingVertical: 12,
    borderRadius: 25,
    marginVertical: 5,
  },
  buttonText: {
    textAlign: "center",
    color: ACCENT,
    fontFamily: "Outfit",
    fontWeight: "bold",
    fontSize: 18,
    color: "#5A54F9",
  },
  logo: {
    width: width * 0.85,
    height: width * 0.5,
    resizeMode: "contain",
    marginTop: -50,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 20,
    width: "80%",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
  },
});

export default ExeProfile;
