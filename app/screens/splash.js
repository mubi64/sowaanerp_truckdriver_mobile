import React, { useEffect, useState } from 'react';
import {
  View,
  Image,
  Text,
} from 'react-native';

import { splashStyles as styles } from '../styles/screens/splash.styles';
import { useAuth } from '../context/auth-context';
import MyTabs from '../navigation/tabnavigation';
import LoginScreen from './loginscreen';
import { GetItem } from '../async-storage/async-storage';
import Toast from 'react-native-toast-message';

const SplashScreen = () => {
  const { user, login } = useAuth();
  const [load, setLoad] = useState(true);
  const [checkedLogin, setCheckedLogin] = useState(false); // ✅ To avoid re-triggering

  useEffect(() => {
    const checkUserLogin = async () => {
      if (!checkedLogin) {
        const isUserLoggedIn = await GetItem('userLoggedIn');
        if (isUserLoggedIn !== null) {
          const result = await login(true); // ✅ Login only once
          if (result.error) {
            Toast.show({ type: 'error', position: 'top', text1: 'Could not restore your session', text2: result.error });
          }
        }
        setCheckedLogin(true); // ✅ Flag to prevent loop
        setTimeout(() => setLoad(false), 1500); // Faster splash delay
      }
    };

    checkUserLogin();
  }, [checkedLogin]); // Only re-run if login hasn't been checked

  if (load) {
    return (
      <View style={styles.container}>
        <View style={styles.logoContainer}>
          <Image
            source={require('./../assets/images/truck-load.png')}
            style={styles.logoImageSize}
          />
        </View>
        <View style={styles.titleRow}>
          <Text style={styles.title}>SowaanERP</Text>
          <Text style={styles.title}> Driver App</Text>
        </View>
        <View style={styles.bottomSpacer} />
      </View>
    );
  }

  return user ? <MyTabs /> : <LoginScreen />;
};

export default SplashScreen;
