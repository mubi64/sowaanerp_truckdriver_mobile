import { StyleSheet } from 'react-native';
import { BACKGROUND_COLOR, SECONDARY_COLOR } from '../../assets/colors/colors';
import {
  horizontalScale,
  verticalScale,
  moderateScale,
} from '../../helpers/responsive';

export const splashStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BACKGROUND_COLOR,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    width: horizontalScale(150),
    height: horizontalScale(150),
    borderRadius: horizontalScale(200),
    backgroundColor: 'white',
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 6,
  },
  logoImageSize: {
    width: 80,
    height: 80,
    alignSelf: 'center',
  },
  titleRow: {
    flexDirection: 'row',
    marginTop: horizontalScale(2),
    alignSelf: 'center',
  },
  title: {
    fontSize: moderateScale(30),
    color: SECONDARY_COLOR,
    fontFamily: 'Outfit-Regular',
    fontWeight: 'bold',
    marginTop: 5,
  },
  bottomSpacer: { height: verticalScale(24.36) },
});
