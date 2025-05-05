import React, { useState, useEffect } from "react";
import ScrollableScreen from "../../components/ScrollableScreen/ScrollableScreen";
import Title from "../../components/Title/Title";
import PreviousViewNav from "../../components/PreviousViewNav/PreviousViewNav";
import { Dimensions, Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Input } from "../../components/Input/Input";
import { CustomButton } from "../../components/CustomButton/CustomButton";
import Map from "../../components/Map/Map";
import DatePicker from "../../components/DatePicker/DatePicker";
import { Asset, ImageLibraryOptions, launchImageLibrary } from "react-native-image-picker";
import { colors } from "../../assets/styles/colors";
import TypeList from "../../components/TypeList/TypeList";
import { ActivityType } from "../../types/activity";
import CustomText from "../../components/CustomText/CustomText";
import { useActivity } from "../../hooks/useActivity";
import { useCustomNavigation } from "../../hooks/useCustomNavigation";
import { showErrorToast, showSuccessToast } from "../../services/toastService/toastService";


const defaultImagePath = '../../assets/images/profile-edit.png';
const defaultImage = require(defaultImagePath);

export function CreateActivity() {

    const [title, setTitle] = useState('');
    const [titleError, setTitleError] = useState(false);

    const [description, setDescription] = useState('');
    const [descriptionError, setDescriptionError] = useState(false);

    const [scheduledDate, setScheduledDate] = useState('');
    const [scheduledDateError, setScheduledDateError] = useState(false);

    const [location, setLocation] = useState<{latitude: number, longitude: number} | undefined>();
    const [locationError, setLocationError] = useState(false);

    const [isPrivate, setIsPrivate] = useState(true);

    const [selectedType, setSelectedType] = useState<string>()
    const [selectedTypeError, setSelectedTypeError] = useState(false);

    const [image, setImage] = useState<Asset | string>();
    const [imageError, setImageError] = useState(false)

    const navigation = useCustomNavigation()


    const {setNewActivity} = useActivity()

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

    useEffect(() => {
        return () => {
            setImage(defaultImagePath);
            setImageError(false);
        }
    }, []);

    const handleLocationClick = (latitude: number, longitude: number) => {
        setLocation({latitude, longitude})
        setLocationError(false)
    } 

    const handleTypeClick = (type: ActivityType) => {
        setSelectedType(type.id);
        setSelectedTypeError(false)
    }

    function getFormData(): FormData{
        const formData = new FormData();
        formData.append('title', title);
        formData.append('description', description);
        formData.append('scheduledDate', scheduledDate);
        
        if (typeof image !== 'string') {
            formData.append('image', {
                uri: image!.uri,
                type: image!.type,
                name: image!.fileName || 'image.jpg'
            } as any);
        }
        
        formData.append('typeId', selectedType || '');
        formData.append('private', isPrivate.toString());
        
        if (location) {
            formData.append('address', JSON.stringify(location));
        }

        return formData
    }

    function isError(){
        let error = false
        if(title.length < 1){
            setTitleError(true);
            error = true
        }
        if(description.length < 1){
            setDescriptionError(true);
            error = true
        }
        if((new Date(scheduledDate)) < (new Date())){
            setScheduledDateError(true);
            error = true
        }
        if(image == defaultImagePath){
            setImageError(true);
            error = true
        }
        if(!location){
            setLocationError(true)
            error = true
        }
        if(!selectedType){
            setSelectedTypeError(true)
            error = true
        }

        return error
    }

    const handleSaveActivity = () => {
        try {
            if (isError()) return;

            const formData: FormData = getFormData()
            setNewActivity(formData).then(data => {
                if(data.status == 201){
                    navigation.goBack()
                    showSuccessToast('Atividade criada com sucesso!')
                }
                if(data.error){
                    showErrorToast('Erro!', data.error)
                }
            })

        } catch (error: any) {
            showErrorToast('Erro durante criação de atividade', error.error);
        }
    }

    return (
        <>
            <ScrollableScreen>
                <PreviousViewNav/>
                <Title style={{marginTop: 40}}>
                    cadastrar atividade
                </Title>
                <View style={styles.formContainer}>
                    <Input.Root isError={imageError}>
                        <View style={[styles.imageInput, imageError && { borderWidth: 1, borderColor: colors.danger, borderRadius: 10}]}>
                            <TouchableOpacity onPress={pickImage}>
                                <Image
                                    resizeMethod='resize'
                                    resizeMode='cover'
                                    source={(image && image !== defaultImagePath) ?  image : defaultImage}
                                    style={{
                                        width: Dimensions.get('window').width * 0.9,
                                        height: 200,
                                        borderRadius: 10,
                                    }}
                                />
                            </TouchableOpacity>
                        </View>
                        <Input.ErrorMessage style={{ marginTop: 6 }}>
                            Campo obrigatório
                        </Input.ErrorMessage>
                    </Input.Root>
                    
                    <Input.Root isError={titleError}>
                        <Input.Label required>Título</Input.Label>
                        <Input.Input
                            value={title}
                            onChangeText={(text) => {
                                setTitle(text);
                                setTitleError(false);
                            }}
                            autoCapitalize='none'
                        />
                        <Input.ErrorMessage style={{ marginTop: 6 }}>
                            Campo obrigatório
                        </Input.ErrorMessage>
                    </Input.Root>
                    
                    <Input.Root isError={descriptionError}>
                        <Input.Label required>Descrição</Input.Label>
                        <Input.Input
                            value={description}
                            onChangeText={(text) => {
                                setDescription(text);
                                setDescriptionError(false);
                            }}
                            autoCapitalize='none'
                        />
                        <Input.ErrorMessage style={{ marginTop: 6 }}>
                            Campo obrigatório
                        </Input.ErrorMessage>
                    </Input.Root>

                    <DatePicker
                            required
                            isError={scheduledDateError}
                            errorText="Data inválida"
                            label='Data do encontro'
                            onChange={(date) => {
                                setScheduledDate(date.toISOString())
                                setScheduledDateError(false)
                            }}
                        />

                    <Input.Root isError={locationError}>
                        <Input.Label required>Ponto de encontro</Input.Label>
                        <View style={[locationError && { borderWidth: 1, borderColor: colors.danger }, {marginTop: 10}]}>
                            <Map onLocationChange={handleLocationClick}/>
                        </View>
                        <Input.ErrorMessage style={{ marginTop: 6 }}>
                            Campo obrigatório
                        </Input.ErrorMessage>
                    </Input.Root>

                    <Input.Root>
                        <Input.Label>Visibilidade</Input.Label>
                        <View style={styles.privateInputView}>
                            <TouchableOpacity style={[styles.privateButton,
                                    isPrivate ? styles.privateSelected : styles.privateUnselected]}
                                    onPress={() => setIsPrivate(true)}>
                                <Text style={isPrivate ? styles.privateSelectedText : styles.privateUnselectedText}>
                                    Privado
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.privateButton,
                                    isPrivate ? styles.privateUnselected : styles.privateSelected]}
                                    onPress={() => setIsPrivate(false)}>
                                <Text style={isPrivate ? styles.privateUnselectedText : styles.privateSelectedText}>
                                    Público
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </Input.Root>
                    
                    <TypeList selectOne
                                title="categorias"
                                onClick={handleTypeClick}/>
                    {selectedTypeError &&
                        <View style={styles.activityTypesError}>
                            <CustomText style={{color: colors.danger}}>Tipo de atividade obrigatório</CustomText>
                        </View>
                    }

                    <CustomButton type="primary" text="Salvar" onClick={handleSaveActivity}/>
                </View>
            </ScrollableScreen>
        </>
    )
}

const styles = StyleSheet.create({
    formContainer: {
        marginVertical: 20,
        flexDirection: 'column',
        alignItems: 'center',
        width: Dimensions.get('window').width * 0.9
    },
    imageInput: {
        marginBottom: 10
    },
    activityTypesError: {
        width: '100%',
        flexDirection: 'column',
        alignItems: 'flex-start',
        marginBottom: 10
    },
    privateInputView: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        gap: 10,
        margin: 10
    },
    privateButton: {
        width: '28%',
        borderRadius: 8,
        height: 44,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    privateSelected: {
        backgroundColor: colors.black,
        
    },
    privateSelectedText: {
        color: colors.white
    },
    privateUnselected: {
        backgroundColor: colors.lightGrey
    },
    privateUnselectedText: {
        color: colors.grey
    }
})