import React from 'react';
import { View, Text, Platform } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useAuth } from '../context/auth-context';
import { styles } from '../helpers/styles';
import {
  horizontalScale,
  moderateScale,
  verticalScale,
} from '../helpers/responsive';
import {
  PRIOR_FONT_COLOR,
  PRIMARY_COLOR,
  LOW_PRIOR_FONT_COLOR,
} from '../assets/colors/colors';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Avatar } from 'react-native-elements';

const ProfileScreen = () => {
  const { employee, logout } = useAuth();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.container}>
        {/* Profile Header */}
        <Text
          style={{
            fontSize: moderateScale(30),
            fontFamily: 'Outfit-Medium',
            color: PRIOR_FONT_COLOR,
            marginLeft: horizontalScale(24),
          }}>
          Profile
        </Text>

        {/* Profile Card */}
        <View
          style={{
            backgroundColor: PRIMARY_COLOR,
            width: horizontalScale(325),
            height: verticalScale(200),
            alignSelf: 'center',
            marginTop: verticalScale(20),
            borderRadius: moderateScale(16),
            justifyContent: 'center',
            alignItems: 'center',
            ...Platform.select({
              ios: {
                shadowColor: '#AFAFAF',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.2,
                shadowRadius: 4,
              },
              android: {
                elevation: 4,
              },
            }),
          }}>
          <Avatar
            source={require('./../assets/images/driver_dp.png')}
            size={moderateScale(100)}
            rounded
          />
          <Text
            style={{
              fontSize: moderateScale(26),
              fontFamily: 'Outfit-Regular',
              color: PRIOR_FONT_COLOR,
              marginTop: verticalScale(16),
            }}>
            {employee?.first_name || 'Driver Name'}
          </Text>
          <Text
            style={{
              fontSize: moderateScale(18),
              fontFamily: 'Outfit-Regular',
              color: LOW_PRIOR_FONT_COLOR,
              marginTop: verticalScale(4),
            }}>
            {employee?.designation || 'Designation'}
          </Text>
        </View>
        <View style={{margin: 20}} >
          <Text style={{padding: 6, fontSize: 16, fontWeight: 'bold'}}>Name: {employee?.employee_name}</Text>
          <Text style={{padding: 6, fontSize: 16, fontWeight: 'bold'}}>DOB: {employee?.date_of_birth}</Text>
        </View>

        {/* Logout Button */}

      </View>
      <TouchableOpacity onPress={logout} style={{
        position: 'absolute',
        right: horizontalScale(20),
        bottom: verticalScale(20),
      }}>
        <View
          style={{
            width: horizontalScale(110),
            height: verticalScale(50),
            borderRadius: moderateScale(25),
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'red',
          }}>
          <Text
            style={{
              fontSize: moderateScale(16),
              fontFamily: 'Outfit-Regular',
              color: PRIMARY_COLOR,
            }}>
            Log out
          </Text>
        </View>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default ProfileScreen;
