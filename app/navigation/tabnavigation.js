import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { LOW_PRIOR_FONT_COLOR, PRIMARY_COLOR, PRIOR_FONT_COLOR, SECONDARY_COLOR } from '../assets/colors/colors';
import { HomeStack, LastOrderStack } from './stacknavigation';
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';
import { moderateScale } from '../helpers/responsive';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import ProfileScreen from '../screens/profile';
import Icon from 'react-native-vector-icons/Ionicons';
const Tab = createBottomTabNavigator();

const ICONS = {
  Home: { name: 'home' },
  LastOrder: { name: 'cube-outline' },
  Profile: { name: 'person-outline' },
};


function MyTabBar({ state, descriptors, navigation }) {

  const focusedOptions = descriptors[state.routes[state.index].key].options;
  if (focusedOptions.tabBarVisible === false) {
    return null;
  }

  return (
    <View style={styles.tabContainer}>
      {state.routes.map((route, index) => {
        const isFocused = state.index === index;
        const { options } = descriptors[route.key];

        const icon = ICONS[route.name];


        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: 'tabLongPress',
            target: route.key,
          });
        };

        return (
          <TouchableOpacity
            accessibilityRole="button"
            key={route.key}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            testID={options.tabBarTestID}
            onPress={onPress}
            onLongPress={onLongPress}
            style={styles.tabButton}
          >
            <Icon name={icon.name} color={isFocused ? SECONDARY_COLOR : LOW_PRIOR_FONT_COLOR} size={moderateScale(24)} />
            <Text>{route.name}</Text>

          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const getTabBarVisibility = (route) => {
  const hiddenScreens = ['Details', 'Items'];
  const routeName = getFocusedRouteNameFromRoute(route) ?? '';
  return !hiddenScreens.includes(routeName);
};

function MyTabs() {
  return (
    <Tab.Navigator initialRouteName="Home" screenOptions={{ headerShown: false }}
      tabBar={props => <MyTabBar {...props} />}
    >
      {/* <Tab.Screen name="Home" component={HomeStack} /> */}
      <Tab.Screen
        name="Home"
        component={HomeStack}
        options={({ route }) => ({
          tabBarStyle: { display: getTabBarVisibility(route) ? 'flex' : 'none' },
        })}
      />
      <Tab.Screen
        name="LastOrder"
        component={LastOrderStack}
        options={({ route }) => ({
          tabBarStyle: { display: getTabBarVisibility(route) ? 'flex' : 'none' },
        })}
      />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
    paddingBottom: 20,
    borderTopColor: '#ddd',
    borderTopWidth: 1,
    backgroundColor: PRIMARY_COLOR,
  },
  tabButton: { alignItems: 'center' },
});

export default MyTabs;