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


type ActivityDetailsRouteProp = RouteProp<MainStackParamList, 'ActivityDetails'>;

export function ActivityDetails(){
    const {auth: {loggedUser}} = useAppContext()
    const route = useRoute<ActivityDetailsRouteProp>();
    const { activity } = route.params;

    const navigation = useCustomNavigation()

    const [participants, setParticipants] = useState<Participant[]>()
    const [isParticipant, setIsParticipant] = useState(false)
    const [isCreator, setIsCreator] = useState(false)
    const [isActivityDay, setIsActivityDay] = useState(false)
    const [isActivityOccurring, setIsActivityOccurring] = useState(false)

    const [confirmationCode, setConfirmationCode] = useState<string>()
    const [confirmationCodeError, setConfirmationCodeError] = useState(false);

    const {getActivityParticipants, approve, subscribe, unsubscribe} = useActivity()


    useEffect(() => {

    }, [activity])


    useEffect(() => {
        getActivityParticipants(activity.id).then(data => {
            if(data.status == 200){
                setParticipants(data.participants)
                setIsCreator(getIsCreator())
                setIsParticipant(getIsParticipant(data.participants))
            }else{
                showErrorToast("Erro!", 'Erro ao buscar participantes.')
            }
        })
    }, [getActivityParticipants])

    function getIsCreator(){
        if(!loggedUser) return false;

        return loggedUser.id == activity.creator.id
    }

    function getIsParticipant(participants: Participant[]){
        if(!loggedUser || !participants) return false;

        return participants.some(participant => participant.id == loggedUser.id)
    }

    function canEditParticipant(){
        return isCreator && !isActivityDay && !isActivityOccurring && !activity.completedAt
    }

    function canParticipate(){
        return !isCreator && !isActivityDay && !isActivityOccurring && !activity.completedAt
    }

    function getUserAsParticipant() {
        if(!participants) return;
        if(!loggedUser) return;

        const userAsParticipant = participants.find(participant => participant.id == loggedUser!.id)

        return userAsParticipant
    }

    const handleSubscribeClick = () => {
        subscribe(activity.id).then(data => {
            console.log(data)
        })
    }

    const handleUnsubscribeClick = () => {
        unsubscribe(activity.id).then(data => {
            console.log(data)
        })
    }

    const handleCheckInClick = () => {
        console.log('check-in')
    }

    const handleConcludeActivityClick = () => {
        console.log('conclude')
    }

    const handleApproveClick = (request: {approved: boolean, participantId: string}) => {
        approve(activity.id, request).then(data => {
            console.log(data)
            if(data.status == 200){
                showSuccessToast(data.message)
            }
        })
    }


    return(
        <>
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
                        <View>
                            <CustomText>Código de confirmação</CustomText>
                            <View>
                                <CustomText>{activity.confirmationCode}</CustomText>
                            </View>
                        </View>
                    }
                    {(isParticipant && (isActivityDay || isActivityOccurring)) &&
                        <View>
                            <Input.Root isError={confirmationCodeError}>
                                <Input.Label required>Título</Input.Label>
                                <Input.Input
                                    value={confirmationCode}
                                    onChangeText={(text) => {
                                        setConfirmationCode(text);
                                        setConfirmationCodeError(false);
                                    }}
                                    autoCapitalize='none'
                                />
                                <Input.ErrorMessage style={{ marginTop: 6 }}>
                                    Campo obrigatório
                                </Input.ErrorMessage>
                            </Input.Root>
                            <CustomButton type="primary" text="Confirmar presença" onClick={handleCheckInClick}/>
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
                                <Image source={{uri: fixUrl(activity.creator.avatar)}} style={{width: 44, height: 44, borderRadius: 22}}/>
                                <View>
                                    <CustomText>{activity.creator.name}</CustomText>
                                    <CustomText fontSize={12} lineHeight={14} style={{color: colors.grey}}>Organizador</CustomText>
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
                                        <View>
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
                    {isParticipant ?? (() => {
                        switch(getUserAsParticipant()?.subscriptionStatus){
                            case 'APPROVED':
                                return <CustomButton type="primary" text="Sair" onClick={handleUnsubscribeClick}/>
                            case 'WAITING':
                                return <CustomButton disabled text="Aguardando aprovação"/>
                            case 'REJECTED':
                                return <CustomButton disabled type="danger" text="Incrição negada"/>
                    }})}
                    {(isCreator && isActivityOccurring) && 
                        <CustomButton type="primary" text="Finalizar" onClick={handleConcludeActivityClick}/>
                    }
                </View>
            </ScrollableScreen>
        </>
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
        flexDirection: 'row',
        alignItems: 'center',
        marginInline: 5,
        width: Dimensions.get('window').width * 0.9,
    },
    participantButton: {
        backgroundColor: colors.primary,
        borderRadius: 10
    }
})