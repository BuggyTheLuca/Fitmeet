import { Dimensions, FlatList, Image, StyleSheet, TouchableOpacity, View } from "react-native";
import { ActivityResponse } from "../../types/activity";
import { fixUrl } from "../../utils/fix-url";
import Title from "../Title/Title";
import CustomText from "../CustomText/CustomText";
import { fonts } from "../../assets/styles/fonts";
import { formatDate } from "../../utils/format-date";
import React, { useEffect, useState } from "react";
import { CaretDown, CaretUp, LockSimple } from "phosphor-react-native";
import { Pageable } from "../../types/pageable";
import { useActivity } from "../../hooks/useActivity";
import { defaultPageable } from "../../utils/defaultPageable";
import { colors } from "../../assets/styles/colors";

interface activityListProps{
    title: string,
    type?: 'link' | 'collapse' | undefined,
    pageable?: Pageable,
    responseType?: 'created' | 'participating' | undefined
    onClick?: (activity: ActivityResponse) => void
}

export default function ActivityList ({title, type, onClick, responseType, pageable = defaultPageable}: activityListProps){

    const [isCollapsed, setCollapsed] = useState((type == "collapse"))
    const [activities, setActivities] = useState<ActivityResponse[]>([])

    const {getActivitiesParticipating, getActivitiesCreated, getActivities} = useActivity()

    useEffect(() => {
        if (responseType === 'created') {
            getActivitiesCreated(pageable).then(data => {
                if (data) setActivities(data.activityPage.activities);
            });
            return;
        }
    
        if (responseType === 'participating') {
            getActivitiesParticipating(pageable).then(data => {
                if (data) setActivities(data.activityPage.activities);
            });
            return;
        }
    
        getActivities(pageable).then(data => {
            if (data) setActivities(data.activityPage.activities);
        });
    
    }, [getActivitiesCreated, getActivitiesParticipating, getActivities, responseType, pageable])


    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Title>{title}</Title>
                {type ? 
                    (() => {
                        switch (type) {
                            case "collapse":
                                return <>
                                    <TouchableOpacity onPress={() => setCollapsed(!isCollapsed)}>
                                        {isCollapsed ? <CaretUp/> : <CaretDown/>}
                                    </TouchableOpacity>
                                </>;

                            case "link":
                                return <>
                                
                                </>;

                            default:
                                return null
                        }
                    })()
                    :
                    null
                }
            </View>
            {isCollapsed ? null : <FlatList
                data={activities}
                extraData={activities}
                scrollEnabled={false}
                renderItem={({ item }) => (
                    <View style={styles.item}>
                        <TouchableOpacity onPress={() => onClick?.(item)}>
                            <Image source={{uri: fixUrl(item.image)}} style={{width: Dimensions.get('window').width * 0.9,
                                height: 160,
                                borderRadius: 10}}/>
                            <CustomText style={{fontFamily: fonts.DMSans.semiBold}}>{item.title}</CustomText>
                            <View style={styles.itemDescription}>
                                <Image source={require('../../assets/images/calendar.png')} style={{
                                        width: 20,
                                        height: 20,
                                    }}/>
                                <CustomText>{formatDate(item.scheduledDate)}</CustomText>
                                <CustomText>|</CustomText>
                                <Image source={require('../../assets/images/persons.png')} style={{
                                        width: 20,
                                        height: 20,
                                    }}/>
                                <CustomText>{item.participantCount}</CustomText>

                            </View>
                        </TouchableOpacity>
                        {item.private && <View style={styles.privateImage}>
                            <LockSimple color={colors.white} size={20}></LockSimple>
                        </View>}
                    </View>
                )}
                keyExtractor={(type) => type.id}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 30 }}
            />}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        width: Dimensions.get('window').width,
        flexDirection: 'column',
        alignItems: 'flex-start',
        gap: 6,
        paddingLeft: 10,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '90%',
        paddingLeft: 12
    },
    item: {
        alignItems: 'flex-start',
        marginInline: 5,
        width: Dimensions.get('window').width * 0.9,
        marginBottom: 5
    },
    itemDescription: {
        width: '60%',
        flexDirection: 'row',
        justifyContent: 'space-around'
    },
    privateImage: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.primary,
        width: 28,
        height: 28,
        borderRadius: 14,
        position: 'absolute',
        top: 5,
        left: 5
    }
})