import { Dimensions, FlatList, Image, StyleSheet, TouchableOpacity, View } from "react-native";
import { ActivityType } from "../../types/activity";
import { fixUrl } from "../../utils/fix-url";
import Title from "../Title/Title";
import CustomText from "../CustomText/CustomText";
import { useEffect, useState } from "react";
import { useActivity } from "../../hooks/useActivity";
import { colors } from "../../assets/styles/colors";

interface typeListProps{
    title?: string,
    onClick?: (type: ActivityType) => void,
    type?: 'wrap' | undefined,
    imageSize?: number,
    canSelect?: boolean,
    selectedIds?: string[]
}


export default function TypeList ({title, type, imageSize, onClick, canSelect, selectedIds}: typeListProps){

    const [activityTypes, setActivityTypes] = useState<ActivityType[]>([])

    const [selectedTypes, setSelectedTypes] = useState<string[]>([])

    const {getActivityTypes} = useActivity()

    useEffect(() => {
        getActivityTypes().then(data => {
            if(data)
                setActivityTypes(data.activityTypes)
        })
    }, [getActivityTypes])

    useEffect(() => {
        if(selectedIds)
            setSelectedTypes(selectedIds)
    }, [selectedIds])

    const toggleSelection = (id: string) => {
        if(canSelect)
            setSelectedTypes((prev) =>
                prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
            );
    };

    const getBorder = (id: string) => {
        if(selectedTypes.includes(id))
            return {
                borderWidth: 2,
                borderColor: colors.primary
            }
        else{
            return {
                borderWidth: 2,
                borderColor: colors.white
            }
        }
    }

    return (
        <View style={styles.container}>
            {title ? <Title style={styles.title}>{title}</Title> : null}

            {type === 'wrap' ? (
                <View style={styles.wrapList}>
                    {activityTypes.map((item) => (
                        <TouchableOpacity key={item.id} onPress={() => {
                                onClick?.(item)
                                toggleSelection(item.id)
                            }}>
                            <View style={[styles.item, { width: (imageSize || 61) + 20 }]}>
                                <Image source={{ uri: fixUrl(item.image) }} style={[{
                                    width: imageSize || 61,
                                    height: imageSize || 61,
                                    borderRadius: (imageSize || 61) / 2,
                                }, getBorder(item.id)]}/>
                                <CustomText lineHeight={20} style={{ textAlign: 'center' }}>{item.name}</CustomText>
                            </View>
                        </TouchableOpacity>
                    ))}
                </View>
            ) : (
                <FlatList
                    data={activityTypes}
                    extraData={activityTypes}
                    horizontal
                    renderItem={({ item }) => (
                        <TouchableOpacity onPress={() => {
                                onClick?.(item)
                                toggleSelection(item.id)
                            }}>
                            <View style={[styles.item, { width: (imageSize || 61) + 20 }]}>
                                <Image source={{ uri: fixUrl(item.image) }} style={[{
                                    width: (imageSize || 61),
                                    height: (imageSize || 61),
                                    borderRadius: (imageSize || 61) / 2,
                                }, getBorder(item.id)]} />
                                <CustomText lineHeight={20} style={{ textAlign: 'center' }}>{item.name}</CustomText>
                            </View>
                        </TouchableOpacity>
                    )}
                    keyExtractor={(type) => type.id}
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={{ paddingBottom: 30 }}
                />
            )}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        width: Dimensions.get('window').width,
        minHeight: Dimensions.get('window').height * 0.18,
        flexDirection: 'column',
        alignItems: 'flex-start',
        gap: 6,
        paddingLeft: 10
    },
    wrapList: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
        gap: 16,
    },
    title: {
        paddingLeft: 12
    },
    item: {
        alignItems: 'center',
        marginInline: 5,
        width: Dimensions.get('window').width * 0.2
    }
})