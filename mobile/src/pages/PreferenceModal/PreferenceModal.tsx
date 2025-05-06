import React, { useEffect, useState } from "react";
import TypeList from "../../components/TypeList/TypeList";
import { Dimensions, StyleSheet, View } from "react-native";
import Title from "../../components/Title/Title";
import { ActivityType } from "../../types/activity";
import { CustomButton } from "../../components/CustomButton/CustomButton";
import PreviousViewNav from "../../components/PreviousViewNav/PreviousViewNav";
import { useUser } from "../../hooks/useUser";
import { showSuccessToast } from "../../services/toastService/toastService";
import { useRefreshContext } from "../../contexts/refreshContext";

interface PreferenceModalProps{
    onClose: () => void,
    closeType: 'backArrow' | 'jumpButton',
    preferences?: string[]
}

export function PreferenceModal({onClose, closeType, preferences}: PreferenceModalProps){

    const {triggerRefresh} = useRefreshContext()

    const [selectedTypes, setSelectedTypes] = useState<string[]>([])

    const {setPreferences} = useUser()

    useEffect(() => {
        if(preferences){
            const oldPreferences = preferences
            setSelectedTypes(oldPreferences)
        }
    }, [preferences])

    const onClick = (type: ActivityType) => {
        setSelectedTypes((prev) =>
            prev.includes(type.id) ? prev.filter((item) => item !== type.id) : [...prev, type.id]
        );
    }

    const handleAddPreferences = () => {
        setPreferences(selectedTypes).then(data => {
            if(data.message){
                showSuccessToast(data.message)
                triggerRefresh()
                onClose()
            }
        })
    }

    return (
        <>
            {closeType == 'backArrow' ? <PreviousViewNav onClick={onClose}/> : null}
            <View style={styles.container}>
                <Title style={styles.title}>Selecione seus tipos favoritos</Title>
                <TypeList selectedIds={selectedTypes} imageSize={112} type="wrap" selectMultiple={true} onClick={onClick}></TypeList>
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