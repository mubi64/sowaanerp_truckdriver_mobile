import React,{useState} from 'react';
import {
  View,
  Image,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ActivityIndicator
} from 'react-native';
import { StoreItem,GetItem } from '../async-storage/async-storage';
import {Input, Icon} from '@rneui/base';
import { horizontalScale,verticalScale,moderateScale } from '../helpers/responsive';
import { BACKGROUND_COLOR, PRIOR_FONT_COLOR, SECONDARY_COLOR,PRIMARY_COLOR } from '../assets/colors/colors';
import Toast from 'react-native-toast-message';
import { httpPOST } from '../network calls/networkCalls';
import { useAuth } from '../context/auth-context';

const LoginScreen = (props) => {
  const [passwordSecureEntry, setPasswordSecureEntry] = useState(true);
  const { user, logout,login } = useAuth();
  const [eemail, seteEmail] = useState('');
  const [password, setPassword] = useState('');
  const [load,setLoad] = React.useState(false)
  const [loader, setLoader] = useState(false)
  const [linkText, setLinkText] = useState('')
  React.useEffect(() => {
    const fetchUrl = async() => {
      const BaseUrl = await GetItem('BASEURL');
      if (BaseUrl !== null) {
      
           setLinkText(BaseUrl.replace(/^http?:\/\//, ''))
      }
      
    }
    
    fetchUrl()
    
  },[])
  const signIn = async () => {
    
    if(eemail === '' || password === '' || linkText === ''){
      Toast.show({
        type: 'error',
        position:"top",
        text1: `${'Fill all values'}👋`,
      });
    }
    else {
      setLoad(true)
      await StoreItem('BASEURL', `http://${linkText.trim()}`)
      const res= await httpPOST(
        `/api/method/login`,
        {
          usr: eemail,
          pwd: password,
        }
      )
 
        if(res.error !== undefined){

          Toast.show({
            type: 'error',
            position:"top",
            text1: `${res.error}👋`
          });
          setLoad(false)
        
        }
        else {
          console.log('abc', res)
          setLoad(false)
          login(true);
          }
        }
    }
  
    
  
  return (
    <>
      <View style={styles.container}>
      <View style={{ height: verticalScale(56.84) }} />
      <View
          style={{
            width: horizontalScale(120),
            height: horizontalScale(120),
            borderRadius: horizontalScale(120) / 2,
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
        <View style={{ height: verticalScale(24.35) }} />
       
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

        <Text
          allowFontScaling={false}
          style={{
            fontFamily: 'Proxima Nova',
            fontSize: moderateScale(20),
            color: PRIOR_FONT_COLOR,
            fontWeight: '700',
            textAlign: 'center',
            width: horizontalScale(337.5),
            alignSelf: 'center',
          }}>
          Login to your account
        </Text>
        <Input
            allowFontScaling={false}
            keyboardType="email-address"
            placeholder="Email"
            onChangeText={text => seteEmail(text)}
            containerStyle={{width: horizontalScale(330), alignSelf: 'center',marginTop:verticalScale(10)}}
            inputContainerStyle={{
              borderRadius: 8,
              borderColor: '#F4F4F4',
              borderWidth: 2,
              paddingLeft: 10,
              fontSize: moderateScale(16),
              marginTop: verticalScale(-1.5),
              color: '#3B3B3B',
              fontFamily: 'Proxima Nova',
              backgroundColor: 'white',
              shadowColor: '#000',
              shadowOffset: {
                width: 0,
                height: 9,
              },
              shadowOpacity: 0.48,
              shadowRadius: 11.95,
              elevation: 2,
            }}
            inputStyle={{
              fontSize: moderateScale(16),
              color: '#3B3B3B',
              fontFamily: 'Proxima Nova',
            }}
        
            leftIcon={
              <Icon
                name="email"
                type="material"
                color={SECONDARY_COLOR}
                size={moderateScale(16)}
              />
            }
        />
        
          <Input
            allowFontScaling={false}
            placeholder="Password"
            secureTextEntry={passwordSecureEntry}
            containerStyle={{width: horizontalScale(330), alignSelf: 'center'}}
            inputContainerStyle={{
              borderRadius: 8,
              borderColor: '#F4F4F4',
              borderWidth: 2,
              paddingLeft: 10,
              fontSize: moderateScale(16),
              marginTop: verticalScale(-1.5),
              color: '#3B3B3B',
              fontFamily: 'Proxima Nova',
              backgroundColor: 'white',
              shadowColor: '#000',
              shadowOffset: {
                width: 0,
                height: 9,
              },
              shadowOpacity: 0.48,
              shadowRadius: 11.95,
              elevation: 2,
            }}
            inputStyle={{
              fontSize: moderateScale(16),
              color: '#3B3B3B',
              fontFamily: 'Proxima Nova',
            }}
            leftIcon={
              <Icon
                name="lock"
                type="material"
                color={SECONDARY_COLOR}
                size={moderateScale(16)}
              />
            }
            onChangeText={text => setPassword(text)}

            rightIcon={
              <>
                {passwordSecureEntry ? (
                  <Icon
                    name="eye"
                    type="font-awesome-5"
                    color={SECONDARY_COLOR}
                    size={moderateScale(16)}
                    onPress={() => setPasswordSecureEntry(false)}
                  />
                ) : (
                  <Icon
                    name="eye-slash"
                    type="font-awesome-5"
                    color={SECONDARY_COLOR}
                    size={moderateScale(16)}
                    onPress={() => setPasswordSecureEntry(true)}
                  />
                )}
              </>
            }
            rightIconContainerStyle={{marginRight:horizontalScale(10)}}
        />
         <Input
            allowFontScaling={false}
            keyboardType="url"
          placeholder="Domain Link"
        value={linkText}
          onChangeText={text => {
            // if (text.length > 7) {
            //   setLinkText(linkText+text)
            //    }
            console.log(text)
              setLinkText(text)
            } }
            containerStyle={{width: horizontalScale(330), alignSelf: 'center',marginTop:verticalScale(10)}}
            inputContainerStyle={{
              borderRadius: 8,
              borderColor: '#F4F4F4',
              borderWidth: 2,
              paddingLeft: 10,
              fontSize: moderateScale(16),
              marginTop: verticalScale(-1.5),
              color: '#3B3B3B',
              fontFamily: 'Proxima Nova',
              backgroundColor: 'white',
              shadowColor: '#000',
              shadowOffset: {
                width: 0,
                height: 9,
              },
              shadowOpacity: 0.48,
              shadowRadius: 11.95,
              elevation: 2,
            }}
            inputStyle={{
              fontSize: moderateScale(16),
              color: '#3B3B3B',
              fontFamily: 'Proxima Nova',
            }}
          
           
            leftIcon={
              <Icon
                name="link"
                type="material"
                color={SECONDARY_COLOR}
                size={moderateScale(16)}
              />
            }
        />
       
       <TouchableOpacity
              style={{
                width: horizontalScale(265),
                height: verticalScale(50),
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: SECONDARY_COLOR,
                alignSelf: 'center',
              }}
              onPress={signIn}
             >
         
            <Text
              allowFontScaling={false}
              style={{
                color: 'white',
                fontSize: moderateScale(16),
                fontFamily: 'Proxima Nova',
                fontWeight:'700'
              }}>
              Login
            </Text>
       
        </TouchableOpacity>
   
      </View>
      {(load)?
            <View style={{backgroundColor:'rgba(0,0,0,0.4)',position:'absolute',top:0,bottom:0,left:0,right:0,alignItems:'center',justifyContent:'center'}}>
          <View style={{ width: horizontalScale(250), height: verticalScale(70),justifyContent:"center",alignItems:'center', borderRadius: 10, backgroundColor: PRIMARY_COLOR, borderColor: SECONDARY_COLOR, borderWidth: 1 }}>
           <View style={{flexDirection:'row'}}>
            <ActivityIndicator size={"large"} color={SECONDARY_COLOR} />
            <Text
        style={{
          fontFamily: 'Outfit-Regular',
          color: PRIOR_FONT_COLOR,
                  fontSize: moderateScale(25),
                  marginLeft: horizontalScale(10),
          alignSelf:'center'
        }}>
        Loading...
              </Text>
              </View>
               </View>
          </View>
          :
          null
      } 
    </>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BACKGROUND_COLOR,
  },
  logoImageSize: {
    width:horizontalScale(90),
    height:verticalScale(80),
    alignSelf: 'center',
  },
});
export default LoginScreen;
