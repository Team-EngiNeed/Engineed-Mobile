import * as React from "react";
import { StyleSheet, Image } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";


// Screens
import EngHome from "../screens/Engineer/EngHome";
import EngReports from "../screens/Engineer/EngReports";
import EngProfile from "../screens/Engineer/EngProfile";
import EngSettings from "../screens/Engineer/EngSettings";

const Tab = createBottomTabNavigator();

export default function EngiMainContainer() {
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
              case "Reports":
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
        <Tab.Screen name="Home" component={EngHome} />
        <Tab.Screen name="Reports" component={EngReports} />
        <Tab.Screen name="Profile" component={EngProfile} />
        <Tab.Screen name="Settings" component={EngSettings} />
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
