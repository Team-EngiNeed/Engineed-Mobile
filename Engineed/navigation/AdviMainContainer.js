import * as React from "react";
import { StyleSheet, Image } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

// Screens
import AdviHome from "../screens/Adviser/AdviHome";
import AdviProfile from "../screens/Adviser/AdviProfile";
import AdviReports from "../screens/Adviser/AdviReports";
import AdviSettings from "../screens/Adviser/AdviSettings";

const Tab = createBottomTabNavigator();

export default function AdviMainContainer() {
  return (
    <>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false, // Hide the header for all tabs
          tabBarIcon: ({ focused }) => {
            let iconSource;

            switch (route.name) {
              case "Home":
                iconSource = require("../assets/images/homeicon.png");
                break;
              case "Report":
                iconSource = require("../assets/images/reportsicon.png");
                break;
              case "Profile":
                iconSource = require("../assets/images/profileicon.png");
                break;
              case "Settings":
                iconSource = require("../assets/images/settingsicon.png");
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
        <Tab.Screen name="Home" component={AdviHome} />
        <Tab.Screen name="Report" component={AdviReports} />
        <Tab.Screen name="Profile" component={AdviProfile} />
        <Tab.Screen name="Settings" component={AdviSettings} />
      </Tab.Navigator>
    </>
  );
}

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
