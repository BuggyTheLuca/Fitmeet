import React from "react";
import { Dimensions, Image, SafeAreaView, StyleSheet, TouchableOpacity, View } from "react-native";
import { colors } from "../../assets/styles/colors";
import useAppContext from "../../hooks/useAppContext";
import PreviousViewNav from "../../components/PreviousViewNav/PreviousViewNav";
import Title from "../../components/Title/Title";
import { NotePencil, SignOut } from "phosphor-react-native";
import { fixUrl } from "../../utils/fix-url";

export default function Profile(){

    const {auth: {loggedUser, logout}} = useAppContext()



    return <>
        <PreviousViewNav/>
        <SafeAreaView style={[styles.container]}>
            <View style={styles.header}>
                <View style={styles.profile}>
                    <Title>Perfil</Title>
                    <View style={styles.profileMenu}>
                        <TouchableOpacity>
                            <NotePencil/>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={logout}>
                            <SignOut/>
                        </TouchableOpacity>
                    </View>
                </View>
                <View>
                    <Image source={{uri: fixUrl(loggedUser!.avatar)}}/>
                </View>
            </View>
        </SafeAreaView>
    </>
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        alignItems: 'flex-start',
        backgroundColor: colors.white
    },
    header: {
        flexDirection: 'column',
        justifyContent: 'center',
        alignContent: 'center',
        paddingTop: 35,
        height: 276,
        width: Dimensions.get('screen').width,
        borderBottomStartRadius: 32,
        borderBottomEndRadius: 32,
        backgroundColor: colors.primary
    },
    profile: {
        flexDirection: 'row',
        width: Dimensions.get('screen').width * 0.50,
        justifyContent: 'space-between',
        alignContent: 'center',
        marginEnd: 15
    },
    profileMenu: {
        flexDirection: 'row',
        alignContent: 'center',
        gap: 10,
        width: 40,
        marginEnd: 15
    }
})