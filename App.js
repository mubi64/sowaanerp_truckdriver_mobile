/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';

import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';
import HomeScreen from './app/screens/splash';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView,gestureHandlerRootHOC } from 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import MyTabs from './app/navigation/tabnavigation';
import Toast from 'react-native-toast-message';
import { AuthProvider } from './app/context/auth-context';
const App = () => {
  
  return (
    <AuthProvider>
    <NavigationContainer>
    <SafeAreaProvider>

    <SafeAreaView style={{flex:1}}>
      {/* <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      /> */}
          <HomeScreen />
          <Toast ref={ref => Toast.setRef(ref)}  />
      </SafeAreaView>
      </SafeAreaProvider>
      </NavigationContainer>
      </AuthProvider>
  );
}

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default gestureHandlerRootHOC(App);

