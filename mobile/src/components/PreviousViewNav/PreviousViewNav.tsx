import { StyleSheet, TouchableOpacity } from "react-native";
import { useCustomNavigation } from "../../hooks/useCustomNavigation";
import { CaretLeft } from "phosphor-react-native";

interface PreviousViewNavProps{
    onClick?: () => void
}

export default function PreviousViewNav ({onClick}: PreviousViewNavProps){
    const navigation = useCustomNavigation()

    const handleClick = () => {
        if(onClick)
            onClick()
        else
            navigation.goBack()
    }

    return (
        <TouchableOpacity style={styles.fixedButton} onPress={handleClick}>
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