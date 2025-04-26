import { useNavigation } from "@react-navigation/native"
import { StackNavigationProp } from "@react-navigation/stack"
import { MainStackParamList } from "../routes/AppRoutes"

export const useCustomNavigation = () => {
    return useNavigation<StackNavigationProp<MainStackParamList>>()
}