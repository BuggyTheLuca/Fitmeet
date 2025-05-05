import { RouteProp, useRoute } from "@react-navigation/native";
import React from "react";
import { MainStackParamList } from "../../routes/AppRoutes";


type EditActivityRouteProp = RouteProp<MainStackParamList, 'EditActivity'>;

export function EditActivity(){

    const route = useRoute<EditActivityRouteProp>();
    const { activity } = route.params;
    return(<></>)
}