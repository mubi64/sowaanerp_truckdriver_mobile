import React, { useEffect, useState } from 'react';
import {
  View,
  Image,
  Text,
  ScrollView,
  Switch,
} from 'react-native';
import { StoreItem, GetItem } from '../async-storage/async-storage';
import { moderateScale } from '../helpers/responsive';
import { SECONDARY_COLOR } from '../assets/colors/colors';
import Toast from 'react-native-toast-message';
import { httpPOST } from '../network calls/networkCalls';
import { useAuth } from '../context/auth-context';
import Loading from '../components/Loading';
import { styles } from '../helpers/styles';
import PrimaryGradientButton from '../components/PrimaryGradientButton';
import { Icon, Input } from '@rneui/themed';

const LoginScreen = props => {
  const [passwordSecureEntry, setPasswordSecureEntry] = useState(true);
  const { login } = useAuth();
  const [eemail, seteEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);
  const [load, setLoad] = useState(false);
  const [linkText, setLinkText] = useState('');
  useEffect(() => {
    const fetchUrl = async () => {
      const BaseUrl = await GetItem('BASEURL');
      const email = await GetItem('EMAIL');
      const passwordStorage = await GetItem('PASSWORD');
      if (email !== null) {
        seteEmail(email);
        setRemember(true);
      }
      if (passwordStorage !== null) {
        setPassword(passwordStorage);
      }
      if (BaseUrl !== null) {
        setLinkText(BaseUrl.replace(/^http?:\/\//, ''));
      }
    };
    fetchUrl();
  }, []);

  const signIn = async () => {
    if (eemail === '' || password === '' || linkText === '') {
      Toast.show({
        type: 'error',
        position: 'top',
        text1: 'Fill all values 👋',
      });
    } else {
      setLoad(true);
      await StoreItem('BASEURL', `${linkText.trim()}`);
      if (remember) {
        await StoreItem('EMAIL', `${eemail.trim()}`);
        await StoreItem('PASSWORD', `${password.trim()}`);
      }
      const res = await httpPOST(`/api/method/login`, {
        usr: eemail,
        pwd: password,
      });
      // console.log(res, "REsponce data checking");
      if (res.error !== undefined) {
        Toast.show({
          type: 'error',
          position: 'top',
          text1: `${res.error} 👋`,
        });
        setLoad(false);
      } else {
        setLoad(false);
        login(res.full_name);
      }
    }
  };

  return (
    <ScrollView style={styles.backgroundColor}>
      <View style={styles.loginContainer}>
        <View style={styles.logoContainer}>
          <Image source={require('../assets/images/truck-load.png')} style={styles.logoImageSize} />
        </View>
        <Text style={styles.appTitle}>{'SowaanERP \n Driver App'}</Text>
        <Text style={styles.loginPrompt}>Login to your account</Text>
        <View style={{ height: 20 }} />
        <Input
          allowFontScaling={false}
          keyboardType="url"
          placeholder="https://erp.sowaan.com"
          value={linkText}
          onChangeText={text => setLinkText(text)}
          containerStyle={styles.inputContainer}
          inputContainerStyle={styles.inputStyle}
          leftIcon={
            <Icon name="link" type="material" color={SECONDARY_COLOR} size={moderateScale(20)} />
          }
        />
        <Input
          keyboardType="email-address"
          placeholder="Email"
          value={eemail}
          onChangeText={text => seteEmail(text)}
          containerStyle={styles.inputContainer}
          inputContainerStyle={styles.inputStyle}
          leftIcon={<Icon name="mail" color={SECONDARY_COLOR} size={moderateScale(20)} />}
        />
        <Input
          placeholder="Password"
          secureTextEntry={passwordSecureEntry}
          containerStyle={styles.inputContainer}
          inputContainerStyle={styles.inputStyle}
          leftIcon={<Icon name="lock" type="material" color={SECONDARY_COLOR} size={moderateScale(20)} />}
          value={password}
          onChangeText={text => setPassword(text)}
          rightIcon={
            <Icon
              reverse
              name={passwordSecureEntry ? 'eye' : 'eye-slash'}
              type="font-awesome-5"
              color={SECONDARY_COLOR}
              size={moderateScale(16)}
              onPress={() => setPasswordSecureEntry(!passwordSecureEntry)}
            />
          }
        />
        <View style={[styles.row, styles.flex_1, styles.itemCenter, styles.inputContainer, styles.flexEnd]}>
          <Text style={styles.rememberMeText}>Remember me</Text>
          <Switch
            value={remember}
            onValueChange={() => setRemember(!remember)}
            trackColor={{ false: '#767577', true: '#81b0ff' }}
            thumbColor={remember ? '#f4f3f4' : '#f4f3f4'}
            ios_backgroundColor="#3e3e3e"
          />
        </View>
        <PrimaryGradientButton onPress={signIn} text="Login" />
      </View>
      {load && (
        <Loading />
      )}
    </ScrollView>
  );
};

export default LoginScreen;
