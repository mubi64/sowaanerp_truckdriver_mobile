import React,{useState} from 'react';
import {
  View,
  Image,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from 'react-native';

import {Input, Icon} from '@rneui/base';
import { horizontalScale,verticalScale,moderateScale } from '../helpers/responsive';
import { BACKGROUND_COLOR, PRIOR_FONT_COLOR, SECONDARY_COLOR } from '../assets/colors/colors';
import { useAuth } from '../context/auth-context';
import MyTabs from '../navigation/tabnavigation';
import LoginScreen from './loginscreen';
import { GetItem } from '../async-storage/async-storage';
const SplashScreen = (props) => {
    const { user, logout,login } = useAuth();
    const [load,setLoad] = useState(true)

    React.useEffect(() => {

        const fetch = async () => {
            const getuserloggedIn = await GetItem('userLoggedIn')
            if (getuserloggedIn !== null) {
                login(true)
            }
            setTimeout(() => {
                setLoad(false)
            }, 5000);
        };
    
        fetch();
      }, []);

  // const signIn = async()=>{
  //   if(eemail === '' || password === ''){
  //     Toast.show({
  //       type: 'error',
  //       position:"top",
  //       text1: `${'Fill all values'}👋`,
  //     });
  //   }
  //   else{
  //     setLoader(true)
  //     const res= await PostMethod(
  //       urlForSignUp,
  //       {
  //         usr: eemail,
  //         pwd: password,
  //       },
  //       'method/login',
  //     )
  //     console.log('dewfewf',res)
  //       if(res.error !== undefined){
  //         setLoader(false)
  //         Toast.show({
  //           type: 'error',
  //           position:"top",
  //           text1: `${res.error}👋`
  //         });
        
  //       }
  //       else{
  //         const request = await GetMethod(`${urlForSignUp}`,undefined,`resource/User/${eemail}`)
  //         const dataparse = await request.json()
  //         const array = dataparse.data.roles.filter(item => {
  //           return item.role === "Rider"
  //         })
  //         if (dataparse.data.enabled === 0) {
  //           Toast.show({
  //             type: 'error',
  //             position:"top",
  //             text1: `${"You are not a active user"}👋`
  //           });
  //         }
  //         else {
  //           if (array.length > 0) {
  //             const req = await GetMethod(`${urlForSignUp}`,undefined,`resource/Employee?fields=["*"]&filters={"user_id":"${eemail}"}`)
  //             const datapar = await req.json()
  //             console.log('wdwqdqw',JSON.stringify(datapar,null,2))
  //             await StoreItem('user',{
  //               name:dataparse.data.full_name,
  //               email: eemail,
  //               employeeNumber:datapar.data[0].employee
  //             })
  //             props.navigation.reset({
  //               index: 0,
  //               routes: [{name: 'Home'}],
  //             })
  //                 setLoader(false) 
  //           }
  //           else {
  //             setLoader(false)
  //             Toast.show({
  //               type: 'error',
  //               position:"top",
  //               text1: `${"Your role is not a rider role"}👋`
  //             });
  //           }
  //         }
         
        
     
         
  //         }
  //       }
  //   }
  
  if (load) {
    // We haven't finished checking for the token yet
    return  <View style={styles.container}>
    
    <View
        style={{
          width: horizontalScale(150),
          height: horizontalScale(150),
          borderRadius: horizontalScale(150) / 2,
          alignSelf: 'center',
          backgroundColor: 'white',
          justifyContent: 'center',
          alignItems: 'center',
          shadowOpacity: 0.48,
          shadowRadius: 11.95,
          elevation: 6,
      }}
      >
      <Image
        source={require('./../assets/images/truck-load.png')}
        style={styles.logoImageSize}
        />
        </View>
      <View style={{ height: verticalScale(34.35) }} />
     
      <View
        style={{flexDirection: 'row', marginTop: horizontalScale(2), alignSelf: 'center'}}>
        <Text
          style={{
            fontSize: moderateScale(30),
            color:SECONDARY_COLOR,
            fontFamily: 'Outfit-Regular',
            fontWeight:'bold'
          }}>
          Sowaan
        </Text>
        <Text
          style={{
            fontSize:moderateScale(30),
            color: SECONDARY_COLOR,
            fontFamily: 'Outfit-Regular',
            fontWeight:'bold'
          }}>
          ERP Driver App
        </Text>
      </View>
      <View style={{height: verticalScale(24.36)}} />

     
   
    </View>
    }
  else {
      if (user !== null) {
          return <MyTabs />
      }
      else {
          return <LoginScreen />
      }
    }
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
        backgroundColor: BACKGROUND_COLOR,
        justifyContent: 'center',
    alignItems:'center'
  },
  logoImageSize: {
    width: 80,
    height: 80,
    alignSelf: 'center',
  },
});
export default SplashScreen;
