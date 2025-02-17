import { createStackNavigator } from "@react-navigation/stack";
import Account from "../screens/Account";
import Intro from "../screens/Intro";
import MainContainer from "./MainContainer";

const Stack = createStackNavigator();

export const PreStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Intro" component={Intro} />
      <Stack.Screen name="Account" component={Account} />
    </Stack.Navigator>
  );
};
