import React from 'react';
import { View } from 'react-native';
import { Icon } from '@rneui/base';
import { moderateScale } from '../helpers/responsive';
import { SECONDARY_COLOR } from '../assets/colors/colors';
import { backButtonStyles } from '../styles/components/backButton.styles';

const BackButton = ({ onPress }) => (
  <View style={backButtonStyles.container}>
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
