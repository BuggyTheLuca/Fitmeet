import React from "react";
import { ButtonProps, StyleSheet, Text, TouchableOpacity } from "react-native";
import { colors } from "../../assets/styles/colors";

interface props{
    onClick?: () => void;
    text?: string,
    type?: 'default' | 'danger' | 'primary'
}

export function CustomButton({onClick, type = 'default', text}: props){

    const styles = StyleSheet.create({
        button: {
            width: '80%',
            borderRadius: 8,
            height: 44,
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: type == 'default' ? colors.white : colors[type]
        },
        text: {
            color: type == 'default' ? colors.darkGrey : colors.white,
            fontSize: 16,
            fontWeight: 700
        }
    })

    return (
        <TouchableOpacity style={styles.button} onPress={onClick}>
            <Text style={styles.text}>{text}</Text>
        </TouchableOpacity>
    )
}