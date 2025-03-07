import { Text, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { getForecast } from "../reducer/ThunkAction";

export default function ForecastHeader({ item }) {
    const dispatch = useDispatch()
    const { count,currentCity } = useSelector(s => s.AuthReducer)
    function add() {
        if (count < 15) {
            dispatch({ type: 'COUNT', payload: count + 1 })
            dispatch(getForecast(currentCity));
        } else {
            alert('You can add only 15 days')
        }
    }
    return (<View style={{ flexDirection: 'row', justifyContent: 'space-between', margin: 12 }}>
        <Text style={{ color: '#fff', fontSize: 18 }}>{`${count}-Days Forecasts`}</Text>
        <Text style={{ color: '#fff', fontSize: 18 }} onPress={() => add()}>{'Add'}</Text>
    </View>)
}