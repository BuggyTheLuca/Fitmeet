import { StyleSheet } from "react-native";
import { colors } from "./colors";


export const defaultStyles = StyleSheet.create({
    screen: {
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
        backgroundColor: colors.default
    },
})