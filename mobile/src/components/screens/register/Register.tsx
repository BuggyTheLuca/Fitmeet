import React, { useState } from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useCustomNavigation } from "../../../hooks/useCustomNavigation";
import { CustomInput } from "../../commons/CustomInput";
import { Dimensions } from 'react-native';
import { defaultStyles } from "../../../styles/defaultStyles";
import { CustomButton } from "../../commons/CustomButton";

const { width } = Dimensions.get('window');

export default function Register(){
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [cpf, setCPF] = useState('');
    const [password, setPassword] = useState('');

    
    const navigation = useCustomNavigation()

    const handleSubmit = () => {
        console.log('Nome:', name);
        console.log('Email:', email);
    };


    return (
        <>
            <SafeAreaView style={defaultStyles.screen}>
                <View style={styles.container}>
                    <View style={styles.header}>
                        <View style={{flexDirection: 'row', width: '100%', justifyContent: 'flex-start'}}>
                            <Text style={{fontWeight: "bold", fontSize: 40}} onPress={() => navigation.navigate('Login')}>
                                {'<'}
                            </Text>
                        </View>
                        <Text style={defaultStyles.title}>
                            Crie Sua Conta
                        </Text>
                        <Text>
                            Por favor preencha os dados para  prosseguir!
                        </Text>
                    </View>
                    <View style={styles.form}>
                        
                        <CustomInput label="Nome: " value={name} onChangeText={setName}/>
                        
                        <CustomInput label="Cpf: " value={cpf} onChangeText={setCPF}/>

                        <CustomInput label="Email: " value={email} onChangeText={setEmail}/>

                        <CustomInput label="Senha: " value={password} onChangeText={setPassword} secureTextEntry={true}/>

                        <CustomButton onClick={handleSubmit} text="Cadastrar" type="primary"/>
                        
                        <Text>
                            Já possui conta?{" "}
                            <Text style={{fontWeight: "bold"}} onPress={() => navigation.navigate('Login')}>
                                Login
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
        paddingTop: 20,
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