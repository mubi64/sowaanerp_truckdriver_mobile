import { StyleSheet } from 'react-native';
import {
  LOW_PRIOR_FONT_COLOR,
  PRIMARY_COLOR,
  PRIOR_FONT_COLOR,
  LIGHT_GREY,
} from '../../assets/colors/colors';
import {
  horizontalScale,
  verticalScale,
  moderateScale,
} from '../../helpers/responsive';

export const detailsStyles = StyleSheet.create({
  container: { flex: 1, backgroundColor: PRIMARY_COLOR },
  // Bottom action sheet (its `bottom` is animated and applied inline)
  actionSheet: {
    width: horizontalScale(375),
    height: verticalScale(665.4),
    position: 'absolute',
  },
  sheetHeader: {
    backgroundColor: PRIMARY_COLOR,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    height: verticalScale(146.16),
  },
  dragHandle: {
    width: horizontalScale(56.25),
    height: verticalScale(4),
    marginTop: verticalScale(10),
    borderRadius: 15,
    alignSelf: 'center',
    backgroundColor: LIGHT_GREY,
  },
  spacer15: { height: verticalScale(15) },
  spacer17: { height: verticalScale(17) },
  spacer25: { height: verticalScale(25) },
  summaryRow: {
    width: horizontalScale(310),
    height: verticalScale(100),
    alignSelf: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  summaryText: {
    fontFamily: 'Outfit-Medium',
    fontSize: moderateScale(20),
    color: PRIOR_FONT_COLOR,
    fontWeight: '700',
    marginTop: verticalScale(2),
  },
  summaryDistance: { letterSpacing: horizontalScale(1) },
  summarySubText: {
    fontFamily: 'Outfit-Medium',
    fontSize: moderateScale(16),
    color: LOW_PRIOR_FONT_COLOR,
    fontWeight: '700',
    marginTop: verticalScale(2),
  },
  divider: {
    width: horizontalScale(375),
    borderWidth: 1,
    borderColor: LIGHT_GREY,
  },
  scrollContent: { backgroundColor: 'white' },
  routePanel: {
    height: verticalScale(519.5),
    width: horizontalScale(375),
    backgroundColor: PRIMARY_COLOR,
  },
  routeTitle: {
    fontFamily: 'Outfit-Medium',
    color: PRIOR_FONT_COLOR,
    fontSize: moderateScale(25),
    marginLeft: horizontalScale(25),
  },
  routeList: {
    width: horizontalScale(375),
    alignSelf: 'center',
    height: verticalScale(230),
    backgroundColor: 'white',
    marginTop: verticalScale(5),
  },
  nextButtonContainer: {
    position: 'absolute',
    bottom: verticalScale(10),
    marginHorizontal: 30,
  },
});
