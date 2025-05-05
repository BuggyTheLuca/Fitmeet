import React, { useState } from "react";
import TypeList from "../../components/TypeList/TypeList";
import { Dimensions, StyleSheet, View } from "react-native";
import Title from "../../components/Title/Title";
import { ActivityType } from "../../types/activity";
import { CustomButton } from "../../components/CustomButton/CustomButton";
import PreviousViewNav from "../../components/PreviousViewNav/PreviousViewNav";
import { useUser } from "../../hooks/useUser";
import { showSuccessToast } from "../../services/toastService/toastService";

interface PreferenceModalProps{
    onClose: () => void,
    closeType: 'backArrow' | 'jumpButton'
}

export function PreferenceModal({onClose, closeType}: PreferenceModalProps){

    const [selectedTypes, setSelectedTypes] = useState<string[]>([])

    const {setPreferences} = useUser()

    const onClick = (type: ActivityType) => {
        setSelectedTypes((prev) =>
            prev.includes(type.id) ? prev.filter((item) => item !== type.id) : [...prev, type.id]
        );
    }

    const handleAddPreferences = () => {
        setPreferences(selectedTypes).then(data => {
            if(data.message){
                showSuccessToast(data.message)
                onClose()
            }
        })
    }

    return (
        <>
            {closeType == 'backArrow' ? <PreviousViewNav onClick={onClose}/> : null}
            <View style={styles.container}>
                <Title style={styles.title}>Selecione seus tipos favoritos</Title>
                <TypeList imageSize={112} type="wrap" selectMultiple={true} onClick={onClick}></TypeList>
                <View style={styles.buttonColumn}>
                    <CustomButton type="primary" text="Salvar" onClick={handleAddPreferences}/>
                    {closeType == 'jumpButton' ? <CustomButton text="Pular" onClick={onClose}/>: null}
                </View>
            </View>
        </>
    )
}

const styles = StyleSheet.create({
    container: {
        marginTop: 80,
        gap: 20
    },
    title: {
        marginLeft: 22
    },
    buttonColumn: {
        flexDirection: 'column',
        width: Dimensions.get('window').width,
        alignItems: 'center',
        gap: 12
    }
})