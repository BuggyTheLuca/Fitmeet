import React, { useEffect, useMemo, useState } from "react";
import { ActivityResponse, ActivityType } from "../../types/activity";
import { useActivity } from "../../hooks/useActivity";
import { Pageable } from "../../types/pageable";
import { SafeAreaView, ScrollView, StyleSheet, View } from "react-native";
import { colors } from "../../assets/styles/colors";
import PreviousViewNav from "../../components/PreviousViewNav/PreviousViewNav";
import { RouteProp, useRoute } from "@react-navigation/native";
import { MainStackParamList } from "../../routes/AppRoutes";
import Title from "../../components/Title/Title";
import TypeList from "../../components/TypeList/TypeList";
import ActivityList from "../../components/ActivityList/ActivityList";
import { useCustomNavigation } from "../../hooks/useCustomNavigation";
import { defaultPageable } from "../../utils/defaultPageable";
import ScrollableScreen from "../../components/ScrollableScreen/ScrollableScreen";

type ActivityByTypeRouteProp = RouteProp<MainStackParamList, 'ActivityByType'>;

export function ActivityByType() {
    const route = useRoute<ActivityByTypeRouteProp>();
    const { type } = route.params;
    
    const [pageable, setPageable] = useState<Pageable>(defaultPageable)

    const navigation = useCustomNavigation()

    const newPageable = useMemo(() => ({
        ...defaultPageable,
        filter: type.id
      }), [type.id]);
      
      useEffect(() => {
        setPageable(newPageable);
      }, [newPageable]);

    const handleTypeClick = (newType: ActivityType) =>{
        navigation.navigate('ActivityByType', { type: newType })
    } 

    const handleActivityClick = (activity: ActivityResponse) =>{
        console.log('activity click', activity)
    }

    return (
        <>
            <ScrollableScreen>
            <PreviousViewNav/>
                <View style={styles.header}>
                    <View style={{flexDirection: 'row', width: '100%', justifyContent: 'center'}}>
                        <Title>{type.name}</Title>
                    </View>
                </View>
                <View style={styles.section}>
                    <TypeList onClick={handleTypeClick} title="Categorias"/>
                </View>
                <View style={styles.section}>
                    <ActivityList onClick={handleActivityClick} title="Suas atividades" responseType="created" type="collapse"/>
                </View>
                <View style={styles.section}>
                    {pageable.filter && (
                        <ActivityList onClick={handleActivityClick} title="Atividades da comunidade" pageable={pageable} />
                    )}
                </View>
            </ScrollableScreen>
        </>
    )
}


const styles = StyleSheet.create({
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