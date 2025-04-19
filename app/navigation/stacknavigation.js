import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import HomeScreen from '../screens/home-screen';
import DetailsScreen from '../screens/details';
import LastOrderScreen from '../screens/lastorders';

const Stack = createStackNavigator();

// 🔹 Helper function to create stack navigators
const createStack = (initialRoute, screens) => (
  <Stack.Navigator initialRouteName={initialRoute} screenOptions={{ headerShown: false }}>
    {screens.map(({ name, component }) => (
      <Stack.Screen key={name} name={name} component={component} />
    ))}
  </Stack.Navigator>
);

// 🔹 Home Stack
export const HomeStack = () => createStack('HomeScreen', [
  { name: 'HomeScreen', component: HomeScreen },
  { name: 'Details', component: DetailsScreen },
]);

// 🔹 Last Order Stack
export const LastOrderStack = () => createStack('LastOrderScreen', [
  { name: 'LastOrderScreen', component: LastOrderScreen },
  { name: 'Details', component: DetailsScreen },
]);
