import React from 'react';
import {SafeAreaView} from 'react-native';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {
  GestureHandlerRootView,
  gestureHandlerRootHOC,
} from 'react-native-gesture-handler';
import {NavigationContainer} from '@react-navigation/native';
import Toast from 'react-native-toast-message';

import {AuthProvider} from './app/context/auth-context';
import HomeScreen from './app/screens/splash';
import {styles} from './app/helpers/styles';

const App = () => {
  return (
    <AuthProvider>
      <SafeAreaProvider>
        <NavigationContainer>
          <GestureHandlerRootView style={styles.flex_1}>
            <SafeAreaView style={styles.flex_1}>
              <HomeScreen />
              <Toast />
            </SafeAreaView>
          </GestureHandlerRootView>
        </NavigationContainer>
      </SafeAreaProvider>
    </AuthProvider>
  );
};

export default gestureHandlerRootHOC(App);
