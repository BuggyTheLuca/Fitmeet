import React, { useState } from "react";
import { Button, StyleSheet, Text, TextInput, View } from "react-native";
import AuthBackground from "../../commons/authBackground/AuthBackground";
import { SafeAreaView } from "react-native-safe-area-context";
import { useCustomNavigation } from "../../../hooks/useCustomNavigation";

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
            <AuthBackground>
                <SafeAreaView style={styles.container}>
                    <View style={styles.form}>
                    <Text>Nome:</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Digite seu nome"
                        value={name}
                        onChangeText={setName}
                    />

                    <Text>CPF:</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Digite seu CPF"
                        value={cpf}
                        onChangeText={setCPF}
                    />

                    <Text>Email:</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Digite seu email"
                        keyboardType="email-address"
                        value={email}
                        onChangeText={setEmail}
                    />

                    <Text>Senha:</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Digite seu nome"
                        value={password}
                        keyboardType='visible-password'
                        onChangeText={setPassword}
                    />

                    <Button title="Cadastrar" onPress={handleSubmit} />

                    <Button title="Já possui uma conta" onPress={() => navigation.navigate('Login')} />
                    </View>
                </SafeAreaView>
            </AuthBackground>
        </>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center'
    },
    form: {
        backgroundColor: 'white',
        minHeight: '70%',
        minWidth: '70%',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-around'
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 6,
        padding: 8,
        marginBottom: 12,
      },
})