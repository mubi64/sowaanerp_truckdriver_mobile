import { StyleSheet, Platform } from 'react-native';
import {
  PRIOR_FONT_COLOR,
  PRIMARY_COLOR,
  LOW_PRIOR_FONT_COLOR,
} from '../../assets/colors/colors';
import {
  horizontalScale,
  moderateScale,
  verticalScale,
} from '../../helpers/responsive';

export const profileStyles = StyleSheet.create({
  header: {
    fontSize: moderateScale(30),
    fontFamily: 'Outfit-Medium',
    color: PRIOR_FONT_COLOR,
    marginLeft: horizontalScale(24),
  },
  card: {
    backgroundColor: PRIMARY_COLOR,
    width: horizontalScale(325),
    height: verticalScale(200),
    alignSelf: 'center',
    marginTop: verticalScale(20),
    borderRadius: moderateScale(16),
    justifyContent: 'center',
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#AFAFAF',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  name: {
    fontSize: moderateScale(26),
    fontFamily: 'Outfit-Regular',
    color: PRIOR_FONT_COLOR,
    marginTop: verticalScale(16),
  },
  designation: {
    fontSize: moderateScale(18),
    fontFamily: 'Outfit-Regular',
    color: LOW_PRIOR_FONT_COLOR,
    marginTop: verticalScale(4),
  },
  infoContainer: { margin: 20 },
  infoText: { padding: 6, fontSize: 16, fontWeight: 'bold' },
  logoutPosition: {
    position: 'absolute',
    right: horizontalScale(20),
    bottom: verticalScale(20),
  },
  logoutButton: {
    width: horizontalScale(110),
    height: verticalScale(50),
    borderRadius: moderateScale(25),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'red',
  },
  logoutText: {
    fontSize: moderateScale(16),
    fontFamily: 'Outfit-Regular',
    color: PRIMARY_COLOR,
  },
});
