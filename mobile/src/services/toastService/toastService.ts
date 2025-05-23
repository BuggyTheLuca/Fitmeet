import Toast from "react-native-toast-message";

export function showErrorToast(title: string, message?: string) {
    Toast.show({
        type: 'error',
        text1: title,
        text2: message,
    });
}

export function showSuccessToast(message: string) {
    Toast.show({
        type: 'success',
        text1: 'Sucesso',
        text2: message,
    });
}