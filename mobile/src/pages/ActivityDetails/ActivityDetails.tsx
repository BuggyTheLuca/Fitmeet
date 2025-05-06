import React, { useEffect, useState } from "react";
import { MainStackParamList } from "../../routes/AppRoutes";
import { RouteProp, useRoute } from "@react-navigation/native";
import ScrollableScreen from "../../components/ScrollableScreen/ScrollableScreen";
import PreviousViewNav from "../../components/PreviousViewNav/PreviousViewNav";
import { Dimensions, FlatList, Image, ImageBackground, StyleSheet, TouchableOpacity, View } from "react-native";
import { fixUrl } from "../../utils/fix-url";
import CustomText from "../../components/CustomText/CustomText";
import { formatDate } from "../../utils/format-date";
import { Circle, Heart, NotePencil, X } from "phosphor-react-native";
import useAppContext from "../../hooks/useAppContext";
import { useActivity } from "../../hooks/useActivity";
import { Participant } from "../../types/user";
import { showErrorToast, showSuccessToast } from "../../services/toastService/toastService";
import { colors } from "../../assets/styles/colors";
import Title from "../../components/Title/Title";
import Map from "../../components/Map/Map";
import { CustomButton } from "../../components/CustomButton/CustomButton";
import { Input } from "../../components/Input/Input";
import { useCustomNavigation } from "../../hooks/useCustomNavigation";
import { useRefreshContext } from "../../contexts/refreshContext";
import KeyboardAvoidingContent from "../../components/KeyboardAvoidingContent/KeyboardAvoidingContent";


type ActivityDetailsRouteProp = RouteProp<MainStackParamList, 'ActivityDetails'>;

