import React from "react";
import {
  View,
  Text,
  ImageBackground,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Linking,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { FontAwesome, Ionicons, Feather } from "@expo/vector-icons";
import * as Notifications from "expo-notifications";

const AdviSettings = () => {
  const navigation = useNavigation();

  // Enable Notifications Function
  const enableNotifications = async () => {
    const { status } = await Notifications.requestPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission Denied", "Notifications are disabled.");
      return;
    }
    Alert.alert("Enabled", "You will now receive notifications.");
  };

  return (
    <ImageBackground
      source={require("../../assets/images/BG.png")}
      style={styles.container}
      resizeMode="cover"
    >
      <Text style={styles.header}>Settings</Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>General</Text>
        <SettingsButton
          icon="bell"
          text="Enable Notifications"
          onPress={enableNotifications}
        />
        <SettingsButton
          icon="info-circle"
          text="Report a Problem"
          onPress={() => Linking.openURL("mailto:teamengineed@gmail.com")}
        />
        <SettingsButton
          icon="thumbs-up"
          text="Request a Feature"
          onPress={() => Linking.openURL("mailto:teamengineed@gmail.com")}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>About</Text>
        <SettingsButton
          icon="globe"
          text="Website"
          onPress={() => Linking.openURL("https://valmasciengineed.com")}
        />
        <SettingsButton
          icon="envelope"
          text="Contact Us"
          onPress={() => Linking.openURL("mailto:teamengineed@gmail.com")}
        />
      </View>

      <TouchableOpacity
        style={styles.logoutBtn}
        onPress={() => navigation.replace("PreStack")}
      >
        <Text style={styles.logoutText}>Log Out</Text>
        <Feather name="log-out" size={18} color="white" />
      </TouchableOpacity>
    </ImageBackground>
  );
};

const SettingsButton = ({ icon, text, onPress }) => (
  <TouchableOpacity style={styles.button} onPress={onPress}>
    <FontAwesome name={icon} size={18} color="white" style={styles.icon} />
    <Text style={styles.buttonText}>{text}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    fontSize: 30,
    fontWeight: "bold",
    color: "white",
    marginBottom: 20,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "white",
    marginBottom: 10,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: "white",
    marginBottom: 10,
  },
  icon: {
    marginRight: 10,
  },
  buttonText: {
    fontSize: 16,
    color: "white",
  },
  logoutBtn: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "center",
    marginTop: 20,
  },
  logoutText: {
    fontSize: 16,
    color: "white",
    marginRight: 5,
  },
});

export default AdviSettings;
