import { FlatList, Image, SafeAreaView, StyleSheet, Text, View } from "react-native";
import { imgHW, safeAreaStyle } from "../util/AppStyles";
import { isNullOrEmpty, weekday, windowWidth } from "../util/util";
import moment from "moment";
import Location from "../components/Location";

export default function WeatherDetails({ route }) {
    const { item } = route.params
    return (
        <SafeAreaView style={[safeAreaStyle,{paddingTop:12}]}>
            <Location/>
            {!isNullOrEmpty(item?.day) && (
                <View style={styles.weatherContainer}>
                    <Text style={styles.temp}>{item?.day?.avgtemp_c}°C</Text>
                    <Text style={styles.condition}>{item?.day?.condition?.text}</Text>
                    {!isNullOrEmpty(item?.day?.condition?.icon) &&
                        <Image source={{ uri: 'https:' + item?.day?.condition?.icon }} style={imgHW(100)} />}
                </View>
            )}

            <Text style={[styles.day, { marginBottom: 0 }]}>
                {moment(item.date).format('DD MMM yyyy')} ({weekday[new Date(item.date).getDay()]})</Text>
            <Text style={styles.day}>Day forecast</Text>
            <FlatList
                data={item.hour}
                horizontal
                ListFooterComponent={<View style={{ width: 12 }} />}
                keyExtractor={(item) => item.time}
                renderItem={({ item }) => (
                    <View style={[styles.forecastCard, { width: (windowWidth - 48) / 3.2, marginLeft: 12, height: 200 }]}>
                        <Text style={[styles.condition, { fontSize: 14 }]}>{moment(item?.time).format('HH:mm a')}</Text>
                        <Text style={styles.forecastTemp}>{item.temp_c}°</Text>
                        <Text style={styles.condition}>{item?.condition?.text}</Text>
                        {!isNullOrEmpty(item?.condition?.icon) &&
                            <Image source={{ uri: 'https:' + item?.condition?.icon }} style={imgHW(80)} />}
                    </View>
                )}
            />
        </SafeAreaView>
    )
}
const styles = StyleSheet.create({
    weatherContainer: { alignItems: 'center' },
    temp: { fontSize: 50, fontWeight: 'bold', color: '#fff' },
    condition: { fontSize: 18, color: '#fff', marginBottom: 10 },
    forecastCard: {
        backgroundColor: 'rgba(255, 255, 255, 0.3)', borderRadius: 15,
        padding: 15, marginBottom: 10, alignItems: 'center'
    },
    forecastTemp: { fontSize: 22, color: '#fff' },
    forecastCondition: { fontSize: 18, color: '#fff' },
    day: { fontSize: 18, color: '#fff', margin: 12 },
});