export function ActivityDetails(){

    const {shouldRefresh, triggerRefresh} = useRefreshContext()
    const {auth: {loggedUser}} = useAppContext()
    const route = useRoute<ActivityDetailsRouteProp>();
    const { activity } = route.params;

    const navigation = useCustomNavigation()

    const [participants, setParticipants] = useState<Participant[]>()
    const [isParticipant, setIsParticipant] = useState(false)
    const [isCreator, setIsCreator] = useState(false)
    const [isActivityDay, setIsActivityDay] = useState(false)
    const [isActivityOccurring, setIsActivityOccurring] = useState(false)
    const [userAsParticipant, setUserAsParticipant] = useState<Participant>()

    const [confirmationCode, setConfirmationCode] = useState<string>()
    const [confirmationCodeError, setConfirmationCodeError] = useState(false);

    const {getActivityParticipants, approve, subscribe, unsubscribe, checkIn, conclude} = useActivity()


    useEffect(() => {
        const currentDate = new Date();
        const scheduledDate = new Date(activity.scheduledDate);

        const isSameDay =
            currentDate.getFullYear() === scheduledDate.getFullYear() &&
            currentDate.getMonth() === scheduledDate.getMonth() &&
            currentDate.getDate() === scheduledDate.getDate();

        const isCurrentTimeAfterScheduled =
            isSameDay && currentDate.getTime() > scheduledDate.getTime() && !activity.completedAt;

        if (isSameDay) {
            setIsActivityDay(true)
        }

        if(isCurrentTimeAfterScheduled){
            setIsActivityOccurring(true)
        }


    }, [activity, shouldRefresh])


    useEffect(() => {
        getActivityParticipants(activity.id).then(data => {
            if(data.status == 200){
                setParticipants(data.participants)
                setIsCreator(getIsCreator())
                setIsParticipant(getIsParticipant(data.participants))
                setUserAsParticipant(getUserAsParticipant(data.participants))
            }else{
                showErrorToast("Erro!", 'Erro ao buscar participantes.')
            }
        })
    }, [getActivityParticipants, shouldRefresh])

    function getIsCreator(){
        if(!loggedUser) return false;

        return loggedUser.id == activity.creator.id
    }

    function getIsParticipant(participants: Participant[]){
        if(!loggedUser || !participants) return false;

        return participants.some(participant => participant.userId == loggedUser.id)
    }

    function canEditParticipant(){
        return isCreator && !isActivityDay && !isActivityOccurring && !activity.completedAt
    }

    function canParticipate(){
        return !isParticipant && !isCreator && !isActivityDay && !isActivityOccurring && !activity.completedAt
    }

    function getUserAsParticipant(participants: Participant[]) {
        if(!participants) return;
        if(!loggedUser) return;

        const userAsParticipant = participants.find(participant => participant.userId == loggedUser!.id)

        return userAsParticipant
    }

    const handleSubscribeClick = () => {
        subscribe(activity.id).then(data => {
            if(data.status == 201){
                triggerRefresh()
                showSuccessToast(data.message)
            }
        })
    }

    const handleUnsubscribeClick = () => {
        unsubscribe(activity.id).then(data => {
            if(data.status == 200){
                triggerRefresh()
                showSuccessToast(data.response.message)
            }
        })
    }

    const handleCheckInClick = () => {
        if(!confirmationCode || confirmationCode.length < 1){
            setConfirmationCodeError(true)
            return;
        }
        checkIn(activity.id, confirmationCode).then(data => {
            if(data.status == 200){
                triggerRefresh()
                showSuccessToast(data.response.message)
            }else{
                showErrorToast('Erro ao fazer check-in', data.error)
                setConfirmationCodeError(true)
            }
        })
    }

    const handleConcludeActivityClick = () => {
        conclude(activity.id).then(data => {
            if(data.status == 200){
                triggerRefresh()
                showSuccessToast(data.response.message)
                navigation.goBack()
            }else{
                showErrorToast('Erro ao fazer check-in', data.error)
                setConfirmationCodeError(true)
            }
        })
    }

    const handleApproveClick = (request: {approved: boolean, participantId: string}) => {
        approve(activity.id, request).then(data => {
            if(data.status == 200){
                triggerRefresh()
                showSuccessToast(data.message)
            }
        })
    }


    return(
            <ScrollableScreen>
                <PreviousViewNav/>
                <ImageBackground style={styles.activityImage} source={{uri: fixUrl(activity.image)}}
                                    resizeMethod='resize'
                                    resizeMode='cover'>
                    {isCreator &&
                        <TouchableOpacity style={styles.editButton} onPress={() => navigation.navigate('EditActivity', {activity})}>
                            <NotePencil/>
                        </TouchableOpacity>
                    }
                    <View style={{flexDirection: 'row', width: '100%', justifyContent: 'center'}}>
                        <View style={styles.activityDescription}>
                            <Image source={require('../../assets/images/calendar.png')} style={{
                                    width: 20,
                                    height: 20,
                                }}/>
                            <CustomText fontSize={12}>{formatDate(activity.scheduledDate)}</CustomText>
                            <CustomText fontSize={12}>|</CustomText>
                            {activity.private && <CustomText fontSize={12}>Privado</CustomText>}
                            {activity.private && <CustomText fontSize={12}>|</CustomText>}
                            <Image source={require('../../assets/images/persons.png')} style={{
                                    width: 20,
                                    height: 20,
                                }}/>
                            <CustomText fontSize={12}>{activity.participantCount}</CustomText>

                        </View>
                    </View>
                </ImageBackground>
                <View style={styles.activityData}>
                    {(isCreator && (isActivityDay || isActivityOccurring)) &&
                        <View style={{backgroundColor: colors.lightGrey, borderRadius: 10, gap: 10, padding: 10, marginVertical: 15}}>
                            <CustomText>Código de confirmação</CustomText>
                            <View style={{alignItems: 'center'}}>
                                <CustomText style={{color: colors.grey}}>{activity.confirmationCode}</CustomText>
                            </View>
                        </View>
                    }
                    {(isParticipant && (isActivityDay || isActivityOccurring) && !userAsParticipant?.confirmedAt) &&
                        <View style={{borderRadius: 10, padding: 10, marginVertical: 15}}>
                            <Input.Root isError={confirmationCodeError}>
                                <Input.Label required>Código de confirmação</Input.Label>
                                <Input.Input
                                    value={confirmationCode}
                                    onChangeText={(text) => {
                                        setConfirmationCode(text);
                                        setConfirmationCodeError(false);
                                    }}
                                    autoCapitalize='none'
                                />
                                <Input.ErrorMessage style={{ marginTop: 6 }}>
                                    {!confirmationCode || confirmationCode.length < 1 ? 'Campo obrigatório' : 'Código inválido'}
                                </Input.ErrorMessage>
                            </Input.Root>
                            <View style={{flexDirection: 'row', justifyContent: "center"}}>
                                <CustomButton type="primary" text="Confirmar presença" onClick={handleCheckInClick}/>
                            </View>
                        </View>
                    }
                    <View>
                        <Title fontSize={20}>{activity.title}</Title>
                        <CustomText>{activity.description}</CustomText>
                    </View>
                    <View>
                        <Title fontSize={20}>Ponto de encontro</Title>
                        <Map location={activity.address}/>
                    </View>
                    <View>
                        <Title fontSize={20}>Participantes</Title>
                        {!isCreator &&
                            <View style={styles.participant}>
                                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                    <Image source={{uri: fixUrl(activity.creator.avatar)}} style={{width: 44, height: 44, borderRadius: 22}}/>
                                    <View>
                                        <CustomText>{activity.creator.name}</CustomText>
                                        <CustomText fontSize={12} lineHeight={14} style={{color: colors.grey}}>Organizador</CustomText>
                                    </View>
                                </View>
                            </View>
                        }
                        <FlatList
                            data={participants}
                            extraData={participants}
                            scrollEnabled={false}
                            renderItem={({ item }) => (
                                <View style={styles.participant}>
                                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                        <Image source={{uri: fixUrl(item.avatar!)}} style={{width: 44, height: 44, borderRadius: 22}}/>
                                        <CustomText>{item.name}</CustomText>
                                    </View>
                                    {canEditParticipant() && 
                                        <View style={{flexDirection: 'row', gap: 60}}>
                                            <TouchableOpacity style={styles.participantButton} onPress={() => handleApproveClick({
                                                approved: false,
                                                participantId: item.id
                                            })}>
                                                <X color={colors.white} size={15}/>
                                            </TouchableOpacity>
                                            <TouchableOpacity style={styles.participantButton} onPress={() => handleApproveClick({
                                                approved: true,
                                                participantId: item.id
                                            })}>
                                                <Heart color={colors.white} size={15}/>
                                            </TouchableOpacity>
                                        </View>
                                    }
                                </View>
                            )}
                            keyExtractor={(type) => type.id}
                            showsVerticalScrollIndicator={false}
                            contentContainerStyle={{ paddingBottom: 30 }}
                        />
                    </View>
                </View>
                <View style={{width: '80%', flexDirection: 'column', alignItems: 'center', marginBottom: 30}}>
                    {canParticipate() && <CustomButton type="primary" text="Participar" onClick={handleSubscribeClick}/>}
                    {isParticipant && !userAsParticipant?.confirmedAt && (() => {
                        switch (userAsParticipant?.subscriptionStatus) {
                            case 'APPROVED':
                                return <CustomButton type="primary" text="Sair" onClick={handleUnsubscribeClick} />;
                            case 'WAITING':
                                return <CustomButton disabled text="Aguardando aprovação" />;
                            case 'REJECTED':
                                return <CustomButton disabled type="danger" text="Inscrição negada" />;
                            default:
                                return null;
                        }
                    })()}
                    {(isCreator && isActivityOccurring) && 
                        <CustomButton type="primary" text="Finalizar" onClick={handleConcludeActivityClick}/>
                    }
                </View>
            </ScrollableScreen>
    )
}

const styles = StyleSheet.create({
    header: {

    },
    activityImage: {
        width: '100%',
        aspectRatio: 1,
        flexDirection: 'column',
        justifyContent: 'flex-end',
        alignContent: 'center',
        position: 'relative'
    },
    activityDescription: {
        position: 'absolute',
        bottom: 0,
        minWidth: '60%',
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        borderTopEndRadius: 10,
        borderTopStartRadius: 10,
        backgroundColor: colors.white,
        paddingHorizontal: 10,
        paddingVertical: 5
    },
    activityData: {
        width: '92%',
        flexDirection: 'column',
    },
    editButton: {
        position: 'absolute',
        right: 30,
        top: 40
    },
    participant: {
        marginBottom: 10,
        paddingRight: 30,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginInline: 5,
        width: Dimensions.get('window').width * 0.9,
    },
    participantButton: {
        height: 30,
        width: 30,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.primary,
        borderRadius: 15
    }
})