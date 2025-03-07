import { Text } from "react-native";
import { useSelector } from "react-redux";

export default function Location() {
        const { currentCity } = useSelector(s => s.AuthReducer);
    return (
        <Text style={[{ fontSize: 18, color: '#fff', marginBottom: 10 ,textAlign: 'center' }]}>{currentCity?.name}{'\n'}{currentCity.country ? `(${currentCity.country})` : null}</Text>
    )
}