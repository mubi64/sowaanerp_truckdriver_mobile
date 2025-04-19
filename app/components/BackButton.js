import React from 'react';
import { View } from 'react-native';
import { Icon } from '@rneui/base';
import {
  horizontalScale,
  verticalScale,
  moderateScale,
} from '../helpers/responsive';
import { SECONDARY_COLOR } from '../assets/colors/colors';

const BackButton = ({ onPress }) => (
  <View
    style={{
      backgroundColor: 'white',
      width: horizontalScale(50),
      height: horizontalScale(50),
      borderRadius: 15,
      justifyContent: 'center',
      alignItems: 'center',
      position: 'absolute',
      top: verticalScale(40),
      left: horizontalScale(15),
    }}>
    <Icon
      name="chevron-back-sharp"
      type="ionicon"
      size={moderateScale(26)}
      color={SECONDARY_COLOR}
      onPress={onPress}
    />
  </View>
);

export default BackButton;
