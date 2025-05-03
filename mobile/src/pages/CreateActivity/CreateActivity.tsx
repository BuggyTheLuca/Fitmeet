import React, { useState } from "react";
import ScrollableScreen from "../../components/ScrollableScreen/ScrollableScreen";
import Title from "../../components/Title/Title";
import PreviousViewNav from "../../components/PreviousViewNav/PreviousViewNav";
import { Dimensions, StyleSheet, View } from "react-native";
import { Input } from "../../components/Input/Input";
import { CustomButton } from "../../components/CustomButton/CustomButton";
import DatePicker from "../../components/DatePicker/DatePicker";

export function CreateActivity() {

    const [title, setTitle] = useState('');
    const [titleError, setTitleError] = useState(false);

    const [description, setDescription] = useState('');
    const [descriptionError, setDescriptionError] = useState(false);

    const [scheduledDate, setScheduledDate] = useState(new Date());
    const [scheduledDateError, setScheduledDateError] = useState(false);
   

    //date.toISOString()


    const handleSaveActivity = () => {
        try {
            let isError = false;

            if(title.length < 1){
                setTitleError(true);
                isError = true
            }
            if(description.length < 1){
                setDescriptionError(true);
                isError = true
            }
            if(scheduledDate < (new Date)){
                setScheduledDateError(true);
                isError = true
            }

            if (isError) return;

            console.log()

        } catch (error: any) {
            /* if(error.status == 401){
                setPasswordError(true);
                setPasswordErrorText(error.error)
            }
            if(error.status == 404){
                setEmailError(true);
                setEmailErrorText(error.error)
            }
            showErrorToast('Erro durante login', error.error); */
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
                            onChange={(date) => setScheduledDate(date)}
                        />

                    <CustomButton type="primary" text="Salvar" onClick={handleSaveActivity}/>
                </View>
            </ScrollableScreen>
        </>
    )
}

const styles = StyleSheet.create({
    formContainer: {
        marginTop: 20,
        flexDirection: 'column',
        alignItems: 'center',
        width: Dimensions.get('window').width * 0.9
    }
})