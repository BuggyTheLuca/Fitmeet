import React, { useState } from "react";
import { Button, Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useCustomNavigation } from "../../../hooks/useCustomNavigation";
import useAppContext from "../../../hooks/useAppContext";

import { CustomButton } from "../../commons/CustomButton";
import { CustomInput } from "../../commons/CustomInput";

import { Dimensions } from 'react-native';
import { defaultStyles } from "../../../styles/defaultStyles";

const { width } = Dimensions.get('window');

export default function Login(){
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigation = useCustomNavigation()

    const {auth: {login, isAuthenticated}} = useAppContext()

    const handleSubmit = () => {
        console.log('Nome:', email);
        console.log('password:', password);
        login(email, password)
    };


    return (
        <>
            <SafeAreaView style={defaultStyles.screen}>
                <View style={styles.container}>
                    <View style={styles.header}>
                        <Image source={require('../../../assets/images/Logo.png')} style={{marginBottom: 20}}/>
                        <Text style={defaultStyles.title}>
                            Faça Login e comece a treinar
                        </Text>
                        <Text>
                            Encontre parceiros para treinar ao ar livre. Conecte-se e comece agora! 💪
                        </Text>
                    </View>
                    <View style={styles.form}>
                        <CustomInput label="Email: " value={email} onChangeText={setEmail}/>

                        <CustomInput label="Senha: " value={password} onChangeText={setPassword} secureTextEntry={true}/>

                        <CustomButton onClick={handleSubmit} text="Entrar" type="primary"/>
                        
                        <Text>
                            Ainda não possui conta?{" "}
                            <Text style={{fontWeight: "bold"}} onPress={() => navigation.navigate('Register')}>
                                Cadastre-se
                            </Text>
                        </Text>
                    </View>
                </View>
            </SafeAreaView>
        </>
    )
}

const styles = StyleSheet.create({
    container: {
        paddingTop: 40,
        width: width * 0.9
    },
    header: {
        width: '100%',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 12,
        marginBottom: 20
    },
    form: {
        width: '100%',  
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-around',
        gap: 12
    }
})