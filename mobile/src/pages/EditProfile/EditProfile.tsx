import React, { useEffect, useState } from "react";
import { Image, Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";
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
import { Asset, ImageLibraryOptions, launchImageLibrary } from "react-native-image-picker";
import useAppContext from "../../hooks/useAppContext";
import { fixUrl } from "../../utils/fix-url";
import { useUser } from "../../hooks/useUser";
import { Preference, UserResponse } from "../../types/user";
import { Camera, NotePencil } from "phosphor-react-native";
import TypeList from "../../components/TypeList/TypeList";
import { PreferenceModal } from "../PreferenceModal/PreferenceModal";

const { width } = Dimensions.get('window');

export default function EditProfile(){

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    
    const [emailError, setEmailError] = useState(false);
    const [passwordError, setPasswordError] = useState(false);
    const [nameError, setNameError] = useState(false);

    const [showPreferenceModal, setShowPreferenceModal] = useState(false);

    const [preferences, setPreferences] = useState<string[]>([]);

    const [image, setImage] = useState<Asset>();
    const [imageError, setImageError] = useState(false)

    const [user, setUser] = useState<UserResponse>()

    const {registerUser} = useAuth();
    
    const navigation = useCustomNavigation()

    const {getUser, getPreferences} = useUser()

    useEffect(() => {
        getUser().then(data => {
            console.log()
            if(data.status == 200){
                setUser(data.user)
                setEmail(data.user.email)
                setName(data.user.name)
            }
                
        })
    }, [getUser])

    useEffect(() => {
        getPreferences().then(data => {
             if(data)
                setPreferences(data.preferences.map(preference => preference.typeId))
        })
    },[getPreferences])


    async function pickImage() {
        try {
            const options: ImageLibraryOptions = {
                mediaType: 'photo',
                quality: 0.8,
                maxWidth: 1000,
                maxHeight: 1000
            }
            const response = await launchImageLibrary(options);
            
            if(response.didCancel) {
                return;
            }
            
            if(response.errorCode) {
                showErrorToast('Erro ao selecionar imagem', response.errorMessage || 'Erro desconhecido');
                return;
            }

            if(response.assets && response.assets[0]){
                setImage(response.assets[0]);
                setImageError(false);
            }
        } catch (error) {
            console.error('Erro ao selecionar imagem:', error);
            showErrorToast('Erro ao selecionar imagem', 'Tente novamente');
        }
    }

    async function handleSubmit() {

        try {
            let isError = false;

            const data = {
                name, email, password
            }

            if (!verifyEmail(email)) {
                setEmailError(true);
                isError = true;
            }
            if (password.length < 6) {
                setPasswordError(true);
                isError = true;
            }
            if(name.length < 1){
                setNameError(true);
                isError = true
            }
            if (isError) return;
            
            registerUser(data).then(data => {
                if(data.status == 201 && data.message){
                    showSuccessToast(data.message)
                    navigation.navigate('Login')
                }else if (data.error){
                    showErrorToast('Houve um Erro', data.error)
                }
            })

        } catch (error: any) {
            showErrorToast('Houve um Erro', error.message);
        }

    };

    const handleDeleteAccount = () => {

    }

    return (
        <KeyboardAvoidingContent>
            <PreviousViewNav/>
            <SafeAreaView style={defaultStyles.screen}>
                <Modal  animationType="fade"
                        visible={showPreferenceModal}
                        statusBarTranslucent={true}
                        onRequestClose={() => setShowPreferenceModal(false)}>
                    <PreferenceModal preferences={preferences} onClose={() => setShowPreferenceModal(false)} closeType="backArrow"/>
                </Modal>
            
                <View style={styles.container}>
                    <View style={styles.header}>
                        <Title>Atualizar perfil</Title>
                        {user && <TouchableOpacity style={{position: 'relative'}} onPress={pickImage}>
                                <Image  resizeMethod='resize'
                                        resizeMode='cover'
                                        source={image || {uri: fixUrl(user.avatar)}}
                                        style={{
                                            width: 150,
                                            height: 150,
                                            borderRadius: 75,
                                        }}
                                    />
                                <Camera size={30} style={{position: 'absolute', left: 60, top: 60}}/>
                            </TouchableOpacity>}
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
                            
                        <Input.Root>
                            <Input.Label required>CPF</Input.Label>
                            <Input.Input
                                value={user?.cpf}
                                editable={false}
                                autoCapitalize='none'
                                placeholder='Ex.: 111.111.111-11'
                            />
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

                        <View style={{position: 'relative'}}>
                            <TouchableOpacity style={{position: "absolute", right: 30, top: 5}} onPress={() => setShowPreferenceModal(true)}>
                                <NotePencil/>
                            </TouchableOpacity>
                            <TypeList selectedIds={preferences} title="Preferencias"/>
                        </View>

                        <CustomButton onClick={handleSubmit} text="Salvar" type="primary"/>
                        
                        <CustomButton onClick={handleDeleteAccount} text="Desativar conta"/>
                        
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