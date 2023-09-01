import React from 'react';
import {View, Text, FlatList, Image,RefreshControl,TouchableOpacity,ActivityIndicator} from 'react-native';
import {
  BACKGROUND_COLOR,
  LOW_PRIOR_FONT_COLOR,
  PRIMARY_COLOR,
  PRIOR_FONT_COLOR,
  SECONDARY_COLOR,
} from '../assets/colors/colors';
import moment from 'moment';
import {
  horizontalScale,
  verticalScale,
  moderateScale,
} from '../helpers/responsive';
import { useAuth } from '../context/auth-context';
import CalendarStrip from 'react-native-calendar-strip';
import {Icon} from '@rneui/base';
import {TextInput} from 'react-native';
import { httpPOST, httpGet } from '../network calls/networkCalls';
import { Toast } from 'react-native-toast-message/lib/src/Toast';
const maxDate = new Date();
const theDayOfTheMonthOnNextWeek = maxDate.getDate() + 7;
const theDayOfTheMonthOnTodayWeek = maxDate.getDate();
const LastOrder = (props) => {

  const [dataArray, setDataArray] = React.useState([])
  const [refresh, setRefresh] = React.useState(false)
  
  const { user, logout, login } = useAuth();
  const [load,setLoad] = React.useState(true)
  React.useEffect(() => {
    getDeliveryTrip();
  }, [])
  const getDeliveryTrip = async () => {
    setLoad(true)
    const getTripsResponse = await httpGet(`/api/resource/Delivery Trip?limit_page_length=5000&fields=["*"]&filters=[["docstatus","=",1],["status","=","Completed"]]`)
    if (getTripsResponse.error != undefined) {
      Toast.show({
        type: 'error',
        position:"top",
        text1: `${getTripsResponse.error}👋`
      });
      setRefresh(false)
         setLoad(false)
    }
    else {
      console.log('suuceess',JSON.stringify(getTripsResponse.data,null,2))
      setDataArray(getTripsResponse.data)
      setRefresh(false)
      setLoad(false)
    }
  }
  const getDeliveryTripByDate = async (date) => {
    setLoad(true)
   const getTripsResponse = await httpGet(`/api/resource/Delivery Trip?limit_page_length=5000&fields=["*"]&filters=[["docstatus","=",1],["status","=","Completed"],["departure_time","between",["${date}","${date}"]]]`)
   if (getTripsResponse.error != undefined) {
     Toast.show({
       type: 'error',
       position:"top",
       text1: `${getTripsResponse.error}👋`
     });
     setRefresh(false)
        setLoad(false)
   }
   else {
     console.log('suuceess',JSON.stringify(getTripsResponse.data,null,2))
     setDataArray(getTripsResponse.data)
     setRefresh(false)
     setLoad(false)
   }
 }

  return (
    <>
    <View style={{flex: 1, backgroundColor: BACKGROUND_COLOR}}>
      <View
        style={{
          width: horizontalScale(375),
          height: verticalScale(170),
          backgroundColor: 'white',
        }}>
        <View
          style={{
            height: verticalScale(40),
          }}
        />
        <View
          style={{
            width: horizontalScale(335),
            height: verticalScale(50),
            alignSelf: 'center',
            justifyContent: 'space-between',
            flexDirection: 'row',
          }}>
          <View style={{flexDirection: 'row'}}>
            <Text
              style={{
                fontFamily: 'Outfit-Bold',
                color: PRIOR_FONT_COLOR,
                fontSize: moderateScale(35),
                alignSelf: 'center',
              }}>
              List{' '}
            </Text>
            <Text
              style={{
                fontFamily: 'Outfit-Regular',
                color: PRIOR_FONT_COLOR,
                fontSize: moderateScale(35),
                alignSelf: 'center',
              }}>
              of past orders
            </Text>
          </View>
          <Text
            style={{
              fontFamily: 'Outfit-Regular',
              color: SECONDARY_COLOR,
              fontSize: moderateScale(16),
              alignSelf: 'center',
            }}>
            Sort
          </Text>
        </View>
        <View
          style={{
            height: verticalScale(10),
          }}
        />

        <CalendarStrip
          scrollable
          iconLeft={null}
          iconRight={null}
          style={{height: verticalScale(50), width: horizontalScale(380)}}
            onDateSelected={(date) => {
              getDeliveryTripByDate(moment(date).format('DD-MM-YYYY'))
              
          }
          
      }
          //minDate={minDate.setDate(theDayOfTheMonthOnTodayWeek)}
          maxDate={maxDate.setDate(theDayOfTheMonthOnTodayWeek)}
          calendarColor={PRIMARY_COLOR}
          calendarHeaderStyle={{height: 0}}
          dateNumberStyle={{
            color: LOW_PRIOR_FONT_COLOR,
            fontSize: moderateScale(20),
            fontFamily: 'Outfit-SemiBold',
          }}
          dateNameStyle={{
            color: PRIOR_FONT_COLOR,
            fontSize: moderateScale(16),
            fontFamily: 'Outfit-Regular',
          }}
          highlightDateNameStyle={{
            color: SECONDARY_COLOR,
            fontSize: moderateScale(16),
            fontFamily: 'Outfit-Regular',
          }}
          highlightDateNumberStyle={{
            color: SECONDARY_COLOR,
            fontSize: moderateScale(20),
            fontFamily: 'Outfit-SemiBold',
          }}
        />
      </View>
      <View
        style={{
          height: verticalScale(30),
        }}
      />
      <View
        style={{
          width: horizontalScale(325),
          alignSelf: 'center',
          height: verticalScale(50),
          flexDirection: 'row',
          backgroundColor: 'white',
        }}>
        <Icon
          name="search1"
          color={PRIOR_FONT_COLOR}
          type="antdesign"
          containerStyle={{
            alignSelf: 'center',
            marginLeft: horizontalScale(10),
          }}
          size={moderateScale(26)}
        />
        <TextInput
          style={{
            width: horizontalScale(270),
            alignSelf: 'center',
            height: verticalScale(45),
            fontSize: moderateScale(20),
            marginLeft: horizontalScale(10),
            color: PRIOR_FONT_COLOR,
          }}
          placeholderTextColor={PRIOR_FONT_COLOR}
          placeholder="All Loads Near You"
        />
      </View>
      <View
        style={{
          height: verticalScale(25),
        }}
      />
      <Text
        style={{
          fontFamily: 'Outfit-Medium',
          color: PRIOR_FONT_COLOR,
          fontSize: moderateScale(35),
          marginLeft: horizontalScale(15),
        }}>
        Today
      </Text>
      <View
        style={{
          height: verticalScale(15),
        }}
      />
          {(load === false && dataArray.length > 0) ?
               <FlatList
               data={dataArray}
               refreshControl={
                 <RefreshControl
                     refreshing={refresh}
                    onRefresh={() => {
                     setRefresh(true)
                      getDeliveryTrip();
                     }} 
                 />
             }
               // onRefresh={() => {
               //   getDeliveryTrip();
               // }}
                     renderItem={({ item ,index}) => {
                         return (
                           <TouchableOpacity
                           style={{
                             width: horizontalScale(375),
                             alignSelf: 'center',
                             height: verticalScale(230),
                                     backgroundColor: 'white',
                            marginTop:(index>0)?verticalScale(20):null
                             }}
                             onPress={() => {
                               props.navigation.navigate('Details', {
                               data:item.name
                             })
                           }}
                           >
                           <View
                             style={{
                               height: verticalScale(15),
                             }}
                           />
                           <View
                             style={{
                               width: horizontalScale(315),
                               alignSelf: 'center',
                               height: verticalScale(50),
                             }}>
                             <View
                               style={{
                                 flexDirection: 'row',
                                 justifyContent: 'space-between',
                               }}>
                               <Text
                                 style={{
                                   fontFamily: 'Outfit-Medium',
                                   color: PRIOR_FONT_COLOR,
                                   fontSize: moderateScale(35),
                                 }}>
                                 {}
                                 </Text>
                                 <View>
                                   
                                 </View>
                               <Text
                                 style={{
                                   fontFamily: 'Outfit-Regular',
                                   color: LOW_PRIOR_FONT_COLOR,
                                   fontSize: moderateScale(22),
                                 }}>
                                  {item?.total_distance} {item.uom}
                               </Text>
                             </View>
                             <View
                               style={{
                                 height: verticalScale(15),
                               }}
                                     />
                                     <View style={{flexDirection:'row'}}>
                                         <View style={{marginTop:verticalScale(5)}}>
                                     <View
                               style={{
                                 width: horizontalScale(12),
                                 height: horizontalScale(12),
                                 borderRadius: horizontalScale(12) / 2,
                                 backgroundColor: SECONDARY_COLOR,
                               }}
                                         />
                                    
                                     <View style={{ width: horizontalScale(12) }}>
                                     <View
                                style={{width:horizontalScale(0.5),height:verticalScale(60),borderWidth:.7,borderStyle:'dashed',borderColor:SECONDARY_COLOR,alignSelf:'center',marginTop:verticalScale(5)}}
                                     />
                                     </View>
                                     <View
                               style={{
                                 width: horizontalScale(12),
                                 height: horizontalScale(12),
                                 borderRadius: horizontalScale(12) / 2,
                                             backgroundColor: SECONDARY_COLOR,
                                 marginTop:verticalScale(5)
                               }}
                                             />
                                             </View>
                                         <View style={{ marginLeft: horizontalScale(10)}}>
                                             <View>
                                         <Text
                                 style={{
                                   fontFamily: 'Outfit-Medium',
                                   color: PRIOR_FONT_COLOR,
                                   fontSize: moderateScale(25),
                                 }}>
                                 {item?.name}
                                             </Text>
                                             <Text
                                 style={{
                                   fontFamily: 'Outfit-Regular',
                                   color:LOW_PRIOR_FONT_COLOR,
                                   fontSize: moderateScale(20),
                                 }}>
                                 Order ID
                                                 </Text>
                                   </View>
                                   <View style={{height:verticalScale(35)}} />
                                             <View>
                                         <Text
                                 style={{
                                   fontFamily: 'Outfit-Medium',
                                   color: PRIOR_FONT_COLOR,
                                   fontSize: moderateScale(25),
                                 }}>
                                 { moment(item?.departure_time).format("MMM D HH:mm")}
                                             </Text>
                                             <Text
                                 style={{
                                   fontFamily: 'Outfit-Regular',
                                   color:LOW_PRIOR_FONT_COLOR,
                                   fontSize: moderateScale(20),
                                 }}>
                                 Departure Time
                                                 </Text>
                                                 </View>
                                         </View>
                                   </View>
                                 </View>
                                 <Image
                                     source={require('./../assets/images/truck-load.png')}
                                     style={{ width: horizontalScale(150), height: verticalScale(100),position:'absolute',right:verticalScale(-20),bottom:verticalScale(10) }}
                                     
                                 />
                         </TouchableOpacity>
                     )
                 }}    
            />
            : (load === false) ?
            <Text
            style={{
              fontFamily: 'Outfit-Regular',
              color: PRIOR_FONT_COLOR,
              fontSize: moderateScale(25),
              marginLeft: horizontalScale(15),
            }}>
           No Trips Found...
              </Text>
              :
              <></>
          }
      </View>
      {(load)?
            <View style={{backgroundColor:'rgba(0,0,0,0.4)',position:'absolute',top:0,bottom:0,left:0,right:0,alignItems:'center',justifyContent:'center'}}>
          <View style={{ width: horizontalScale(250), height: verticalScale(70),justifyContent:"center",alignItems:'center', borderRadius: 10, backgroundColor: PRIMARY_COLOR, borderColor: SECONDARY_COLOR, borderWidth: 1 }}>
           <View style={{flexDirection:'row'}}>
            <ActivityIndicator size={"large"} color={SECONDARY_COLOR} />
            <Text
        style={{
          fontFamily: 'Outfit-Regular',
          color: PRIOR_FONT_COLOR,
                  fontSize: moderateScale(25),
                  marginLeft: horizontalScale(10),
          alignSelf:'center'
        }}>
        Loading...
              </Text>
              </View>
               </View>
          </View>
          :
          null
      } 
      </>
  );
};

export default LastOrder;
