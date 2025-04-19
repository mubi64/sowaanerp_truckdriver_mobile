import React, { useEffect, useState } from 'react';
import {
  View,
  Image,
  Text,
  StyleSheet,
} from 'react-native';

import { horizontalScale, verticalScale, moderateScale } from '../helpers/responsive';
import { BACKGROUND_COLOR, SECONDARY_COLOR } from '../assets/colors/colors';
import { useAuth } from '../context/auth-context';
import MyTabs from '../navigation/tabnavigation';
import LoginScreen from './loginscreen';
import { GetItem } from '../async-storage/async-storage';

const SplashScreen = () => {
  const { user, login } = useAuth();
  const [load, setLoad] = useState(true);

  useEffect(() => {
    const checkUserLogin = async () => {
      const isUserLoggedIn = await GetItem('userLoggedIn');
      if (isUserLoggedIn !== null) {
        login(true);
      }
      setTimeout(() => setLoad(false), 3000); // Reduced time to 3s for faster UX
    };

    checkUserLogin();
  }, [login]);

  if (load) {
    // We haven't finished checking for the token yet
    return (<View style={styles.container}>
      <View
        style={styles.logoContainer}
      >
        <Image
          source={require('./../assets/images/truck-load.png')}
          style={styles.logoImageSize}
        />
      </View>
      <View
        style={{ flexDirection: 'row', marginTop: horizontalScale(2), alignSelf: 'center' }}>
        <Text style={styles.title}>SowaanERP</Text>
        <Text style={styles.title}> Driver App</Text>
      </View>
      <View style={{ height: verticalScale(24.36) }} />
    </View>);
  }

  return user ? <MyTabs /> : <LoginScreen />;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BACKGROUND_COLOR,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    width: horizontalScale(150),
    height: horizontalScale(150),
    borderRadius: horizontalScale(200),
    backgroundColor: 'white',
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 6,
  },
  logoImageSize: {
    width: 80,
    height: 80,
    alignSelf: 'center',
  },
  title: {
    fontSize: moderateScale(30),
    color: SECONDARY_COLOR,
    fontFamily: 'Outfit-Regular',
    fontWeight: 'bold',
    marginTop: 5,
  },
});

export default SplashScreen;
