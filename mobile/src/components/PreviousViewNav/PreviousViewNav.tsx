import { StyleSheet, TouchableOpacity } from "react-native";
import { useCustomNavigation } from "../../hooks/useCustomNavigation";
import { CaretLeft } from "phosphor-react-native";


export default function PreviousViewNav (){
    const navigation = useCustomNavigation()

    return (
        <TouchableOpacity style={styles.fixedButton} onPress={() => navigation.goBack()}>
            <CaretLeft/>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    fixedButton: {
        position: 'absolute',    
        top: 35,
        left: 20,
        zIndex: 10
    }
});