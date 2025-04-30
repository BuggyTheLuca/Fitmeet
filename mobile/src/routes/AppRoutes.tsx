import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import React from "react";
import Login from "../pages/login/Login";
import Register from "../pages/register/Register";
import Home from "../pages/home/Home";

export type MainStackParamList = {
    Login: undefined;
    Register: undefined;
    Home: undefined
}

const MainStack = createStackNavigator<MainStackParamList>();

function MainStackScreen(){
    return (
        <MainStack.Navigator screenOptions={{headerShown: false}} initialRouteName="Login">
            <MainStack.Screen name="Login" component={Login}/>
            <MainStack.Screen name="Register" component={Register}/>
            <MainStack.Screen name="Home" component={Home}/>
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