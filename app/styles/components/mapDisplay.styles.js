import { StyleSheet } from 'react-native';
import { PRIOR_FONT_COLOR } from '../../assets/colors/colors';
import {
  horizontalScale,
  moderateScale,
  verticalScale,
} from '../../helpers/responsive';

export const mapDisplayStyles = StyleSheet.create({
  map: { flex: 1 },
  callout: { height: verticalScale(50), width: horizontalScale(50) },
  calloutText: { color: PRIOR_FONT_COLOR, fontSize: moderateScale(16) },
});
