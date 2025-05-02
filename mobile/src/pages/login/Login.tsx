import React, { useState } from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useCustomNavigation } from "../../hooks/useCustomNavigation";
import useAppContext from "../../hooks/useAppContext";

import { CustomButton } from "../../components/CustomButton/CustomButton";
import { Input } from "../../components/Input/Input";

import { Dimensions } from 'react-native';
import { defaultStyles } from "../../assets/styles/defaultStyles";
import Title from "../../components/Title/Title";
import CustomText from "../../components/CustomText/CustomText";
import { verifyEmail } from "../../utils/verify-email";
import { showErrorToast } from "../../services/toastService/toastService";
import KeyboardAvoidingContent from "../../components/KeyboardAvoidingContent/KeyboardAvoidingContent";

const { width } = Dimensions.get('window');

export default function Login(){
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const [emailError, setEmailError] = useState(false);
    const [passwordError, setPasswordError] = useState(false);

    
    const [emailErrorText, setEmailErrorText] = useState('');
    const [passwordErrorText, setPasswordErrorText] = useState('');

    const navigation = useCustomNavigation()


    const {auth: {login}} = useAppContext()

    async function handleSubmit() {
        try {
            let isError = false;

            if (!verifyEmail(email)) {
                setEmailError(true);
                setEmailErrorText('E-mail inválido!')
                isError = true;
            }
            if (password.length < 6) {
                setPasswordError(true);
                setPasswordErrorText('Senha inválida!')
                isError = true;
            }
            if (isError) return;

            login && await login(email, password)

        } catch (error: any) {
            if(error.status == 401){
                setPasswordError(true);
                setPasswordErrorText(error.error)
            }
            if(error.status == 404){
                setEmailError(true);
                setEmailErrorText(error.error)
            }
            showErrorToast('Erro durante login', error.error);
        }
    };


    return (
        <KeyboardAvoidingContent>
            <SafeAreaView style={defaultStyles.screen}>
                <View style={styles.container}>
                    <View style={styles.header}>
                        <Image source={require('../../assets/images/Logo.png')} style={{marginBottom: 20}}/>
                        <Title>
                            Faça Login e comece a treinar
                        </Title>
                        <CustomText>
                            Encontre parceiros para treinar ao ar livre. Conecte-se e comece agora! 💪
                        </CustomText>
                    </View>
                    <View style={styles.form}>
                    <Input.Root isError={emailError}>
                        <Input.Label required>E-mail</Input.Label>
                        <Input.Input
                            value={email}
                            onChangeText={(text) => {
                                setEmail(text);
                                setEmailError(false);
                            }}
                            autoCapitalize='none'
                            placeholder='Ex.: nome@email.com'
                        />
                        <Input.ErrorMessage style={{ marginTop: 6 }}>
                            {emailErrorText}
                        </Input.ErrorMessage>
                    </Input.Root>
                    <Input.Root isError={passwordError}>
                        <Input.Label required>Senha</Input.Label>
                        <Input.Input
                            value={password}
                            onChangeText={(text) => {
                                setPassword(text);
                                setPasswordError(false);
                            }}
                            placeholder='******'
                            autoCapitalize='none'
                            autoComplete='off'
                            secureTextEntry={true}
                        />
                        <Input.ErrorMessage style={{ marginTop: 6 }}>
                            {passwordErrorText}
                        </Input.ErrorMessage>
                    </Input.Root>

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
        </KeyboardAvoidingContent>
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
        alignItems: 'flex-start',
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