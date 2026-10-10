import { StyleSheet } from 'react-native';
import { horizontalScale, verticalScale } from '../../helpers/responsive';

export const backButtonStyles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    width: horizontalScale(50),
    height: horizontalScale(50),
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: verticalScale(40),
    left: horizontalScale(15),
  },
});
