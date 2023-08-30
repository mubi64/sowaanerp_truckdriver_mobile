import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import HomeScreen from '../screens/home-screen';
import LastOrder from '../screens/lastorders';
import {View,Text,TouchableOpacity} from 'react-native'
import { Icon } from '@rneui/themed';
import { BACKGROUND_COLOR, LOW_PRIOR_FONT_COLOR, PRIMARY_COLOR, PRIOR_FONT_COLOR, SECONDARY_COLOR } from '../assets/colors/colors';
import {HomeStack,LastOrderStack} from './stacknavigation';
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';
import { horizontalScale, moderateScale, verticalScale } from '../helpers/responsive';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

const Tab = createBottomTabNavigator();
function MyTabBar({ state, descriptors, navigation }) {
  console.log('state',state)
  const focusedOptions = descriptors[state.routes[state.index].key].options;

  if (focusedOptions.tabBarVisible === false) {
    return null;
  }

  return (
    <View style={{ flexDirection: 'row',height:verticalScale(60),justifyContent:"space-around",backgroundColor:PRIMARY_COLOR}}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        
        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
            ? options.title
            : route.name;

        const isFocused = state.index === index;

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
            key={index.toString()}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            testID={options.tabBarTestID}
            onPress={onPress}
            onLongPress={onLongPress}
            style={{alignSelf:"center"}}
          >
            {(isFocused)?
              <View
              style={{
                  width: horizontalScale(187.5), height: verticalScale(120), justifyContent: "center", alignItems: "center", backgroundColor: { PRIMARY_COLOR }// IOS
                  
              }}
          >
          {(route.name==="Home")?  
          <Icon name="home" type="font-awesome-5" color={SECONDARY_COLOR} size={moderateScale(20)} />
          :
          <Icon name="CodeSandbox" type="antdesign" color={SECONDARY_COLOR} size={moderateScale(20)} />
        }
<Text style={{ color:PRIOR_FONT_COLOR,fontFamily:"CenturyGothic",fontSize:moderateScale(12) }}>
    {label}
  </Text>
          </View>
              :
              <View
              style={{
                width: horizontalScale(187.5), height: verticalScale(120), justifyContent: "center", alignItems: "center", backgroundColor: { PRIMARY_COLOR }// IOS
                
            }}
              >
                {
        (route.name==="Home")?
        <Icon name="home" type="font-awesome-5" color={LOW_PRIOR_FONT_COLOR} size={moderateScale(20)}  />
        :
                <Icon name="CodeSandbox" type="antdesign" color={LOW_PRIOR_FONT_COLOR} size={moderateScale(20)} />
            }
              </View>
          
          }
             
            
          </TouchableOpacity>
        );
      })}
    </View>
  );
}
function MyTabs() {
  const getTabBarVisibility = (route) => {
    console.log('abaysale',route)
    const routeName = getFocusedRouteNameFromRoute(route);
    const hideOnScreens = ["Details"]; // put here name of screen where you want to hide tabBar
    return !hideOnScreens.includes(routeName);;
  };
  return (
    <Tab.Navigator
      initialRouteName="Home"
 
      screenOptions={{headerShown:false}}
      tabBar={props => <MyTabBar {...props} />}
//barStyle={{ backgroundColor:BACKGROUND_COLOR,height:verticalScale(80) }}
    >
      <Tab.Screen
        name="Home"
              component={HomeStack}
          
        options={({ route }) => ({ 
          tabBarStyle:  ((route) => {
            const routeName = getFocusedRouteNameFromRoute(route) ?? ""
            if (routeName ==='Details' ) {
              return { display: "none" }
                  }
                  return 
          })(route),
          //tabBarLabel: 'Home',
    
            tabBarLabel:"Home",
        
        })
        }
      />
      <Tab.Screen
        name="LastOrder"
        component={LastOrderStack}
        options={({ route }) => ({
          tabBarLabel: 'Last Order',
          tabBarStyle:  ((route) => {
            const routeName = getFocusedRouteNameFromRoute(route) ?? ""
            if (routeName ==='Details' ) {
              return { display: "none" }
                  }
                  return 
          })(route)
        })}
      />
    
    </Tab.Navigator>
  );
}

export default MyTabs