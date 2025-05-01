import { Dimensions, FlatList, Image, StyleSheet, TouchableOpacity, View } from "react-native";
import { ActivityResponse } from "../../types/activity";
import { fixUrl } from "../../utils/fix-url";
import Title from "../Title/Title";
import CustomText from "../CustomText/CustomText";
import { fonts } from "../../assets/styles/fonts";
import { formatDate } from "../../utils/format-date";

interface activityListProps{
    data: ActivityResponse[]
    title: string,
    onclick?: (id: string) => void
}


export default function ActivityList ({data, title, onclick}: activityListProps){
    return (
        <View style={styles.container}>
            <Title style={styles.title}>{title}</Title>
            <FlatList
                style={{borderRadius: 10}}
                data={data}
                extraData={data}
                renderItem={({ item }) => (
                    <View style={styles.item}>
                        <TouchableOpacity onPress={() => onclick?.(item.id)}>
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
                    </View>
                )}
                keyExtractor={(type) => type.id}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 30 }}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height * 0.555,
        flexDirection: 'column',
        alignItems: 'flex-start',
        gap: 6,
        paddingLeft: 10,
    },
    title: {
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
    } 
})