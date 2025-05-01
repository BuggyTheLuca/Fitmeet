import { Dimensions, FlatList, Image, StyleSheet, TouchableOpacity, View } from "react-native";
import { ActivityType } from "../../types/activity";
import { fixUrl } from "../../utils/fix-url";
import Title from "../Title/Title";
import CustomText from "../CustomText/CustomText";

interface typeListProps{
    data: ActivityType[],
    title: string,
    onclick?: (id: string) => void
}


export default function TypeList ({data, title, onclick}: typeListProps){
    return (
        <View style={styles.container}>
            <Title style={styles.title}>{title}</Title>
            <FlatList
                data={data}
                extraData={data}
                horizontal
                renderItem={({ item }) => (
                    <TouchableOpacity onPress={() => onclick?.(item.id)}>
                        <View style={styles.item}>
                            
                                <Image source={{ uri: fixUrl(item.image) }} style={{
                                    width: 61,
                                    height: 61,
                                    borderRadius: 100
                                    }} />
                            
                            <CustomText lineHeight={20}>{item.name}</CustomText>
                        </View>
                    </TouchableOpacity>
                )}
                keyExtractor={(type) => type.id}
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 30 }}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height * 0.18,
        flexDirection: 'column',
        alignItems: 'flex-start',
        gap: 6,
        paddingLeft: 10
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