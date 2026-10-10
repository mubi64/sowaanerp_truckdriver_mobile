import React from 'react';
import { View, Text } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useAuth } from '../context/auth-context';
import { styles } from '../styles/common';
import { profileStyles } from '../styles/screens/profile.styles';
import { moderateScale } from '../helpers/responsive';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Avatar } from 'react-native-elements';

const ProfileScreen = () => {
  const { employee, logout } = useAuth();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.container}>
        {/* Profile Header */}
        <Text style={profileStyles.header}>
          Profile
        </Text>

        {/* Profile Card */}
        <View style={profileStyles.card}>
          <Avatar
            source={require('./../assets/images/driver_dp.png')}
            size={moderateScale(100)}
            rounded
          />
          <Text style={profileStyles.name}>
            {employee?.first_name || 'Driver Name'}
          </Text>
          <Text style={profileStyles.designation}>
            {employee?.designation || 'Designation'}
          </Text>
        </View>
        <View style={profileStyles.infoContainer} >
          <Text style={profileStyles.infoText}>Name: {employee?.employee_name}</Text>
          <Text style={profileStyles.infoText}>DOB: {employee?.date_of_birth}</Text>
        </View>

        {/* Logout Button */}

      </View>
      <TouchableOpacity onPress={logout} style={profileStyles.logoutPosition}>
        <View style={profileStyles.logoutButton}>
          <Text style={profileStyles.logoutText}>
            Log out
          </Text>
        </View>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default ProfileScreen;
