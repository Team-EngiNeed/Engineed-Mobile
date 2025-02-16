import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { View, Text } from "react-native";
import ProtectedRoute from "../components/ProtectedRoute";

const Stack = createNativeStackNavigator();

export const LEngineer = () => {
  return (
    <ProtectedRoute>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Engineer-Home">
          {() => (
            <View>
              <Text>Successful!</Text>
            </View>
          )}
        </Stack.Screen>
      </Stack.Navigator>
    </ProtectedRoute>
  );
};
