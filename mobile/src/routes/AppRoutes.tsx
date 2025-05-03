import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import React, { useEffect, useState } from "react";
import Login from "../pages/login/Login";
import Register from "../pages/register/Register";
import Home from "../pages/home/Home";
import { ActivityByType } from "../pages/ActivityByType/ActivityByType";
import { ActivityType } from "../types/activity";
import useAppContext from "../hooks/useAppContext";
import { ActivityIndicator, View } from "react-native";
import Profile from "../pages/Profile/Profile";
import { CreateActivity } from "../pages/CreateActivity/CreateActivity";

export type MainStackParamList = {
    Login: undefined;
    Register: undefined;
    Home: undefined;
    ActivityByType: {
        type: ActivityType;
    };
    CreateActivity: undefined,
    Profile: undefined
}

const MainStack = createStackNavigator<MainStackParamList>();

function MainStackScreen(){
    return (
        <MainStack.Navigator screenOptions={{headerShown: false}} initialRouteName="Home">
            <MainStack.Screen name="Home" component={Home}/>
            <MainStack.Screen name="ActivityByType" component={ActivityByType}/>
            <MainStack.Screen name="CreateActivity" component={CreateActivity}/>
            <MainStack.Screen name="Profile" component={Profile}/>
        </MainStack.Navigator>
    )
}

const LoginStack = createStackNavigator<MainStackParamList>();

function LoginStackScreen() {
    return (
        <LoginStack.Navigator initialRouteName="Login">
            <LoginStack.Group
                screenOptions={{
                    headerShown: false,
                }}
            >
                <LoginStack.Screen name="Login" component={Login} />
                <LoginStack.Screen name="Register" component={Register}/>
            </LoginStack.Group>
        </LoginStack.Navigator>
    );
}

export default function AppRoutes() {
    const { auth: { isAuthenticated, isLoading } } = useAppContext();

    return (
        isLoading ? (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color="#00BC7D" />
            </View>
        ) :
        <NavigationContainer>
            {isAuthenticated ? <MainStackScreen/> : <LoginStackScreen/>}
        </NavigationContainer>
    );
}