import { Text } from "react-native";
import { useCustomNavigation } from "../../hooks/useCustomNavigation";


export default function PreviousViewNav (){
    const navigation = useCustomNavigation()

    return (
        <Text style={{fontWeight: "bold", fontSize: 40}} onPress={() => navigation.goBack()}>
            {'<'}
        </Text>
    )
}