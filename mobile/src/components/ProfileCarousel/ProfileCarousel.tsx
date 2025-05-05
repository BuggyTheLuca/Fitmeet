
import { Dimensions, FlatList, Image, StyleSheet, View } from 'react-native';
import CustomText from '../../components/CustomText/CustomText';
import { LoggedUser } from '../../types/user';
import { colors } from '../../assets/styles/colors';
import Title from '../Title/Title';


const icon = require('../../assets/images/Icon.png');
const trophy = require('../../assets/images/trofeu.png');
const medal = require('../../assets/images/medal.png');


interface ProfileStatusBoxProps {
    user: any;
}

function ProfileStatusBox({ user }: ProfileStatusBoxProps) {

    const progress = Math.min((user.xp / 1000) * 100, 100);

    return (
        <View style={styles.container}>
            <View style={styles.iconContainer}>
                <Image source={icon} style={styles.icon} />
            </View>
            <View style={styles.row}>
                <View>
                    <CustomText>
                        Seu nível é
                    </CustomText>
                    <Title>
                        {user.level}
                    </Title>
                </View>
                <Image source={trophy} style={{ width: 160, height: 75 }} />
            </View>
            <View>
                <View style={styles.row}>
                    <CustomText>
                        Pontos para o próximo nível
                    </CustomText>
                    <CustomText>
                        {user.xp}/1000
                        <CustomText>
                            pts
                        </CustomText>
                    </CustomText>
                </View>
                <View style={styles.bar}>
                    <View style={[styles.barStatus, {width: progress}]} />
                </View>
            </View>
        </View>
    )
}

interface MedalBoxProps {
    user: any
}


function renderMedalCard(ac: any) {
    return (
        <View style={{ width: 120, height: '100%', alignSelf: 'center' }}>
            <View style={{ width: 110, height: 110, borderRadius: 110/2, backgroundColor: '#D9D9D9', justifyContent: 'center', alignItems: 'center'}}>
                <Image source={medal} style={{ width: 65, height: 90 }} />
            </View>
            <View>
                <CustomText style={{ fontSize: 20, fontWeight: 'bold' }}>
                    {ac.name}
                </CustomText>
                <CustomText style={{ fontSize: 14, lineHeight: 18 }}>
                    {ac.criterion}
                </CustomText>
            </View>
        </View>
    )
}


function MedalBox({ user }: MedalBoxProps) {

    const groupedAchievements: any[][] = [];

    if (user.achievements) {
        for (let i = 0; i < user.achievements.length; i += 2) {
            groupedAchievements.push(user.achievements.slice(i, i + 2));
        }
    }



    return (
        <View style={[styles.container, { alignContent: 'center', justifyContent: 'center' }]}>
            <FlatList
                data={groupedAchievements}
                keyExtractor={(__, index) => `group-${index}`}
                renderItem={({ item }) => (
                    <View style={{ height: 230, width: '85%', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                        {
                            item.map((ac, index) => (
                                <View style={{ paddingHorizontal: 10 }} key={ac.name + '_' + index}>
                                    {renderMedalCard(ac)}
                                </View>
                            ))
                        }
                    </View>
                )}
                showsVerticalScrollIndicator={false}
                pagingEnabled
                nestedScrollEnabled
                ListEmptyComponent={() => (
                    <View style={{ justifyContent: 'center', alignItems: 'center', height: 230 }}>
                        <CustomText fontSize={14} lineHeight={18} style={{ fontSize: 20, fontWeight: 'bold' }}>
                            Você ainda não possui medalhas
                        </CustomText>
                    </View>
                )}

            />
        </View>
    )
}

export default function ProfileCarousel({loggedUser}: {loggedUser: LoggedUser}) {

    const components = [
        <ProfileStatusBox user={loggedUser} key="profile-status" />,
        <MedalBox user={loggedUser} key="medal-box" />,
    ]

    return (
        <View style={{ height: 260, alignItems: 'center'}}>
            <FlatList
                data={components}
                keyExtractor={(__, index) => `page-${index}`}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                renderItem={(item) => (
                    <View style={{ width: Dimensions.get('window').width, alignItems: 'center', justifyContent: 'center' }}>
                        {item.item}
                    </View>
                )}
            />
        </View>
    );
}


const styles = StyleSheet.create({
    container: {
        padding: 15,
        width: '93%',
        height: 230,
        backgroundColor: 'rgba(105,105,105,0.1)',
        borderRadius: 30,
        justifyContent: 'space-around'
    },
    iconContainer: {

    },
    icon: {

    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    bar: {
        backgroundColor: colors.lightGrey,
        width: '90%',
        height: 4
    },
    barStatus: {
        backgroundColor: colors.black,
        height: 4
    },
});