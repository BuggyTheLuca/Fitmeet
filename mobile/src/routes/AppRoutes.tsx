import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import React from "react";
import Login from "../components/screens/login/Login";
import AuthBackground from "../components/commons/authBackground/AuthBackground";
import Register from "../components/screens/register/Register";

export type MainStackParamList = {
    Login: undefined;
    Register: undefined;
}

const MainStack = createStackNavigator<MainStackParamList>();

function MainStackScreen(){
    return (
        <MainStack.Navigator screenOptions={{headerShown: false}} initialRouteName="Login">
            <MainStack.Screen name="Login" component={Login}/>
            <MainStack.Screen name="Register" component={Register}/>
        </MainStack.Navigator>
    )
}

export default function AppRoutes() {
    return (
        <NavigationContainer>
            <MainStackScreen/>
        </NavigationContainer>
    )
}