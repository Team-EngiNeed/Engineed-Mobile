import React from "react";
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  StatusBar,
  Dimensions,
  Image,
  ImageBackground,
} from "react-native";
import { ACCENT, TEXT } from "../assets/misc/colors";
import * as Font from "expo-font";
import { useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";


const Intro = () => {
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    async function loadFonts() {
      await Font.loadAsync({
        Outfit: require("../assets/fonts/Outfit-VariableFont_wght.ttf"),
      });
      setFontsLoaded(true);
    }
    loadFonts();
  }, []);

  if (!fontsLoaded) {
    return <Text>Loading...</Text>;
  }

  return (
    <>
      <StatusBar hidden />
      <ImageBackground
        source={require("../assets/images/BG.png")}
        style={styles.container}
        resizeMode="cover"
      >
        <Image
          style={styles.logo}
          source={require("../assets/images/ENGINEED LOGO.png")}
        />
        <TouchableOpacity style={styles.btn} onPress={() =>navigation.navigate('Account')}>
          <Text style={styles.btnText}>Get Started</Text>
        </TouchableOpacity>
      </ImageBackground>
    </>
  );
};


const { width, height } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  btn: {
    backgroundColor: ACCENT,
    paddingVertical: 14,
    paddingHorizontal: 25,
    borderRadius: 30,
    margin: 5,
    zIndex: 100,
    bottom: 50,
  },
  btnText: {
    color: TEXT,
    fontSize: 16,
    fontFamily: "Outfit",
  },
  logo: {
    width: width * 0.85,
    height: width * 0.5,
    resizeMode: "contain",
    marginBottom: 20,
  },
});

export default Intro;