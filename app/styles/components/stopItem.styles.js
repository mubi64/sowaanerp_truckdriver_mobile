import { StyleSheet } from 'react-native';
import {
  PRIOR_FONT_COLOR,
  LOW_PRIOR_FONT_COLOR,
  SECONDARY_COLOR,
} from '../../assets/colors/colors';
import {
  horizontalScale,
  verticalScale,
  moderateScale,
} from '../../helpers/responsive';

// Shared by the route timeline in DetailsScreen, NextStopItem and VisitedStopItem
export const stopItemStyles = StyleSheet.create({
  timelineRow: {
    width: horizontalScale(345),
    alignSelf: 'center',
    flexDirection: 'row',
  },
  // Timeline dot + dashed connector
  dot: {
    width: horizontalScale(12),
    height: horizontalScale(12),
    borderRadius: horizontalScale(12) / 2,
    borderWidth: 2,
  },
  dotVisited: { borderColor: LOW_PRIOR_FONT_COLOR },
  dotNext: { borderColor: SECONDARY_COLOR },
  lineContainer: { width: horizontalScale(12) },
  line: {
    width: horizontalScale(0.5),
    height: verticalScale(40),
    borderWidth: 0.5,
    borderStyle: 'dashed',
    alignSelf: 'center',
    marginTop: verticalScale(5),
  },
  lineVisited: { borderColor: LOW_PRIOR_FONT_COLOR },
  lineNext: { borderColor: SECONDARY_COLOR },
  // Stop content
  content: { marginLeft: horizontalScale(10) },
  nextContent: { marginTop: verticalScale(-5) },
  header: {
    width: horizontalScale(300),
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  title: {
    fontFamily: 'Outfit-Medium',
    color: PRIOR_FONT_COLOR,
    fontSize: moderateScale(20),
  },
  time: {
    fontFamily: 'Outfit-Regular',
    color: LOW_PRIOR_FONT_COLOR,
    fontSize: moderateScale(15),
  },
  spacer: { height: verticalScale(22) },
});
