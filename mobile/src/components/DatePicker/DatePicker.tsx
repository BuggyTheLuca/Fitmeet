import { useEffect, useState } from 'react';
import { TouchableOpacity, View, Text, Platform, StyleSheet } from 'react-native';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import React from 'react';
import { fonts } from '../../assets/styles/fonts';
import { colors } from '../../assets/styles/colors';


interface DatePickerProps {
    onChange?: (date: Date) => void;
    dateString?: string;
    required?: boolean,
    isError?: boolean,
    errorText?: string
    label: string;
}

export default function DatePicker({ onChange, label, required, isError, errorText, dateString }: DatePickerProps) {

    const [date, setDate] = useState<Date>(new Date());
    const [mode, setMode] = useState<'date' | 'time'>('date');
    const [show, setShow] = useState(false);


    useEffect(() => {
        if(dateString)
            setDate(new Date(dateString))
    }, [dateString])


    function formatDate(date: Date) {
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');

        return `${day}/${month}/${year} ${hours}:${minutes}`;
    }


    function handleDateChange(event: DateTimePickerEvent, selectedDate: Date | undefined) {
        if(selectedDate) {
            const updatedDate = new Date(selectedDate);

            if(mode === 'date') {
                updatedDate.setFullYear(selectedDate.getFullYear(),selectedDate.getMonth(), selectedDate.getDate());
            } else {
                updatedDate.setHours(selectedDate.getHours(), selectedDate.getMinutes());
            }
            setDate(updatedDate);

            if (mode === 'date') {
                setMode('time');
                setShow(true);
            }else{
                setShow(false);
                onChange && onChange(updatedDate);
            }
        }
    }

    function showPicker(mode: 'date' | 'time') {
        setShow(true);
        setMode(mode);
    }

    return (
        <>
            {
                show && (
                    <DateTimePicker
                        value={date}
                        locale='pt-BR'
                        mode={mode}
                        is24Hour={true}
                        display={Platform.OS === 'ios' ? 'inline' : 'default'}
                        onChange={handleDateChange}
                    />
                )
            }
            <View style={styles.root}>
                <Text style={[styles.label, isError && { color: colors.danger }]}>
                    {label} {required && <Text style={[styles.label, styles.required]}>*</Text>}
                </Text>
                <TouchableOpacity
                    onPress={() => showPicker('date')}
                >
                    <View style={[styles.input, isError && { borderColor: colors.danger }]}>
                        <Text style={styles.inputText}>
                            {formatDate(date)}
                        </Text>
                    </View>
                </TouchableOpacity>
                <View>
                    {
                        isError && (
                            <Text style={[styles.label, styles.error]}>
                                {errorText}
                            </Text>
                        )
                    }
                </View>
            </View>
        </>
    );
}


const styles = StyleSheet.create({
    root: {
        width: '100%',
        marginBottom: 16
    },
    label: {
        fontFamily: fonts.DMSans.semiBold,
        fontSize: 16,
        color: colors.grey,
        lineHeight: 20
    },
    required: {
        color: colors.danger
    },
    input: {
        marginTop: 6,
        width: '100%',
        height: 56,
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: colors.lightGrey,
        borderRadius: 8,
        paddingLeft: 20
    },
    inputText: {
        fontFamily: fonts.DMSans.regular,
        fontSize: 16,
        lineHeight: 24,
        color: colors.grey,
    },
    error: {
        color: colors.danger,
    }
})