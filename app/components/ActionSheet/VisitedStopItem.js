import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Icon } from '@rneui/base';
import moment from 'moment';
import {
  horizontalScale,
  verticalScale,
  moderateScale,
} from '../../helpers/responsive';
import {
  PRIOR_FONT_COLOR,
  LOW_PRIOR_FONT_COLOR,
  SECONDARY_COLOR,
} from '../../assets/colors/colors';

const VisitedStopItem = ({ item }) => {
  return (
    <View style={{ marginLeft: horizontalScale(10) }}>
      <TouchableOpacity onPress={() => console.log("Heelo")
      }>
        <View
          style={{
            width: horizontalScale(300),
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}>
          <View>
            <Text
              style={{
                fontFamily: 'Outfit-Medium',
                color: PRIOR_FONT_COLOR,
                fontSize: moderateScale(20),
              }}>
              {item?.custom_address_name || item?.address}
            </Text>
            <Text
              style={{
                fontFamily: 'Outfit-Regular',
                color: LOW_PRIOR_FONT_COLOR,
                fontSize: moderateScale(15),
              }}>
              {moment(item?.estimated_arrival).format('MMM D HH:mm')}
            </Text>
          </View>
          <Icon
            name="checksquare"
            color={SECONDARY_COLOR}
            type="antdesign"
            size={moderateScale(25)}
          />
        </View>
        <View style={{ height: verticalScale(22) }} />
      </TouchableOpacity>
    </View>
  );
};

export default VisitedStopItem;
