
import { use, useEffect, useState } from 'react';
import { ActivityIndicator, PermissionsAndroid, StyleSheet, Text, View } from 'react-native';
import Geolocation from '@react-native-community/geolocation';
import MapView, { LatLng, Marker } from 'react-native-maps';

interface MapProps {
    onLocationChange?: (latitude: number, longitude: number) => void;
    location?: {latitude: number, longitude: number};
}

export default function Map({onLocationChange, location}: MapProps) {

    const [latitude, setLatitude] = useState<number | null>(null);
    const [longitude, setLongitude] = useState<number | null>(null);
    const [coordinate, setCoordinate] = useState<LatLng>();


    async function getPermission() {
        const hasPermission = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION)
        return hasPermission === PermissionsAndroid.RESULTS.GRANTED;
    }

    function getLocation() {
        Geolocation.getCurrentPosition(
            (position) => {
                setLatitude(position.coords.latitude);
                setLongitude(position.coords.longitude);
            },
            (error) => {
                console.error(error);
            },
            { enableHighAccuracy: true, timeout: 15000 }
        );
    }

    useEffect(() => {
        setCoordinate(location)
    }, [location])


    useEffect(() => {
        getLocation();
    }, [])

    return (
        <View style={styles.container} >
            {
                latitude && longitude ? (
                    <MapView
                        onMapReady={() => getPermission()}
                        style={styles.map}
                        initialRegion={{
                            latitude: coordinate?.latitude || latitude,
                            longitude: coordinate?.longitude || longitude,
                            latitudeDelta: 0.0922,
                            longitudeDelta: 0.0421,
                        }}
                        provider='google'
                        showsUserLocation={true}
                        zoomEnabled={true}
                        loadingEnabled={true}
                        onLongPress={(e) => {
                            if (!onLocationChange) return;
                        
                            const { latitude, longitude } = e.nativeEvent.coordinate;
                            setCoordinate(e.nativeEvent.coordinate);
                            setLatitude(latitude);
                            setLongitude(longitude);
                            onLocationChange(latitude, longitude);
                        }}
                    >
                        {
                            coordinate && (
                                <Marker
                                    draggable
                                    coordinate={coordinate}
                                    onDragEnd={(e) => {
                                        if (!onLocationChange) return;

                                        setLatitude(e.nativeEvent.coordinate.latitude);
                                        setLongitude(e.nativeEvent.coordinate.longitude);
                                        onLocationChange(e.nativeEvent.coordinate.latitude, e.nativeEvent.coordinate.longitude);
                                    }}
                                    title="Ponto de encontro"
                                    description="Aqui é o ponto de encontro"
                                />
                            )
                        }
                    </MapView>
                ) : (
                    <ActivityIndicator size="large" color="#0000ff" />
                )
            }
        </View>
    );
}


const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: 230,
        alignItems: 'center',
        justifyContent: 'center',
    },
    map: {
        width: '100%',
        height: '100%',
    }
});