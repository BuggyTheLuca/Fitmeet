import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import React, { useEffect, useState } from "react";
import Login from "../pages/login/Login";
import Register from "../pages/register/Register";
import Home from "../pages/home/Home";
import { ActivityByType } from "../pages/ActivityByType/ActivityByType";
import { ActivityResponse, ActivityType } from "../types/activity";
import useAppContext from "../hooks/useAppContext";
import { ActivityIndicator, View } from "react-native";
import Profile from "../pages/Profile/Profile";
import { CreateActivity } from "../pages/CreateActivity/CreateActivity";
import { ActivityDetails } from "../pages/ActivityDetails/ActivityDetails";
import { EditActivity } from "../pages/EditActivity/EditActivity";
import { colors } from "../assets/styles/colors";
import EditProfile from "../pages/EditProfile/EditProfile";

export type MainStackParamList = {
    Login: undefined;
    Register: undefined;
    Home: undefined;
    ActivityByType: {
        type: ActivityType;
    };
    ActivityDetails: {
        activity: ActivityResponse;
    };
    EditActivity: {
        activity: ActivityResponse;
    }
    CreateActivity: undefined,
    Profile: undefined,
    EditProfile: undefined
}

const MainStack = createStackNavigator<MainStackParamList>();

function MainStackScreen(){
    return (
        <MainStack.Navigator screenOptions={{headerShown: false}} initialRouteName="Home">
            <MainStack.Screen name="Home" component={Home}/>
            <MainStack.Screen name="ActivityByType" component={ActivityByType}/>
            <MainStack.Screen name="CreateActivity" component={CreateActivity}/>
            <MainStack.Screen name="EditActivity" component={EditActivity}/>
            <MainStack.Screen name="ActivityDetails" component={ActivityDetails}/>
            <MainStack.Screen name="Profile" component={Profile}/>
            <MainStack.Screen name="EditProfile" component={EditProfile}/>
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
                <ActivityIndicator size="large" color={colors.primary} />
            </View>
        ) :
        <NavigationContainer>
            {isAuthenticated ? <MainStackScreen/> : <LoginStackScreen/>}
        </NavigationContainer>
    );
}