import React from 'react';
import { View, Text } from 'react-native';
import { horizontalScale, moderateScale, verticalScale } from '../helpers/responsive';
import { Avatar } from '@rneui/base';
import { SECONDARY_COLOR,BACKGROUND_COLOR, PRIOR_FONT_COLOR, PRIMARY_COLOR, LOW_PRIOR_FONT_COLOR } from '../assets/colors/colors';
import { TouchableOpacity } from 'react-native-gesture-handler';
const ProfileScreen = () => {
    return (
        <>
        <View style={{flex:1,backgroundColor:BACKGROUND_COLOR}}>
            <Text style={{fontSize:moderateScale(30),fontFamily:'Outfit-Medium',color:PRIOR_FONT_COLOR,marginTop:verticalScale(20),marginLeft:horizontalScale(10)}}>
                Profile
            </Text>
            <View style={{
                backgroundColor: PRIMARY_COLOR, width: horizontalScale(325), height: verticalScale(200), alignSelf: 'center', marginTop: verticalScale(20), ...Platform.select({
                    ios: {
                        shadowColor: '#AFAFAF',
                        shadowOffset: { width: 0, height: 2 },
                        shadowOpacity: 0.2,
                        shadowRadius: 4,
                    },
                    android: {
                        elevation: 4,
                    }
                }),borderRadius: moderateScale(16), justifyContent: 'center', alignItems: 'center' }}>
                <Avatar
                    source={{ uri: 'https://img.freepik.com/free-vector/businessman-character-avatar-isolated_24877-60111.jpg?w=2000' }} 
                    size={moderateScale(80)}
                rounded    
               /> 
                 <Text style={{fontSize:moderateScale(30),fontFamily:'Outfit-Regular',color:PRIOR_FONT_COLOR,marginTop:verticalScale(20)}}>
                 Driver Name
                </Text>
                <Text style={{fontSize:moderateScale(20),fontFamily:'Outfit-Regular',color:LOW_PRIOR_FONT_COLOR,marginTop:verticalScale(5)}}>
                 Driver
            </Text>
            </View>
       
        </View>
             <TouchableOpacity
             style={{width:horizontalScale(110),height:verticalScale(50),borderRadius:moderateScale(25),justifyContent:'center',alignItems:'center',backgroundColor:'red',position:'absolute',right:20,bottom:10}}
             >
 
             </TouchableOpacity>
        </>
    )
}


export default ProfileScreen