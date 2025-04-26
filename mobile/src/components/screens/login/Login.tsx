import React, { useState } from "react";
import { Button, StyleSheet, Text, TextInput, View } from "react-native";
import AuthBackground from "../../commons/authBackground/AuthBackground";
import { SafeAreaView } from "react-native-safe-area-context";
import { useCustomNavigation } from "../../../hooks/useCustomNavigation";

export default function Login(){
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const navigation = useCustomNavigation()

    const handleSubmit = () => {
        console.log('Nome:', name);
        console.log('password:', password);
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

                    <Text>Senha:</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Digite seu email"
                        keyboardType="visible-password"
                        value={password}
                        onChangeText={setPassword}
                    />

                    <Button title="Login" onPress={handleSubmit} />
                    
                    <Button title="Cadastre-se" onPress={() => navigation.navigate('Register')} />
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