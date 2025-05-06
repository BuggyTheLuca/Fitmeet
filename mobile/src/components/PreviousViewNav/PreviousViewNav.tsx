import { StyleSheet, TouchableOpacity } from "react-native";
import { useCustomNavigation } from "../../hooks/useCustomNavigation";
import { CaretLeft } from "phosphor-react-native";
import { useRefreshContext } from "../../contexts/refreshContext";

interface PreviousViewNavProps{
    onClick?: () => void
}

export default function PreviousViewNav ({onClick}: PreviousViewNavProps){
    const navigation = useCustomNavigation()
    const {triggerRefresh} = useRefreshContext()

    const handleClick = () => {
        if(onClick){
            onClick()
            triggerRefresh()
        }else
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