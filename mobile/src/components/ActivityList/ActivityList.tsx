import { Dimensions, FlatList, Image, StyleSheet, TouchableOpacity, View } from "react-native";
import { ActivityResponse } from "../../types/activity";
import { fixUrl } from "../../utils/fix-url";
import Title from "../Title/Title";
import CustomText from "../CustomText/CustomText";
import { fonts } from "../../assets/styles/fonts";
import { formatDate } from "../../utils/format-date";
import React, { useEffect, useState } from "react";
import { CaretDown, CaretUp, LockSimple } from "phosphor-react-native";
import { ActivityPage, Pageable } from "../../types/pageable";
import { useActivity } from "../../hooks/useActivity";
import { defaultPageable } from "../../utils/defaultPageable";
import { colors } from "../../assets/styles/colors";
import { useRefreshContext } from "../../contexts/refreshContext";
import { CustomButton } from "../CustomButton/CustomButton";


//<Button onClick={handleSeeMore}>Ver mais</Button>
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
    const [activityPage, setActivitiesPage] = useState<ActivityPage>()

    const {shouldRefresh} = useRefreshContext()

    const {getActivitiesParticipating, getActivitiesCreated, getActivities} = useActivity()

    useEffect(() => {
        if (responseType === 'created') {
            getActivitiesCreated(pageable).then(data => {
                if (data) {
                    setActivities(data.activityPage.activities);
                    setActivitiesPage(data.activityPage)
                }
            });
            return;
        }
    
        if (responseType === 'participating') {
            getActivitiesParticipating(pageable).then(data => {
                if (data) {
                    setActivities(data.activityPage.activities);
                    setActivitiesPage(data.activityPage)
                }
            });
            return;
        }
    
        getActivities(pageable).then(data => {
            if (data) {
                setActivities(data.activityPage.activities);
                setActivitiesPage(data.activityPage)
            }
        });
    
    }, [getActivitiesCreated, getActivitiesParticipating, getActivities, responseType, pageable, shouldRefresh])

    const handleSeeMore = () => {
        const currentPage = activityPage;
        if(!currentPage) return;

        const nextPage = currentPage.pageSize / defaultPageable.pageSize + 1;

        const newPageable: Pageable = {
            page: nextPage,
            pageSize: pageable.pageSize,
            filter: pageable.filter
        };

        getActivities(newPageable)?.then((data) => {
            if(data && data.status == 200) {
                const newPage: ActivityPage = {
                    ...currentPage,
                    pageSize: currentPage.pageSize + data.activityPage.pageSize,
                    activities: [...currentPage.activities, ...data.activityPage.activities],
                    page: 1
                };
                setActivitiesPage(newPage);
                setActivities(newPage.activities)
            }
        });
    }


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
            {activityPage ? activityPage.activities.length < activityPage.totalActivities ? <View style={{width: '100%',flexDirection: 'row', justifyContent: 'center'}}>
                <CustomButton text="Ver mais..." onClick={handleSeeMore}/>
            </View>
             : null : null}
            
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