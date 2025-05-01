import React, { useEffect, useState } from "react";
import { ActivityResponse, ActivityType } from "../../types/activity";
import { useActivity } from "../../hooks/useActivity";
import { Pageable } from "../../types/pageable";
import { SafeAreaView, StyleSheet, View } from "react-native";
import { colors } from "../../assets/styles/colors";
import PreviousViewNav from "../../components/PreviousViewNav/PreviousViewNav";
import { RouteProp, useRoute } from "@react-navigation/native";
import { MainStackParamList } from "../../routes/AppRoutes";
import Title from "../../components/Title/Title";
import TypeList from "../../components/TypeList/TypeList";
import ActivityList from "../../components/ActivityList/ActivityList";
import { useCustomNavigation } from "../../hooks/useCustomNavigation";

type ActivityByTypeRouteProp = RouteProp<MainStackParamList, 'ActivityByType'>;

export function ActivityByType() {
    const route = useRoute<ActivityByTypeRouteProp>();
    const { type } = route.params;
    
    const [activityTypes, setActivityTypes] = useState<ActivityType[]>([])
    const [activities, setActivities] = useState<ActivityResponse[]>([])
    const [activitiesCreated, setActivitiesCreated] = useState<ActivityResponse[]>([])

    const navigation = useCustomNavigation()

    const {getActivityTypes, getActivities, getActivitiesCreated} = useActivity()

    useEffect(() => {
        getActivityTypes().then(data => {
            if(data)
                setActivityTypes(data.activityTypes)
        })
    }, [getActivityTypes])

    useEffect(() => {
        const pageable: Pageable = {
            page: 1,
            pageSize: 3,
            filter: type.id
        }

        getActivities(pageable).then(data => {
            if(data)
                setActivities(data.activityPage.activities)
        })
    }, [getActivities, type])

    useEffect(() => {
        const pageable: Pageable = {
            page: 1,
            pageSize: 3,
            filter: type.id
        }

        getActivitiesCreated(pageable).then(data => {
            if(data)
                setActivitiesCreated(data.activityPage.activities)
        })
    }, [getActivitiesCreated, type])

    const handleTypeClick = (newType: ActivityType) =>{
        navigation.navigate('ActivityByType', { type: newType })
    } 

    const handleActivityClick = (id: string) =>{
        console.log('activity click', id)
    }

    return (
        <>
            <PreviousViewNav/>
            <SafeAreaView style={[styles.container]}>
                <View style={styles.header}>
                        <View style={{flexDirection: 'row', width: '100%', justifyContent: 'center'}}>
                            <Title>{type.name}</Title>
                        </View>
                </View>
                <View style={styles.section}>
                    <TypeList onclick={handleTypeClick} title="Categorias" data={activityTypes}/>
                </View>
                <View style={styles.section}>
                    <ActivityList onclick={handleActivityClick} title="Suas atividades" data={activitiesCreated} type="collapse"/>
                </View>
                <View style={styles.section}>
                    <ActivityList onclick={handleActivityClick} title="Atividades da comunidade" data={activities}/>
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
        width: '100%',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 12,
        marginTop: 40,
        marginBottom: 20
    },
    section: {
        marginTop: 8
    },
})