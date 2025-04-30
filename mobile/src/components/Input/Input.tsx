import React, { ReactNode, useState } from "react";
import { StyleSheet, Text, TextInputProps, View, ViewProps, TextInput, StyleProp, ViewStyle } from "react-native";
import { colors } from "../../assets/styles/colors";
import { fonts } from "../../assets/styles/fonts";


interface InputRootProps extends ViewProps {
    children: React.ReactElement<InputLabelProps | InputProps | InputErrorMessageProps> |
    React.ReactElement<InputLabelProps | InputProps | InputErrorMessageProps>[];
    isError?: boolean;
}

function InputRoot({ children, isError, style, ...props }: InputRootProps) {

    return (
        <View
            {...props}
            style={[styles.root, style]}
        >
            {
                React.Children.map(children, (child) => {
                    if (React.isValidElement(child)) {
                        return React.cloneElement(child, { isError })
                    }
                    return child;
                })
            }
        </View>
    )
}

interface InputLabelProps {
    children: ReactNode;
    required?: boolean;
    style?: any;
    isError?: boolean;
}

function InputLabel({ children, style, required = false, isError }: InputLabelProps) {
    return (
        <Text
            style={[
                styles.label,
                isError && { color: colors.danger },
                style
            ]}
        >
            {children} {required && <Text style={[styles.label, styles.required]}>*</Text>}
        </Text>
    )
}

interface InputProps extends TextInputProps {
    isError?: boolean;
}

function CustomInput({ style, isError, ...props }: InputProps) {

    const [isFocused, setIsFocused] = useState(false);

    return (
        <TextInput
            {...props}
            placeholderTextColor={isError ? colors.danger : "#A1A1A1"}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            style={[
                styles.input,
                isFocused && { borderColor: '#D4D4D4' },
                isError && { borderColor: colors.danger },
                style
            ]}
        />
    )
}

interface InputErrorMessageProps {
    children: ReactNode;
    style?: StyleProp<ViewStyle>;
    isError?: boolean;
}

function InputErrorMessage({ children, style, isError }: InputErrorMessageProps) {
    return (
        <View
            style={style}
        >
            {
                isError && (
                    <Text style={[styles.label, styles.error]}>
                        {children}
                    </Text>
                )
            }
        </View>
    )
}


export const Input = {
    Root: InputRoot,
    Label: InputLabel,
    Input: CustomInput,
    ErrorMessage: InputErrorMessage
}

const styles = StyleSheet.create({
    root: {
        width: '100%',
        marginBottom: 16
    },
    label: {
        fontFamily: fonts.DMSans.semiBold,
        fontSize: 16,
        color: colors.grey,
        lineHeight: 20
    },
    required: {
        color: colors.danger
    },
    input: {
        marginTop: 6,
        width: '100%',
        height: 56,
        justifyContent: 'center',
        fontFamily: fonts.DMSans.regular,
        fontSize: 16,
        lineHeight: 24,
        borderWidth: 1,
        borderColor: colors.lightGrey,
        borderRadius: 8,
        color: colors.grey,
        paddingLeft: 20
    },
    error: {
        color: colors.danger,
    }
})