import React, { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useCustomNavigation } from "../../hooks/useCustomNavigation";
import { Input } from "../../components/Input/Input";
import { Dimensions } from 'react-native';
import { defaultStyles } from "../../assets/styles/defaultStyles";
import { CustomButton } from "../../components/CustomButton/CustomButton";
import PreviousViewNav from "../../components/PreviousViewNav/PreviousViewNav";
import useAuth from "../../hooks/useAuth";
import Title from "../../components/Title/Title";
import KeyboardAvoidingContent from "../../components/KeyboardAvoidingContent/KeyboardAvoidingContent";
import CustomText from "../../components/CustomText/CustomText";
import { formatCpfMask } from "../../utils/format-cpf-mask";
import { verifyEmail } from "../../utils/verify-email";
import { showErrorToast, showSuccessToast } from "../../services/toastService/toastService";
import { validateCPF } from "../../utils/cpf-validator";

const { width } = Dimensions.get('window');

export default function Register(){
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [cpf, setCPF] = useState('');
    const [password, setPassword] = useState('');

    
    const [emailError, setEmailError] = useState(false);
    const [passwordError, setPasswordError] = useState(false);
    const [cpfError, setCpfError] = useState(false);
    const [nameError, setNameError] = useState(false);

    const {registerUser} = useAuth();
    
    const navigation = useCustomNavigation()

    async function handleSubmit() {

        try {
            let isError = false;

            const data = {
                name, cpf, email, password
            }

            if (!verifyEmail(email)) {
                setEmailError(true);
                isError = true;
            }
            if (password.length < 6) {
                setPasswordError(true);
                isError = true;
            }
            if(!validateCPF(cpf)){
                setCpfError(true);
                isError = true
            }
            if(name.length < 1){
                setNameError(true);
                isError = true
            }
            if (isError) return;
            
            registerUser(data).then(data => {
                if(data.status == 201 && data.message){
                    showSuccessToast('Sucesso', data.message)
                    navigation.navigate('Login')
                }else if (data.error){
                    showErrorToast('Houve um Erro', data.error)
                }
            })

        } catch (error: any) {
            showErrorToast('Houve um Erro', error.message);
        }

    };


    return (
        <KeyboardAvoidingContent>
            <PreviousViewNav/>
            <SafeAreaView style={defaultStyles.screen}>
            
                <View style={styles.container}>
                    <View style={styles.header}>
                        <Title>
                            Crie Sua Conta
                        </Title>
                        <CustomText>
                            Por favor preencha os dados para  prosseguir!
                        </CustomText>
                    </View>
                    <View style={styles.form}>
                        
                        <Input.Root isError={nameError}>
                            <Input.Label required>Nome</Input.Label>
                            <Input.Input
                                value={name}
                                onChangeText={(text) => {
                                    setName(text);
                                    setNameError(false);
                                }}
                                autoCapitalize='none'
                                placeholder='Ex.: Jorge Pessoa'
                            />
                            <Input.ErrorMessage style={{ marginTop: 6 }}>
                                Nome obrigatório!
                            </Input.ErrorMessage>
                        </Input.Root>
                            
                        <Input.Root isError={cpfError}>
                            <Input.Label required>CPF</Input.Label>
                            <Input.Input
                                value={cpf}
                                onChangeText={(text) => {
                                    setCPF(formatCpfMask(text));
                                    setCpfError(false);
                                }}
                                autoCapitalize='none'
                                placeholder='Ex.: 111.111.111-11'
                            />
                            <Input.ErrorMessage style={{ marginTop: 6 }}>
                                CPF inválido!
                            </Input.ErrorMessage>
                        </Input.Root>

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
                                E-mail inválido!
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
                                autoCapitalize='none'
                                placeholder='Ex.: senhasenha'
                                secureTextEntry={true}
                            />
                            <Input.ErrorMessage style={{ marginTop: 6 }}>
                                Mínimo 6 caractéres!
                            </Input.ErrorMessage>
                        </Input.Root>

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
        </KeyboardAvoidingContent>
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