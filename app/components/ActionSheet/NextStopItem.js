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

const NextStopItem = ({ nextStop, check, onToggleCheck, stopLength }) => {
  return (
    <View
      style={{
        width: horizontalScale(345),
        alignSelf: 'center',
        flexDirection: 'row',
        marginTop: verticalScale(5),
      }}>
      <View style={{ marginTop: verticalScale(5) }}>
        <View style={{ width: horizontalScale(12), height: horizontalScale(12), borderRadius: horizontalScale(12) / 2, borderColor: SECONDARY_COLOR, borderWidth: 2 }} />
        {!stopLength &&
          <View style={{ width: horizontalScale(12) }}>
            <View style={{ width: horizontalScale(0.5), height: verticalScale(40), borderWidth: 0.5, borderStyle: 'dashed', borderColor: SECONDARY_COLOR, alignSelf: 'center', marginTop: verticalScale(5) }} />
          </View>
        }
      </View>
      <View
        style={{
          marginLeft: horizontalScale(10),
          marginTop: verticalScale(-5),
        }}>
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
              {nextStop?.custom_address_name ||
                nextStop?.address ||
                'Next Stop'}
            </Text>
            <Text
              style={{
                fontFamily: 'Outfit-Regular',
                color: LOW_PRIOR_FONT_COLOR,
                fontSize: moderateScale(15),
              }}>
              {moment(nextStop?.estimated_arrival).format('MMM D HH:mm')}
            </Text>
          </View>
          <Icon
            name={check ? 'checksquare' : 'square'}
            color={SECONDARY_COLOR}
            type={check ? 'antdesign' : 'feather'}
            size={moderateScale(25)}
            onPress={onToggleCheck}
          />
        </View>
      </View>
    </View>
  );
};

export default NextStopItem;
