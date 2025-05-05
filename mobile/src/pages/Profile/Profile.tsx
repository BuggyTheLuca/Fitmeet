import React, { useEffect, useState } from "react";
import { Dimensions, Image, SafeAreaView, ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import { colors } from "../../assets/styles/colors";
import useAppContext from "../../hooks/useAppContext";
import PreviousViewNav from "../../components/PreviousViewNav/PreviousViewNav";
import Title from "../../components/Title/Title";
import { NotePencil, SignOut } from "phosphor-react-native";
import { fixUrl } from "../../utils/fix-url";
import { ActivityResponse } from "../../types/activity";
import ActivityList from "../../components/ActivityList/ActivityList";
import ScrollableScreen from "../../components/ScrollableScreen/ScrollableScreen";
import { useCustomNavigation } from "../../hooks/useCustomNavigation";
import ProfileCarousel from "../../components/ProfileCarousel/ProfileCarousel";

export default function Profile(){

    const {auth: {loggedUser, logout}} = useAppContext()

    const navigation = useCustomNavigation()

    const handleActivityClick = (activity: ActivityResponse) =>{
        navigation.navigate('ActivityDetails', {activity})
    }

    return <>
        <PreviousViewNav/>
        <ScrollableScreen>
            <View style={styles.header}>
                <View style={styles.menuRow}>
                    <View style={styles.menu}>
                        <Title>Perfil</Title>
                        <View style={styles.menuItems}>
                            <TouchableOpacity onPress={() => navigation.navigate('EditProfile')}>
                                <NotePencil/>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={logout}>
                                <SignOut/>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
                <View style={styles.rowCentered}>
                    <Image source={{uri: fixUrl(loggedUser!.avatar)}} style={{height: 104, width: 104, borderRadius: 52}}/>
                </View>
                <View style={styles.rowCentered}>
                    <Title>{loggedUser!.name}</Title>
                </View>
            </View>
            <ProfileCarousel loggedUser={loggedUser!}></ProfileCarousel>
            <View style={styles.section}>
                <ActivityList onClick={handleActivityClick} title="Suas atividades" responseType='created' type="collapse"/>
            </View>
            <View style={styles.section}>
                <ActivityList onClick={handleActivityClick} title="Histórico de atividades" responseType='participating'/>
            </View>
        </ScrollableScreen>
    </>
}


const styles = StyleSheet.create({
    header: {
        flexDirection: 'column',
        paddingTop: 35,
        width: Dimensions.get('screen').width,
        height: 250,
        borderBottomStartRadius: 32,
        borderBottomEndRadius: 32,
        gap: 12,
        backgroundColor: colors.primary
    },
    menu: {
        flexDirection: 'row',
        width: Dimensions.get('screen').width * 0.55,
        justifyContent: 'space-between',
        alignContent: 'center',
        marginEnd: 15
    },
    menuItems: {
        flexDirection: 'row',
        alignContent: 'center',
        gap: 10,
        width: 40,
        marginEnd: 15
    },
    menuRow: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        width: Dimensions.get('window').width
    },
    rowCentered: {
        flexDirection: 'row',
        justifyContent: 'center',
        width: Dimensions.get('window').width
    },
    carousel: {
        height: 225,
        width: Dimensions.get('window').width * 0.95,
        backgroundColor: colors.lightGrey,
        borderRadius: 10
    },
    section: {
        marginTop: 8
    },
})