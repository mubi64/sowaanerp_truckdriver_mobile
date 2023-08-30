import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from '../screens/home-screen';
import DetailsScreen from '../screens/details';
import LastOrder from '../screens/lastorders';
const HomeStackNavigation = createStackNavigator();
const LastOrderStackNavigation = createStackNavigator();
export function HomeStack() {
  return (
    <HomeStackNavigation.Navigator initialRouteName='HomePage' screenOptions={{headerShown:false}}>
      <HomeStackNavigation.Screen name="HomePage" component={HomeScreen} />
      <HomeStackNavigation.Screen name="Details" component={DetailsScreen} />
    </HomeStackNavigation.Navigator>
  );
}

export function LastOrderStack() {
  return (
    <LastOrderStackNavigation.Navigator initialRouteName='LastOrderPage' screenOptions={{headerShown:false}}>
      <LastOrderStackNavigation.Screen name="LastOrderPage" component={LastOrder} />
      <LastOrderStackNavigation.Screen name="Details" component={DetailsScreen} />  
    </LastOrderStackNavigation.Navigator>
  )
}

