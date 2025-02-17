import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import EngNavbar from "../screens/Engineer/EngNavbar"
import ProtectedRoute from "../components/ProtectedRoute";
import EngHome from '../screens/Engineer/EngHome'


const Stack = createNativeStackNavigator();

export const LEngineer = () => {
  return (
    <ProtectedRoute>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="EngNavbar" component={EngNavbar} />
        <Stack.Screen name="EngHome" component={EngHome}>
        </Stack.Screen>
      </Stack.Navigator>
    </ProtectedRoute>
  );
};
