import React, { useEffect, useState } from "react";
import { Dimensions, Image, SafeAreaView, StyleSheet, TouchableOpacity, View } from "react-native";
import TypeList from "../../components/TypeList/TypeList";
import { ActivityResponse, ActivityType } from "../../types/activity";
import { useActivity } from "../../hooks/useActivity";
import { colors } from "../../assets/styles/colors";
import useAppContext from "../../hooks/useAppContext";
import CustomText from "../../components/CustomText/CustomText";
import { fixUrl } from "../../utils/fix-url";
import { Pageable } from "../../types/pageable";
import ActivityList from "../../components/ActivityList/ActivityList";
import { Plus } from "phosphor-react-native";

export default function Home(){
    const [activityTypes, setActivityTypes] = useState<ActivityType[]>([])
    const [activities, setActivities] = useState<ActivityResponse[]>([])

    const {auth: {loggedUser}} = useAppContext()
    const {getActivityTypes, getActivities} = useActivity()

    useEffect(() => {
        getActivityTypes().then(data => {
            if(data)
                setActivityTypes(data.activityTypes)
        })
    }, [getActivityTypes])

    useEffect(() => {
        const pageable: Pageable = {
            page: 1,
            pageSize: 3
        }

        getActivities(pageable).then(data => {
            if(data)
                setActivities(data.activityPage.activities)
        })
    }, [getActivities])

    const handleProfileClick = () =>{
        console.log("profile")
    }

    const handleNewActivityClick = () =>{
        console.log('nova atividade')
    }

    const handleTypeClick = (id: string) =>{
        console.log('type click', id)
    } 

    const handleActivityClick = (id: string) =>{
        console.log('activity click', id)
    }

    return (
        <>
            <SafeAreaView style={[styles.container]}>
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
                <View style={styles.section}>
                    <ActivityList onclick={handleActivityClick} title="suas recomendações" data={activities}/>
                </View>
                <View style={styles.section}>
                    <TypeList onclick={handleTypeClick} title="Categorias" data={activityTypes}/>
                </View>
                <View style={styles.buttonView}>
                    <TouchableOpacity onPress={handleNewActivityClick} style={styles.button}>
                        <Plus size={32} color="white"/>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        </>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        alignItems: 'flex-start',
        backgroundColor: colors.white
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingTop: 10,
        paddingInline: 15,
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
    section: {
        marginTop: 8
    },
    buttonView: {
        width: Dimensions.get('screen').width * 0.95,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
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