import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import React from "react";
import Login from "../pages/login/Login";
import Register from "../pages/register/Register";
import Home from "../pages/home/Home";
import { useAuthInterceptor } from "../hooks/useAuthInterceptor";
import { ActivityByType } from "../pages/ActivityByType/ActivityByType";
import { ActivityType } from "../types/activity";

export type MainStackParamList = {
    Login: undefined;
    Register: undefined;
    Home: undefined;
    ActivityByType: {
        type: ActivityType;
    };
}

const MainStack = createStackNavigator<MainStackParamList>();

function MainStackScreen(){
    return (
        <MainStack.Navigator screenOptions={{headerShown: false}} initialRouteName="Login">
            <MainStack.Screen name="Login" component={Login}/>
            <MainStack.Screen name="Register" component={Register}/>
            <MainStack.Screen name="Home" component={Home}/>
            <MainStack.Screen name="ActivityByType" component={ActivityByType}/>
        </MainStack.Navigator>
    )
}

function WithInterceptor({ children }: { children: React.ReactNode }) {
    useAuthInterceptor();
    return <>{children}</>;
  }

export default function AppRoutes() {
    return (
        <NavigationContainer>
            <WithInterceptor>
                <MainStackScreen />
            </WithInterceptor>
        </NavigationContainer>
    )
}