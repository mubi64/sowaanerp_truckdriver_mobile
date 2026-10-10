import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Icon } from '@rneui/base';
import moment from 'moment';
import { moderateScale } from '../../helpers/responsive';
import { SECONDARY_COLOR } from '../../assets/colors/colors';
import { stopItemStyles } from '../../styles/components/stopItem.styles';

const VisitedStopItem = ({ item }) => {
  return (
    <View style={stopItemStyles.content}>
      <TouchableOpacity onPress={() => console.log("Heelo")
      }>
        <View style={stopItemStyles.header}>
          <View>
            <Text style={stopItemStyles.title}>
              {item?.custom_address_name || item?.address}
            </Text>
            <Text style={stopItemStyles.time}>
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
        <View style={stopItemStyles.spacer} />
      </TouchableOpacity>
    </View>
  );
};

export default VisitedStopItem;
