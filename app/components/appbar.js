import React, { useEffect, useState } from 'react';
import { Text, View, PermissionsAndroid, Platform } from 'react-native';
import GetLocation from 'react-native-get-location';
import Geocoder from 'react-native-geocoding';
import { styles } from '../helpers/styles';
import { Avatar } from '@rneui/base';
import { moderateScale } from '../helpers/responsive';
import { Icon } from '@rneui/themed';
import { SECONDARY_COLOR } from '../assets/colors/colors';
import { useAuth } from '../context/auth-context';

// Initialize Geocoder once
Geocoder.init('AIzaSyBwIQQCT80qJDnmN-bh0KLL9Ln_mQS7RVA'); // <--- Replace with your real API key

const Appbar = () => {
    const { employee } = useAuth();
    const [city, setCity] = useState('');
    const [errorMsg, setErrorMsg] = useState('');

    useEffect(() => {
        const requestLocation = async () => {
            try {
                if (Platform.OS === 'android') {
                    const granted = await PermissionsAndroid.request(
                        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
                    );
                    if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
                        setErrorMsg('Location permission denied');
                        return;
                    }
                }

                const loc = await GetLocation.getCurrentPosition({
                    enableHighAccuracy: true,
                    timeout: 15000,
                });

                const { latitude, longitude } = loc;

                const geoResult = await Geocoder.from(latitude, longitude);
                console.log('Geocoder result:', geoResult);

                if (geoResult.results.length > 0) {
                    const address = geoResult.results[0].address_components;
                    const cityComponent = address.find(c =>
                        c.types.includes('locality') || c.types.includes('administrative_area_level_1')
                    );
                    const countryComponent = address.find(c => c.types.includes('country'));

                    const cityName = cityComponent?.long_name || '';
                    const country = countryComponent?.long_name || '';

                    setCity(`${cityName}, ${country}`);
                } else {
                    setErrorMsg('No address found for location');
                }
            } catch (error) {
                console.log('Reverse Geocode Error:', error);
                if (error.origin) {
                    console.log('Google API Error:', error.origin); // This shows the actual Google error
                }
                setErrorMsg('Error fetching location');
            }

        };

        requestLocation();
    }, []);

    return (
        <View style={styles.appbar}>
            <View style={styles.centerRow}>
                <Avatar
                    source={require('./../assets/images/driver_dp.png')}
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
