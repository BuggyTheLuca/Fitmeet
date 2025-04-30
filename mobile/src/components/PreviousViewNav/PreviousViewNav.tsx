import { TouchableOpacity } from "react-native";
import { useCustomNavigation } from "../../hooks/useCustomNavigation";
import { CaretLeft } from "phosphor-react-native";


export default function PreviousViewNav (){
    const navigation = useCustomNavigation()

    return (
        <TouchableOpacity onPress={() => navigation.goBack()}>
            <CaretLeft/>
        </TouchableOpacity>
    )
}