import { RouteProp, useRoute } from "@react-navigation/native";
import { MainStackParamList } from "../../routes/AppRoutes";
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
import { fixUrl } from "../../utils/fix-url";


type EditActivityRouteProp = RouteProp<MainStackParamList, 'EditActivity'>;

export function EditActivity(){

    const route = useRoute<EditActivityRouteProp>();
    const { activity } = route.params;

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

    const [image, setImage] = useState<Asset>();
    const [imageError, setImageError] = useState(false)

    const navigation = useCustomNavigation()


    const {updateActivity, deleteActivity} = useActivity()

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
        setDescription(activity.description)
        setTitle(activity.title)
        setScheduledDate(new Date(activity.scheduledDate).toISOString())
        setLocation(activity.address)
        setIsPrivate(activity.private)
    }, [activity])

    const handleLocationClick = (latitude: number, longitude: number) => {
        setLocation({latitude, longitude})
        setLocationError(false)
    } 

    const handleTypeClick = (type: ActivityType) => {
        setSelectedType(type.id);
        setSelectedTypeError(false)
    }

    const getTypeIdByName = (typeId: string) => {
        console.log(typeId)
        setSelectedType(typeId)
    }

    function getFormData(): FormData{
        const formData = new FormData();
        formData.append('title', title);
        formData.append('description', description);
        formData.append('scheduledDate', scheduledDate);
        
        if (image) {
            formData.append('image', {
                uri: image.uri,
                type: image.type,
                name: image.fileName || 'image.jpg'
            } as any);
        }
        
        if(selectedType){
            formData.append('typeId', selectedType);
        }

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
        if(!location){
            setLocationError(true)
            error = true
        }

        return error
    }

    const handleCancelActivity = () => {
        try {
            deleteActivity(activity.id).then(data => {
                console.log(data)
                if(data.status == 200){
                    navigation.goBack()
                    showSuccessToast(data.response.message)
                }
            })

        } catch (error: any) {
            showErrorToast('Erro durante criação de atividade', error.error);
        }
    }

    const handleSaveActivity = () => {
        try {
            if (isError()) return;

            const formData: FormData = getFormData()
            updateActivity(formData, activity.id).then(data => {
                if(data.status == 200){
                    navigation.goBack()
                    showSuccessToast('Atividade atualizada com sucesso!')
                }
            })

        } catch (error: any) {
            showErrorToast('Erro durante atualização de atividade', error.error);
        }
    }

    return (
        <>
            <ScrollableScreen>
                <PreviousViewNav/>
                <Title style={{marginTop: 40}}>
                    editar atividade
                </Title>
                <View style={styles.formContainer}>
                    <Input.Root isError={imageError}>
                        <View style={[styles.imageInput, imageError && { borderWidth: 1, borderColor: colors.danger, borderRadius: 10}]}>
                            <TouchableOpacity onPress={pickImage}>
                                <Image
                                    resizeMethod='resize'
                                    resizeMode='cover'
                                    source={image || {uri: fixUrl(activity.image)}}
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
                        <Input.Label>Título</Input.Label>
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
                        <Input.Label>Descrição</Input.Label>
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
                           
                            isError={scheduledDateError}
                            errorText="Data inválida"
                            label='Data do encontro'
                            dateString={activity.scheduledDate}
                            onChange={(date) => {
                                setScheduledDate(date.toISOString())
                                setScheduledDateError(false)
                            }}
                        />

                    <Input.Root isError={locationError}>
                        <Input.Label>Ponto de encontro</Input.Label>
                        <View style={[locationError && { borderWidth: 1, borderColor: colors.danger }, {marginTop: 10}]}>
                            <Map location={activity.address} onLocationChange={handleLocationClick}/>
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
                                selectedName={activity.type}
                                title="categorias"
                                onClick={handleTypeClick}
                                getIdByName={getTypeIdByName}/>
                    {selectedTypeError &&
                        <View style={styles.activityTypesError}>
                            <CustomText style={{color: colors.danger}}>Tipo de atividade obrigatório</CustomText>
                        </View>
                    }

                    <CustomButton type="primary" text="Salvar" onClick={handleSaveActivity}/>
                    <CustomButton text="Cancelar atividade" onClick={handleCancelActivity}/>
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