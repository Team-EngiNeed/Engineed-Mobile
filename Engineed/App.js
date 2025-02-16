import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { PreStack } from "./navigation/stack"; // Auth Screens
import { LEngineer } from "./navigation/LEngineer"; // Protected Routes

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="PreStack" component={PreStack} />
        <Stack.Screen name="LEngineer" component={LEngineer} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
