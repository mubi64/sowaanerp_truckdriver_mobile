import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Icon } from '@rneui/base';
import moment from 'moment';
import { moderateScale } from '../../helpers/responsive';
import { SECONDARY_COLOR } from '../../assets/colors/colors';
import { styles } from '../../styles/common';
import { stopItemStyles } from '../../styles/components/stopItem.styles';

const NextStopItem = ({ nextStop, check, onToggleCheck, stopLength }) => {
  return (
    <View style={[stopItemStyles.timelineRow, styles.mt_5]}>
      <View style={styles.mt_5}>
        <View style={[stopItemStyles.dot, stopItemStyles.dotNext]} />
        {!stopLength &&
          <View style={stopItemStyles.lineContainer}>
            <View style={[stopItemStyles.line, stopItemStyles.lineNext]} />
          </View>
        }
      </View>
      <View style={[stopItemStyles.content, stopItemStyles.nextContent]}>
        <View style={stopItemStyles.header}>
          <View>
            <Text style={stopItemStyles.title}>
              {nextStop?.custom_address_name ||
                nextStop?.address ||
                'Next Stop'}
            </Text>
            <Text style={stopItemStyles.time}>
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
