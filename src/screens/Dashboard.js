import { ActivityIndicator, FlatList, Image, SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { centerStyle, imgHW, opcbg, safeAreaStyle } from "../util/AppStyles";
import { useEffect, useRef, useState } from "react";
import { getRequest } from "../util/ApiHelper";
import { isListNullOrEmpty, isNullOrEmpty, logError, weekday, windowWidth } from "../util/util";
import { colors } from "../util/Colors";
import RenderCities from "../components/RenderCities";
import { useDispatch, useSelector } from "react-redux";
import { getForecast, getWeather } from "../reducer/ThunkAction";
import Location from "../components/Location";
import ForecastHeader from "../components/ForecastHeader";

export default function Dashboard({ navigation }) {
    const { weather, forecast, currentCity } = useSelector(state => state.AuthReducer);
    const [loading, setLoading] = useState(false);
    const [cities, setCities] = useState([]);
    const dispatch = useDispatch()
    const [searchText, setSearchText] = useState('');
    const lastCall = useRef(0);
    const delay = 1000; // 1 second
    useEffect(() => {
        dispatch(getWeather(currentCity));
        dispatch(getForecast(currentCity));
    }, []);
    const onChange = (val) => {
        setSearchText(val);
        const now = Date.now();
        if (now - lastCall.current > delay) {
            getCities(val)
            lastCall.current = now;
        }
    };
    function getCities(val) {
        setLoading(true);
        getRequest('/search.json', `&q=${val}`)
            .then((res) => {
                setCities(res);
                setLoading(false);
            }).catch((err) => {
                logError(err);
                setLoading(false);
            });
    }
    return (
        <SafeAreaView style={safeAreaStyle}>
            <View style={{ height: 80 }}>
                <TextInput
                    style={styles.searchBar}
                    placeholder="Search city..."
                    value={searchText}
                    placeholderTextColor={colors.lightGray}
                    onChangeText={(val) => onChange(val)}
                />
            </View>
            {!isNullOrEmpty(weather?.current) && (
                <View style={styles.weatherContainer}>
                    <Text style={styles.temp}>{weather?.current?.temp_c}°C</Text>
                    <Text style={styles.condition}>{weather?.current?.condition?.text}</Text>
                    {!isNullOrEmpty(weather?.current?.condition?.icon) &&
                        <Image source={{ uri: 'https:' + weather?.current?.condition?.icon }} style={imgHW(100)} />}
                    <Location/>  
                </View>
            )}
            {!isListNullOrEmpty(forecast) &&<ForecastHeader/>}
            <FlatList
                data={forecast}
                horizontal
                ListFooterComponent={<View style={{ width: 12 }} />}
                keyExtractor={(item) => item.date}
                renderItem={({ item }) => (
                    <TouchableOpacity style={[styles.forecastCard, { width: (windowWidth - 48) / 2.8, marginLeft: 12, height: 200 }]}
                    onPress={() => navigation.navigate('WeatherDetails', { item })}>
                    <Text style={styles.forecastCondition}>{weekday[new Date(item.date).getDay()]}</Text>
                        <Text style={styles.forecastTemp}>Max: {item.day.maxtemp_c}°</Text>
                        <Text style={styles.forecastTemp}>Min: {item.day.mintemp_c}°</Text>
                        <Text style={styles.forecastCondition}>{item?.day?.condition?.text}</Text>
                        {!isNullOrEmpty(item?.day?.condition?.icon) &&
                            <Image source={{ uri: 'https:' + item?.day?.condition?.icon }} style={imgHW(80)} />}
                    </TouchableOpacity>
                )}
            />
            <RenderCities cities={cities} setCities={() => [setCities([]), setSearchText('')]} />
            {loading && (
                <View style={[{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0
                }, centerStyle, opcbg(0.2)]}>
                    <ActivityIndicator size="large" color="#fff" />
                </View>
            )}
        </SafeAreaView>
    )
}
const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, alignItems: 'center', justifyContent: 'center' },
    searchBar: {
        flex: 1, borderRadius: 25, paddingHorizontal: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.2)', fontSize: 18, color: '#fff',
        margin: 12
    },
    weatherContainer: { alignItems: 'center', marginBottom: 20 },
    temp: { fontSize: 50, fontWeight: 'bold', color: '#fff' },
    condition: { fontSize: 22, color: '#fff', marginBottom: 10 },
    forecastCard: {
        backgroundColor: 'rgba(255, 255, 255, 0.3)', borderRadius: 15,
        padding: 15, marginBottom: 10, alignItems: 'center'
    },
    forecastTemp: { fontSize: 14, color: '#fff' },
    forecastCondition: { fontSize: 16, color: '#fff' },
});