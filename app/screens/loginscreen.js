import React, { useEffect, useState } from 'react';
import {
  View,
  Image,
  Text,
  ScrollView,
  Switch,
} from 'react-native';
import { StoreItem, GetItem, DeleteItem } from '../async-storage/async-storage';
import { moderateScale } from '../helpers/responsive';
import { LOW_PRIOR_FONT_COLOR, SECONDARY_COLOR } from '../assets/colors/colors';
import Toast from 'react-native-toast-message';
import { httpPOST } from '../network calls/networkCalls';
import { useAuth } from '../context/auth-context';
import Loading from '../components/Loading';
import { loginStyles, loginColors } from '../styles/screens/login.styles';
import PrimaryGradientButton from '../components/PrimaryGradientButton';
import { Icon, Input } from '@rneui/themed';

const ICON_SIZE = moderateScale(20);

// Shared props for every form field so they stay visually identical
const fieldProps = {
  containerStyle: loginStyles.inputContainer,
  inputContainerStyle: loginStyles.inputField,
  inputStyle: loginStyles.inputText,
  leftIconContainerStyle: loginStyles.leftIcon,
  placeholderTextColor: loginColors.placeholder,
  selectionColor: SECONDARY_COLOR,
  renderErrorMessage: false,
  autoCapitalize: 'none',
  autoCorrect: false,
};

const SWITCH_TRACK = { false: loginColors.switchTrackOff, true: SECONDARY_COLOR };

const FieldIcon = ({ name }) => (
  <Icon name={name} type="ionicon" color={SECONDARY_COLOR} size={ICON_SIZE} />
);

const LoginScreen = () => {
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
      } else {
        await DeleteItem('EMAIL');
        await DeleteItem('PASSWORD');
      }
      const res = await httpPOST('/api/method/login', {
        usr: eemail,
        pwd: password,
      });
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
    <ScrollView
      style={loginStyles.screen}
      contentContainerStyle={loginStyles.scrollContent}
      keyboardShouldPersistTaps="handled">
      <View style={loginStyles.content}>
        <View style={loginStyles.logoContainer}>
          <Image
            source={require('../assets/images/truck-load.png')}
            style={loginStyles.logoImage}
            resizeMode="contain"
          />
        </View>
        <Text style={loginStyles.appTitle}>SowaanERP</Text>
        <Text style={loginStyles.appSubtitle}>Driver App</Text>
        <Text style={loginStyles.loginPrompt}>Login to your account</Text>
        <Input
          {...fieldProps}
          allowFontScaling={false}
          keyboardType="url"
          textContentType="URL"
          placeholder="https://erp.sowaan.com"
          value={linkText}
          onChangeText={text => setLinkText(text)}
          leftIcon={<FieldIcon name="globe-outline" />}
        />
        <Input
          {...fieldProps}
          keyboardType="email-address"
          textContentType="emailAddress"
          placeholder="Email"
          value={eemail}
          onChangeText={text => seteEmail(text)}
          leftIcon={<FieldIcon name="mail-outline" />}
        />
        <Input
          {...fieldProps}
          placeholder="Password"
          textContentType="password"
          secureTextEntry={passwordSecureEntry}
          value={password}
          onChangeText={text => setPassword(text)}
          leftIcon={<FieldIcon name="lock-closed-outline" />}
          rightIcon={
            <Icon
              name={passwordSecureEntry ? 'eye-outline' : 'eye-off-outline'}
              type="ionicon"
              color={LOW_PRIOR_FONT_COLOR}
              size={ICON_SIZE}
              onPress={() => setPasswordSecureEntry(!passwordSecureEntry)}
            />
          }
        />
        <View style={loginStyles.rememberRow}>
          <Text style={loginStyles.rememberText}>Remember me</Text>
          <Switch
            style={loginStyles.rememberSwitch}
            value={remember}
            onValueChange={() => setRemember(!remember)}
            trackColor={SWITCH_TRACK}
            thumbColor="#ffffff"
            ios_backgroundColor={loginColors.switchTrackOff}
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
