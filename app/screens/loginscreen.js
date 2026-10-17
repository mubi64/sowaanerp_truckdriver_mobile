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
import { httpPOST, normalizeBaseUrl } from '../network calls/networkCalls';
import { useAuth } from '../context/auth-context';
import Loading from '../components/Loading';
import { loginStyles, loginColors } from '../styles/screens/login.styles';
import PrimaryGradientButton from '../components/PrimaryGradientButton';
import { Icon, Input } from '@rneui/themed';

const ICON_SIZE = moderateScale(20);
const VALID_URL = /^https?:\/\/[^\s/]+\.[^\s/]+/i;

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
        setLinkText(normalizeBaseUrl(BaseUrl));
      }
    };
    fetchUrl();
  }, []);

  const showError = (message, title = 'Login failed') => {
    Toast.show({ type: 'error', position: 'top', text1: title, text2: message });
  };

  // Returns a message for the first invalid field, or '' when the form is valid
  const validate = (baseUrl) => {
    if (!linkText.trim()) {
      return 'Enter your server URL, e.g. https://erp.sowaan.com';
    }
    if (!VALID_URL.test(baseUrl)) {
      return 'Enter a valid server URL, e.g. https://erp.sowaan.com';
    }
    if (!eemail.trim()) {
      return 'Enter your email.';
    }
    if (!password) {
      return 'Enter your password.';
    }
    return '';
  };

  const signIn = async () => {
    const baseUrl = normalizeBaseUrl(linkText);
    const validationError = validate(baseUrl);
    if (validationError) {
      showError(validationError, 'Missing details');
      return;
    }

    setLoad(true);
    setLinkText(baseUrl);
    await StoreItem('BASEURL', baseUrl);
    if (remember) {
      await StoreItem('EMAIL', eemail.trim());
      await StoreItem('PASSWORD', password);
    } else {
      await DeleteItem('EMAIL');
      await DeleteItem('PASSWORD');
    }

    const res = await httpPOST('/api/method/login', {
      usr: eemail.trim(),
      pwd: password,
    });
    if (res.error) {
      setLoad(false);
      showError(res.status === 401 ? 'Incorrect email or password. Please try again.' : res.error);
      return;
    }

    const result = await login(res.full_name);
    setLoad(false);
    if (result.error) {
      showError(result.error);
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
