import React from "react";
import { ImageBackground, StyleSheet } from "react-native";

export default function AuthBackground({ children }: { children: React.ReactNode }) {
  return (
    <ImageBackground
      source={require('../../../assets/images/init-image.png')}
      style={styles.background}
      resizeMode="cover"
    >
      {children}
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});