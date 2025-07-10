import React, { useEffect, useState } from 'react';
import { Text, View, PermissionsAndroid, Platform } from 'react-native';
import GetLocation from 'react-native-get-location';
import { styles } from '../helpers/styles';
import { moderateScale } from '../helpers/responsive';
import { Icon } from '@rneui/themed';
import { SECONDARY_COLOR } from '../assets/colors/colors';
import { useAuth } from '../context/auth-context';
import { Avatar } from 'react-native-elements';


const Appbar = () => {
    const { employee } = useAuth();
    const [city, setCity] = useState('');
    const [errorMsg, setErrorMsg] = useState('');

    useEffect(() => {
        const requestLocation = async () => {
            try {
                // Request permission on Android
                if (Platform.OS === 'android') {
                    const granted = await PermissionsAndroid.request(
                        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
                    );
                    if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
                        setErrorMsg('Location permission denied');
                        return;
                    }
                }

                // Get current location
                const loc = await GetLocation.getCurrentPosition({
                    enableHighAccuracy: true,
                    timeout: 60000,
                });

                const { latitude, longitude } = loc;

                // Call OpenStreetMap's Nominatim reverse geocoding
                const response = await fetch(
                    `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`,
                    {
                        headers: {
                            'User-Agent': 'transport_driver_app/1.0 (m.saad@sowaan.com)',
                            'Accept-Language': 'en',
                        },
                    }
                );
                const data = await response.json();

                if (data && data.address) {
                    const address = data.address;

                    const cityName = address.town || address.city_district || '';
                    const countryName = address.country || '';

                    setCity(`${cityName}, ${countryName}`);
                } else {
                    setErrorMsg('No address found for location');
                }

            } catch (error) {
                console.log('Reverse Geocode Error:', error);
                setErrorMsg('Error fetching location');
            }
        };

        requestLocation();
    }, []);

    return (
        <View style={styles.appbar}>
            <View style={styles.centerRow}>
                <Avatar
                    source={require('../assets/images/driver_dp.png')}
                    size={moderateScale(60)}
                    rounded
                />
                <View style={{ marginLeft: 8 }}>
                    <Text style={styles.greeting}>Hello, {employee && employee.first_name.split(" ", 1)}</Text>
                    <Text style={styles.appbar_location}>
                        {city || errorMsg || 'Getting location...'}
                    </Text>
                </View>
            </View>
            <Icon
                raised
                name={'bell'}
                type="font-awesome-5"
                color={SECONDARY_COLOR}
                size={moderateScale(20)}
                onPress={() => { }}
                containerStyle={{ borderRadius: 100 }}
            />
        </View>
    );
};

export default Appbar;
