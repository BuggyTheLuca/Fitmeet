import React, { useEffect, useState } from "react";
import { Dimensions, Image, SafeAreaView, ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import TypeList from "../../components/TypeList/TypeList";
import { ActivityResponse, ActivityType } from "../../types/activity";
import { useActivity } from "../../hooks/useActivity";
import { colors } from "../../assets/styles/colors";
import useAppContext from "../../hooks/useAppContext";
import CustomText from "../../components/CustomText/CustomText";
import { fixUrl } from "../../utils/fix-url";
import ActivityList from "../../components/ActivityList/ActivityList";
import { Plus } from "phosphor-react-native";
import { useCustomNavigation } from "../../hooks/useCustomNavigation";
import ScrollableScreen from "../../components/ScrollableScreen/ScrollableScreen";

export default function Home(){
    const [activityTypes, setActivityTypes] = useState<ActivityType[]>([])

    const {auth: {loggedUser}} = useAppContext()
    const {getActivityTypes} = useActivity()

    const navigation = useCustomNavigation()

    useEffect(() => {
        getActivityTypes().then(data => {
            if(data)
                setActivityTypes(data.activityTypes)
        })
    }, [getActivityTypes])

    const handleProfileClick = () =>{
        navigation.navigate('Profile')
    }

    const handleNewActivityClick = () =>{
        console.log('nova atividade')
    }

    const handleTypeClick = (type: ActivityType) =>{
        navigation.navigate('ActivityByType', { type })
    } 

    const handleActivityClick = (activity: ActivityResponse) =>{
        console.log({activity})
        console.log({loggedUser})
    }

    return (
        <>
            <ScrollableScreen>
                <View style={styles.header}>
                    <View style={styles.welcome}>
                        <CustomText style={{color: colors.white}}>
                            Olá, Seja Bem Vindo
                        </CustomText>
                        <CustomText style={{color: colors.white}} fontSize={30} lineHeight={35}>
                            {loggedUser!.name}!
                        </CustomText>
                    </View>
                    <View style={styles.profile}>
                        <View style={styles.level}>
                            <Image source={require('../../assets/images/level-star.png')}/>
                            <CustomText style={{color: colors.white}}>{loggedUser?.level}</CustomText>
                        </View>
                        <TouchableOpacity onPress={handleProfileClick}>
                            <Image source={{uri: fixUrl(loggedUser!.avatar)}} style={{
                                    width: 58,
                                    height: 58,
                                    borderRadius: 100
                                }}/>
                        </TouchableOpacity>
                    </View>
                </View>
                <View>
                    <ActivityList onclick={handleActivityClick} title="suas recomendações"/>
                </View>
                <View>
                    <TypeList onclick={handleTypeClick} title="Categorias" data={activityTypes}/>
                </View>
            </ScrollableScreen>
            <View style={styles.buttonView}>
                <TouchableOpacity onPress={handleNewActivityClick} style={styles.button}>
                    <Plus size={32} color="white"/>
                </TouchableOpacity>
            </View>
        </>
    )
}

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingTop: 10,
        paddingInline: 15,
        marginBottom: 20,
        height: 137,
        width: Dimensions.get('screen').width,
        borderBottomStartRadius: 32,
        borderBottomEndRadius: 32,
        backgroundColor: colors.primary
    },
    welcome: {
        width: Dimensions.get('screen').width * 0.5
    },
    profile: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12
    },
    level: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingInline: 12,
        gap: 6,
        paddingVertical: 8, 
        borderWidth: 1,
        borderColor: colors.white,
        borderRadius: 5
    },
    buttonView: {
        position: 'absolute',  
        top: Dimensions.get('window').height * 0.91,
        right: 20,
        zIndex: 10,
    },
    button: {
        backgroundColor: colors.primary,
        borderRadius: 100,
        height: 60,
        width: 60,
        alignItems: 'center',
        justifyContent: 'center',
    }
})