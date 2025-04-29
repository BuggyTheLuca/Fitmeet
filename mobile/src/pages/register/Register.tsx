import React, { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useCustomNavigation } from "../../hooks/useCustomNavigation";
import { CustomInput } from "../../components/commons/CustomInput";
import { Dimensions } from 'react-native';
import { defaultStyles } from "../../styles/defaultStyles";
import { CustomButton } from "../../components/commons/CustomButton";
import PreviousViewNav from "../../components/commons/PreviousViewNav";
import useAuth from "../../hooks/useAuth";

const { width } = Dimensions.get('window');

export default function Register(){
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [cpf, setCPF] = useState('');
    const [password, setPassword] = useState('');

    const {registerUser} = useAuth();
    
    const navigation = useCustomNavigation()

    const handleSubmit = () => {
        const data = {
            name, cpf, email, password
        }

        registerUser(data).then(
            (data) => {
                console.log(data)
            }
        )

    };


    return (
        <>
            <SafeAreaView style={defaultStyles.screen}>
                <View style={styles.container}>
                    <View style={styles.header}>
                        <View style={{flexDirection: 'row', width: '100%', justifyContent: 'flex-start'}}>
                            <PreviousViewNav/>
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