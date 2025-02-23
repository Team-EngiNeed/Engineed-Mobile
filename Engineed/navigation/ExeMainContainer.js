import * as React from "react";
import { StyleSheet, Image } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";


// Screens
import ExeHome from "../screens/Executive/ExeHome";
import ExeProfile from "../screens/Executive/ExeProfile";
import ExeReports from "../screens/Executive/ExeReports";
import ExeSubmissions from "../screens/Executive/ExeSubmissions";

const Tab = createBottomTabNavigator();

export default function ExeMainContainer() {
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
              case "Submission":
                iconSource = require("../assets/images/receipticon.png");
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
        <Tab.Screen name="Home" component={ExeHome} />
        <Tab.Screen name="Report" component={ExeReports} />
        <Tab.Screen name="Submission" component={ExeSubmissions} />
        <Tab.Screen name="Profile" component={ExeProfile} />
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
