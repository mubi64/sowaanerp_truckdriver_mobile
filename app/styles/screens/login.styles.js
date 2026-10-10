import { StyleSheet, Platform } from 'react-native';
import {
  BACKGROUND_COLOR,
  LOW_PRIOR_FONT_COLOR,
  PRIOR_FONT_COLOR,
  SECONDARY_COLOR,
} from '../../assets/colors/colors';
import {
  horizontalScale,
  moderateScale,
  verticalScale,
} from '../../helpers/responsive';

const FORM_WIDTH = horizontalScale(320); // matches PrimaryGradientButton width
const BORDER_COLOR = '#E4E4E4';
// iOS 26+ draws UISwitch ~12pt wider than the 51pt box React Native lays out
const SWITCH_OVERFLOW = Platform.OS === 'ios' && parseInt(Platform.Version, 10) >= 26 ? 12 : 0;

export const loginStyles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: BACKGROUND_COLOR },
  scrollContent: { flexGrow: 1 },
  content: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: verticalScale(80),
  },
  // Branding
  logoContainer: {
    width: horizontalScale(120),
    height: horizontalScale(120),
    borderRadius: horizontalScale(60),
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: verticalScale(20),
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 12,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  logoImage: {
    width: horizontalScale(92),
    height: horizontalScale(92),
  },
  appTitle: {
    fontFamily: 'Outfit-Bold',
    fontSize: moderateScale(30),
    color: SECONDARY_COLOR,
    textAlign: 'center',
  },
  appSubtitle: {
    fontFamily: 'Outfit-SemiBold',
    fontSize: moderateScale(24),
    color: PRIOR_FONT_COLOR,
    textAlign: 'center',
  },
  loginPrompt: {
    fontFamily: 'Outfit-Regular',
    fontSize: moderateScale(16),
    color: LOW_PRIOR_FONT_COLOR,
    textAlign: 'center',
    marginTop: verticalScale(8),
    marginBottom: verticalScale(28),
  },
  // Form fields (@rneui Input)
  inputContainer: {
    width: FORM_WIDTH,
    paddingHorizontal: 0,
    marginBottom: verticalScale(14),
  },
  inputField: {
    height: verticalScale(52),
    borderWidth: 1,
    borderBottomWidth: 1,
    borderColor: BORDER_COLOR,
    borderRadius: 8,
    backgroundColor: 'white',
    paddingHorizontal: 14,
  },
  inputText: {
    fontFamily: 'Outfit-Regular',
    fontSize: moderateScale(16),
    color: PRIOR_FONT_COLOR,
  },
  leftIcon: { marginRight: 6 },
  // Remember me
  rememberRow: {
    width: FORM_WIDTH,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginTop: verticalScale(2),
    marginBottom: verticalScale(24),
  },
  rememberText: {
    fontFamily: 'Outfit-Regular',
    fontSize: moderateScale(15),
    color: PRIOR_FONT_COLOR,
    marginRight: 10,
  },
  rememberSwitch: { marginRight: SWITCH_OVERFLOW },
});

export const loginColors = {
  placeholder: '#A0A0A0',
  switchTrackOff: '#D9D9D9',
};
