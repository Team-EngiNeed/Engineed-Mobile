import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { PreStack } from "./navigation/stack";
import EngiMainContainer from "./navigation/EngiMainContainer";
import ExeMainContainer from "./navigation/ExeMainContainer";
import AdviMainContainer from "./navigation/AdviMainContainer";


const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="PreStack" component={PreStack} />
        <Stack.Screen name="EngiMainContainer" component={EngiMainContainer} />
        <Stack.Screen name="ExeMainContainer" component={ExeMainContainer} />
        <Stack.Screen name="AdviMainContainer" component={AdviMainContainer} />
        </Stack.Navigator>
    </NavigationContainer>
  );
}
