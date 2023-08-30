import React from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  Dimensions,
  Animated,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator
} from 'react-native';
import {
  BACKGROUND_COLOR,
  LOW_PRIOR_FONT_COLOR,
  PRIMARY_COLOR,
  PRIOR_FONT_COLOR,
  SECONDARY_COLOR,
  LIGHT_GREY,
} from '../assets/colors/colors';
import {
  horizontalScale,
  verticalScale,
  moderateScale,
} from '../helpers/responsive';
import CalendarStrip from 'react-native-calendar-strip';
import {Icon, Divider} from '@rneui/base';
import {TextInput} from 'react-native';
import MapView, {PROVIDER_GOOGLE, Marker, Callout} from 'react-native-maps';
// remove PROVIDER_GOOGLE import if not using Google Maps
import {PanGestureHandler} from 'react-native-gesture-handler';
import {httpGet} from '../network calls/networkCalls';
import moment from 'moment';
import { useFocusEffect,useNavigation} from '@react-navigation/native';
import GetLocation from 'react-native-get-location';
import MapViewDirections from 'react-native-maps-directions';
import {httpPUT} from '../network calls/networkCalls';
import Toast from 'react-native-toast-message';

const widthScreen = Dimensions.get('window').width;
const heightScreen = Dimensions.get('window').height;
const DetailsScreen = props => {
  const [lat, setLat] = React.useState(24.8601);
  const [long, setLong] = React.useState(67.0565);
  const [visited, setVisited] = React.useState([]);
  const [animationBottom] = React.useState(new Animated.Value(0));
  const [longDelta, setLongDelta] = React.useState(0.03);
  const [check, setCheck] = React.useState(false);
  const [singleDeliveryTrip, setSingleDeliveryTrip] = React.useState({});
  const [latDelta, setLatDelta] = React.useState(
    0.03 * (widthScreen / heightScreen),
  );
  const [load,setLoad] = React.useState(true)
  const [nextStop, setNextStop] = React.useState({});
  const navigation = useNavigation();
  const bringUpActionSheet = () => {
    Animated.timing(animationBottom, {
      toValue: 1,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };
  const endUpActionSheet = () => {
    Animated.timing(animationBottom, {
      toValue: 0,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };
  const actionSheetInterpolate = animationBottom.interpolate({
    inputRange: [0, 1],
    outputRange: [verticalScale(-419.5), 0],
    extrapolate: 'clamp',
  });
  const getCurrentLocation = () => {
    GetLocation.getCurrentPosition({
      enableHighAccuracy: true,
      timeout: 60000,
    })
      .then(location => {
        setLat(location.latitude);
        setLong(location.longitude);
      })
      .catch(error => {
        const {code, message} = error;
        console.warn(code, message);
      });
  };
  useFocusEffect(
    React.useCallback(() => {
      // Your code here
      const getSingleDetail = async () => {
        const singleDetailResp = await httpGet(
          `/api/resource/Delivery Trip/${props.route.params.data}`,
        );
        if (singleDetailResp.error !== undefined) {
          setLoad(false)
          Toast.show({
            type: 'error',
            position: 'top',
            text1: `${singleDetailResp.error}👋`,
          });
          console.log('error', singleDetailResp.error);
        } else {
          console.log(
            'success - detail',
            JSON.stringify(singleDetailResp, null, 2),
          );
          setSingleDeliveryTrip(singleDetailResp.data);
          if (singleDetailResp.data.delivery_stops.length > 0) {
            const checkVisited = singleDetailResp.data.delivery_stops.filter(
              item => {
                return item.visited == 1;
              },
            );
            if (checkVisited.length > 0) {
              setVisited(checkVisited);
            }
            const checkunVisted = singleDetailResp.data.delivery_stops.filter(
              item => {
                return item.visited == 0;
              },
            );
  
            if (checkunVisted.length > 0) {
              setNextStop(checkunVisted[0]);
            }
          }
          setLoad(false)
        }
      };
      getCurrentLocation();
      getSingleDetail();
      return () => {
        // Clean up code here
      };
    }, [])
  )
React.useEffect(() => {
 
  }, []);
  const onComplete = async () => {
    if (check) {
      setLoad(true)
      const updatedArrayOfStops = singleDeliveryTrip.delivery_stops.map(
        item => {
          if (nextStop?.name === item.name) {
            item.visited = 1;
            return item;
          } else {
            return item;
          }
        },
      );
      console.log('array', JSON.stringify(updatedArrayOfStops, null, 2));
      const updateResponse = await httpPUT(
        `/api/resource/Delivery Trip/${props.route.params.data}`,
        {
          delivery_stops: updatedArrayOfStops,
        },
      );
      if (updateResponse.error !== undefined) {
        setLoad(false)
        Toast.show({
          type: 'error',
          position: 'top',
          text1: `${updateResponse.error}👋`,
        });
        console.log('error', updateResponse.error);
      } else {
        setLoad(false)
        props.navigation.goBack()
        console.log('success', JSON.stringify(updateResponse, null, 2));
      }
    } else {
      Toast.show({
        type: 'error',
        position: 'top',
        text1: `${'Check last location'}👋`,
      });
    }
  };
  return (
    <>
      <MapView
        style={{width: horizontalScale(375), height: verticalScale(812)}}
        region={{
          latitude: lat,
          longitude: long,
          latitudeDelta: latDelta,
          longitudeDelta: longDelta,
        }}
        minZoomLevel={10}
        maxZoomLevel={20}
        // onRegionChangeComplete={region => {
        //   setLat(region.latitude);
        //   setLong(region.longitude);
        //   setLatDelta(region.latitudeDelta);
        //   setLongDelta(region.longitudeDelta);
        // }}
        zoomEnabled={true}>
        <Marker
          coordinate={{latitude: lat, longitude: long}}
          description="Your Location">
          <Callout>
            <View
              style={{height: verticalScale(50), width: horizontalScale(50)}}>
              <Text
                style={{color: PRIOR_FONT_COLOR, fontSize: moderateScale(16)}}>
                {' '}
                {'Your Location'}{' '}
              </Text>
            </View>
          </Callout>
        </Marker>
        {Object.keys(nextStop).length > 0 ? (
          <Marker
            coordinate={{latitude: nextStop?.lat, longitude: nextStop?.lng}}>
            <Callout>
              <View
                style={{
                  height: verticalScale(120),
                  width: horizontalScale(200),
                }}>
                <Text
                  style={{
                    color: PRIOR_FONT_COLOR,
                    fontSize: moderateScale(16),
                  }}>
                  {' '}
                  {nextStop?.customer_address}{' '}
                </Text>
              </View>
            </Callout>
          </Marker>
        ) : null}
        {Object.keys(nextStop).length > 0 ? (
          <MapViewDirections
            origin={{latitude: lat, longitude: long}}
            destination={{latitude: nextStop?.lat, longitude: nextStop?.lng}}
            apikey={''}
            strokeWidth={3}
            strokeColor={SECONDARY_COLOR}
          />
        ) : null}

        {/* <View style={{width:horizontalScale(340),height:verticalScale(150),borderRadius:moderateScale(16),backgroundColor:PRIMARY_COLOR}}>

</View>  */}
      </MapView>
      <View
        style={{
          backgroundColor: 'white',
          width:horizontalScale(50),
          height:horizontalScale(50),
          borderRadius: 15,
          justifyContent: 'center',
          alignItems: 'center',
          position: 'absolute',
          top:verticalScale(10),
          left:horizontalScale(15),
        }}>
        <Icon
          name="chevron-back-sharp"
          type="ionicon"
          size={moderateScale(26)}
          color={SECONDARY_COLOR}
          onPress={() => props.navigation.goBack()}
        />
      </View>
      {/* <View style={{ width: horizontalScale(325),justifyContent:'center',alignItems:'center', borderRadius: moderateScale(10), height: verticalScale(100), alignSelf: 'center', backgroundColor: PRIMARY_COLOR, position: 'absolute', top: verticalScale(80) }}>
        
        <View style={{ flexDirection: 'row',width:horizontalScale(275),height:verticalScale(40) }}>
          <Icon
            name="arrow-return-left"
            type="fontisto"
            size={moderateScale(30)}
            color={SECONDARY_COLOR}
          />
          <View>
          <Text
              style={{
                fontFamily: 'Outfit-SemiBold',
                color: PRIOR_FONT_COLOR,
                fontSize: moderateScale(25),
                marginLeft: horizontalScale(15),
              }}>
              in 500 m
            </Text>
            <View style={{flexDirection:'row'}}>
            <Text
              style={{
                fontFamily: 'Outfit-SemiBold',
                color: LOW_PRIOR_FONT_COLOR,
                fontSize: moderateScale(18),
                marginLeft: horizontalScale(15),
              }}>
            st.
              </Text>
              <Text
              style={{
                fontFamily: 'Outfit-SemiBold',
                color:PRIOR_FONT_COLOR,
                fontSize: moderateScale(18),
                marginLeft: horizontalScale(2),
              }}>
            Avenue
            </Text>
            </View>
          </View>
        </View>
      </View> */}
      <PanGestureHandler
        // activeOffsetX={[-10, 10]}
        /* or */
        activeOffsetY={[-10, 10]}
        onGestureEvent={e => {
          if (e.nativeEvent.translationY < 0) {
            bringUpActionSheet();
          } else if (e.nativeEvent.translationY > 0) {
            endUpActionSheet();
          }
        }}>
        <Animated.View
          style={{
            width: horizontalScale(375),
            height: verticalScale(565.4),
            position: 'absolute',
            bottom: actionSheetInterpolate,
          }}>
          <View
            style={{
              backgroundColor: PRIMARY_COLOR,
              borderTopLeftRadius: 25,
              borderTopRightRadius: 25,
              height: verticalScale(146.16),
            }}>
            <View
              style={{
                width: horizontalScale(56.25),
                height: verticalScale(4),
                marginTop: verticalScale(10),
                borderRadius: 15,
                alignSelf: 'center',
                backgroundColor: LIGHT_GREY,
              }}></View>
            <View style={{height: verticalScale(17)}} />
            <View
              style={{
                width: horizontalScale(310),
                height: verticalScale(100),
                alignSelf: 'center',
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}>
              <View>
                <Text
                  allowFontScaling={false}
                  style={{
                    fontFamily: 'Outfit-Medium',
                    fontSize: moderateScale(20),
                    color: PRIOR_FONT_COLOR,
                    fontWeight: '700',

                    marginTop: verticalScale(2),
                  }}>
                  {Object.keys(nextStop).length > 0 ?
                    moment(nextStop?.estimated_arrival).format('MMM D HH:mm')
                  :
                    null}
                 
                </Text>
                <Text
                  allowFontScaling={false}
                  style={{
                    fontFamily: 'Outfit-Medium',
                    fontSize: moderateScale(20),
                    color: PRIOR_FONT_COLOR,
                    fontWeight: '700',
                    letterSpacing: horizontalScale(1),
                    marginTop: verticalScale(2),
                  }}>
                  {Object.keys(nextStop).length > 0 ?
                    `${nextStop?.distance}`+`${(nextStop?.uom === 'Meter') ? ' m' : ''}`+' on way' 
                      
                    :
                   'WELL DONE!'
                  }
                
                </Text>
                <Text
                  allowFontScaling={false}
                  style={{
                    fontFamily: 'Outfit-Medium',
                    fontSize: moderateScale(16),
                    color: LOW_PRIOR_FONT_COLOR,
                    fontWeight: '700',

                    marginTop: verticalScale(2),
                  }}>
                  {Object.keys(nextStop).length > 0 ?
                     `Next stop estimated time with distance`
                  :
                  `Job Completed`
                  }
                 
                </Text>
              </View>
              {/* <View
                style={{
                  width: horizontalScale(70),
                  height: horizontalScale(70),
                  borderRadius: horizontalScale(70) / 2,
                  backgroundColor: SECONDARY_COLOR,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Icon
                  name="chat"
                  color={PRIMARY_COLOR}
                  size={moderateScale(30)}
                />
              </View> */}
            </View>
          </View>
          <Divider
            style={{
              width: horizontalScale(375),
              borderWidth: 1,
              borderColor: LIGHT_GREY,
            }}
          />
          <View
            style={{
              height: verticalScale(419.5),
              width: horizontalScale(375),
              backgroundColor: PRIMARY_COLOR,
            }}>
            <View
              style={{
                height: verticalScale(25),
              }}
            />
            <Text
              style={{
                fontFamily: 'Outfit-Medium',
                color: PRIOR_FONT_COLOR,
                fontSize: moderateScale(25),
                marginLeft: horizontalScale(25),
              }}>
              Route Details
            </Text>
            <View
              style={{
                height: verticalScale(15),
              }}
            />
            <View
              style={{
                width: horizontalScale(375),
                alignSelf: 'center',
                height: verticalScale(230),
                backgroundColor: 'white',
                marginTop: verticalScale(5),
              }}>
              <View style={{width: horizontalScale(345), alignSelf: 'center'}}>
                <View
                  style={{ flexDirection: 'row' }}
                >
                  <View>
                    {visited.map((item, index) => {
                      return (
                        <>
                          {index < visited.length ? (
                            <View style={{marginTop: verticalScale(5)}}>
                              <View
                                style={{
                                  width: horizontalScale(12),
                                  height: horizontalScale(12),
                                  borderRadius: horizontalScale(12) / 2,
                                  borderColor: SECONDARY_COLOR,
                                  borderWidth: 2,
                                }}
                              />
                           
                                <View style={{width: horizontalScale(12)}}>
                                  <View
                                    style={{
                                      width: horizontalScale(0.5),
                                      height: verticalScale(60),
                                      borderWidth: 0.5,
                                      borderStyle: 'dashed',
                                      borderColor: SECONDARY_COLOR,
                                      alignSelf: 'center',
                                      marginTop: verticalScale(5),
                                    }}
                                  />
                                </View>
                              

                              {/* <View
                             style={{
                               width: horizontalScale(12),
                               height: horizontalScale(12),
                               borderRadius: horizontalScale(12) / 2,
                               borderColor: SECONDARY_COLOR,
                               borderWidth: 2,
                               marginTop: verticalScale(5),
                             }}
                           /> */}
                            </View>
                          ) : null}
                        </>
                      );
                    })}
                  </View>
                  <View>
                  {visited.map((item, index) => {
                    return (
                      <View style={{marginLeft: horizontalScale(10)}}>
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
                              {item?.address}
                            </Text>
                            <Text
                              style={{
                                fontFamily: 'Outfit-Regular',
                                color: LOW_PRIOR_FONT_COLOR,
                                fontSize: moderateScale(15),
                              }}>
                              {moment(item?.estimated_arrival).format(
                                'MMM D HH:mm',
                              )}
                            </Text>
                          </View>
                          <Icon
                            name="checksquare"
                            color={SECONDARY_COLOR}
                            type="antdesign"
                            size={moderateScale(25)}
                          />
                        </View>
                        <View style={{height: verticalScale(45)}} />
                        {/* <View
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
                            San Francisco, CA
                          </Text>
                          <Text
                            style={{
                              fontFamily: 'Outfit-Regular',
                              color: LOW_PRIOR_FONT_COLOR,
                              fontSize: moderateScale(15),
                            }}>
                            Sep 30, 18:30
                          </Text>
                        </View>
                        <Icon
                          name="square"
                          color={SECONDARY_COLOR}
                          type="feather"
                          size={moderateScale(25)}
                        />
                      </View> */}
                      </View>
                    );
                  })}
                    </View>
                </View>
              </View>
              {Object.keys(nextStop).length > 0 ? (
                <View
                  style={{
                    width: horizontalScale(345),
                    alignSelf: 'center',
                    flexDirection: 'row',
                    marginTop: verticalScale(5),
                  }}>
                  <View
                    style={{
                      width: horizontalScale(12),
                      height: horizontalScale(12),
                      borderRadius: horizontalScale(12) / 2,
                      borderColor: LOW_PRIOR_FONT_COLOR,
                      borderWidth: 2,
                    }}
                  />
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
                          {nextStop?.address}
                        </Text>
                        <Text
                          style={{
                            fontFamily: 'Outfit-Regular',
                            color: LOW_PRIOR_FONT_COLOR,
                            fontSize: moderateScale(15),
                          }}>
                          {moment(nextStop?.estimated_arrival).format(
                            'MMM D HH:mm',
                          )}
                        </Text>
                      </View>
                      {check ? (
                        <Icon
                          name="checksquare"
                          color={SECONDARY_COLOR}
                          type="antdesign"
                          size={moderateScale(25)}
                          onPress={() => setCheck(!check)}
                        />
                      ) : (
                        <Icon
                          name="square"
                          color={SECONDARY_COLOR}
                          type="feather"
                          size={moderateScale(25)}
                          onPress={() => setCheck(!check)}
                        />
                      )}
                    </View>
                  </View>
                </View>
              ) : null}
            </View>

            <TouchableOpacity
              style={{
                width: horizontalScale(265),
                height: verticalScale(50),
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: SECONDARY_COLOR,
                alignSelf: 'center',
                position: 'absolute',
                bottom: verticalScale(10),
              }}
              onPress={onComplete}
              disabled={Object.keys(nextStop).length > 0 ? false : true}>
              <Text
                style={{
                  fontFamily: 'Outfit-Medium',
                  color: PRIMARY_COLOR,
                  fontSize: moderateScale(20),
                }}>
                Complete
              </Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </PanGestureHandler>
  
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

export default DetailsScreen;
