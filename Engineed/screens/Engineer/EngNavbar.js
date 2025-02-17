import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Image, StyleSheet } from "react-native";
import HomeScreen from "./EngHome";
import ReportsScreen from "./EngReports";
import ProfileScreen from "./EngProfile";
import SettingsScreen from "./EngSettings";

const Tab = createBottomTabNavigator();

const EngNavbar = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused }) => {
          let iconSource;

          switch (route.name) {
            case "Home":
              iconSource = require("../../assets/images/homeicon.png");
              break;
            case "Reports":
              iconSource = require("../../assets/images/reportsicon.png");
              break;
            case "Profile":
              iconSource = require("../../assets/images/profileicon.png");
              break;
            case "Settings":
              iconSource = require("../../assets/images/settingsicon.png");
              break;
          }

          return (
            <Image
              source={iconSource}
              style={[
                styles.icon,
                focused ? styles.focusedIcon : styles.unfocusedIcon,
              ]}
            />
          );
        },
        tabBarLabelStyle: {
          fontSize: 14,
          fontWeight: "bold",
        },
        tabBarActiveTintColor: "yellow",
        tabBarInactiveTintColor: "white",
        tabBarStyle: styles.tabBar,
      })}
    >
      <Tab.Screen name="EngHome" component={HomeScreen} />
      <Tab.Screen name="EngReports" component={ReportsScreen} />
      <Tab.Screen name="EngProfile" component={ProfileScreen} />
      <Tab.Screen name="EngSettings" component={SettingsScreen} />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: "#5A54F9",
    height: 60,
  },
  icon: {
    width: 25,
    height: 25,
    resizeMode: "contain",
  },
  focusedIcon: {
    tintColor: "yellow",
  },
  unfocusedIcon: {
    tintColor: "white",
  },
});

export default EngNavbar;
