/* eslint-disable react-native/no-inline-styles */
// import React, { useCallback, useEffect, useRef, useState } from 'react';
// import {
//   View,
//   Text,
//   Dimensions,
//   Animated,
// } from 'react-native';
// import {
//   LOW_PRIOR_FONT_COLOR,
//   PRIMARY_COLOR,
//   PRIOR_FONT_COLOR,
//   SECONDARY_COLOR,
//   LIGHT_GREY,
// } from '../assets/colors/colors';
// import {
//   horizontalScale,
//   verticalScale,
//   moderateScale,
// } from '../helpers/responsive';
// import { Icon, Divider } from '@rneui/base';
// import MapView, { PROVIDER_GOOGLE, Marker, Callout } from 'react-native-maps';
// // remove PROVIDER_GOOGLE import if not using Google Maps
// import { PanGestureHandler, ScrollView } from 'react-native-gesture-handler';
// import { httpGet } from '../network calls/networkCalls';
// import moment from 'moment';
// import { useFocusEffect } from '@react-navigation/native';
// import GetLocation from 'react-native-get-location';
// import MapViewDirections from 'react-native-maps-directions';
// import { httpPUT } from '../network calls/networkCalls';
// import Toast from 'react-native-toast-message';
// import Loading from '../components/Loading';
// import PrimaryGradientButton from '../components/PrimaryGradientButton';

// const { width: widthScreen, height: heightScreen } = Dimensions.get('window');

// const DetailsScreen = ({ route, navigation }) => {
//   const scrollViewRef = useRef(null);
//   const [lat, setLat] = useState(24.8601);
//   const [long, setLong] = useState(67.0565);
//   const [visited, setVisited] = useState([]);
//   const [animationBottom] = useState(new Animated.Value(0));
//   const [longDelta, setLongDelta] = useState(0.03);
//   const [check, setCheck] = useState(false);
//   const [singleDeliveryTrip, setSingleDeliveryTrip] = useState({});
//   const [latDelta, setLatDelta] = useState(
//     0.03 * (widthScreen / heightScreen),
//   );
//   const [load, setLoad] = useState(true);
//   const [nextStop, setNextStop] = useState({});
//   const bringUpActionSheet = () => {
//     Animated.timing(animationBottom, {
//       toValue: 1,
//       duration: 300,
//       useNativeDriver: false,
//     }).start();
//   };
//   const endUpActionSheet = () => {
//     Animated.timing(animationBottom, {
//       toValue: 0,
//       duration: 300,
//       useNativeDriver: false,
//     }).start();
//   };
//   const actionSheetInterpolate = animationBottom.interpolate({
//     inputRange: [0, 1],
//     outputRange: [verticalScale(-519.5), 0],
//     extrapolate: 'clamp',
//   });
//   const getTextWithoutHTMLTags = (text) => text.replace(/(<([^>]+)>)/gi, ' ');

//   const getCurrentLocation = () => {
//     GetLocation.getCurrentPosition({
//       enableHighAccuracy: true,
//       timeout: 60000,
//     })
//       .then(location => {
//         setLat(location.latitude);
//         setLong(location.longitude);
//       })
//       .catch(error => {
//         const { code, message } = error;
//         console.warn(code, message);
//       });
//   };
//   useFocusEffect(
//     useCallback(() => {
//       // Your code here
//       const getSingleDetail = async () => {
//         const singleDetailResp = await httpGet(
//           `/api/resource/Delivery Trip/${route.params.data}`,
//         );
//         if (singleDetailResp.error !== undefined) {
//           setLoad(false);
//           Toast.show({
//             type: 'error',
//             position: 'top',
//             text1: `${singleDetailResp.error}👋`,
//           });
//           console.log('error', singleDetailResp.error);
//         } else {
//           console.log(
//             'success - detail',
//             JSON.stringify(singleDetailResp, null, 2),
//           );
//           setSingleDeliveryTrip(singleDetailResp.data);
//           if (singleDetailResp.data.delivery_stops.length > 0) {
//             const checkVisited = singleDetailResp.data.delivery_stops.filter(
//               item => {
//                 return item.visited == 1;
//               },
//             );
//             if (checkVisited.length > 0) {
//               setVisited(checkVisited);
//             }
//             const checkunVisted = singleDetailResp.data.delivery_stops.filter(
//               item => {
//                 return item.visited == 0;
//               },
//             );

//             if (checkunVisted.length > 0) {
//               setNextStop(checkunVisted[0]);
//             }
//           }
//           setLoad(false);
//         }
//       };
//       getCurrentLocation();
//       getSingleDetail();
//       return () => {
//         // Clean up code here
//       };
//     }, [])
//   );
//   useEffect(() => {

//   }, []);
//   const onComplete = async () => {
//     if (check) {
//       setLoad(true);
//       const updatedArrayOfStops = singleDeliveryTrip.delivery_stops.map(
//         item => {
//           if (nextStop?.name === item.name) {
//             item.visited = 1;
//             return item;
//           } else {
//             return item;
//           }
//         },
//       );
//       console.log('array', JSON.stringify(updatedArrayOfStops, null, 2));
//       const updateResponse = await httpPUT(
//         `/api/resource/Delivery Trip/${route.params.data}`,
//         {
//           delivery_stops: updatedArrayOfStops,
//         },
//       );
//       if (updateResponse.error !== undefined) {
//         setLoad(false);
//         Toast.show({
//           type: 'error',
//           position: 'top',
//           text1: `${updateResponse.error}👋`,
//         });
//         console.log('error', updateResponse.error);
//       } else {
//         //props.navigation.goBack()
//         const checkVisited = updateResponse.Data.delivery_stops.filter(
//           item => {
//             return item.visited == 1;
//           },
//         );
//         if (checkVisited.length > 0) {
//           setVisited(checkVisited);
//         }
//         const checkunVisted = updateResponse.Data.delivery_stops.filter(
//           item => {
//             return item.visited == 0;
//           },
//         );

//         if (checkunVisted.length > 0) {
//           setNextStop(checkunVisted[0]);
//         }
//         else {
//           setNextStop({});
//         }
//         setLoad(false);
//         setCheck(false);
//         console.log('success', JSON.stringify(updateResponse, null, 2));
//       }
//     } else {
//       Toast.show({
//         type: 'error',
//         position: 'top',
//         text1: `${'Check last location'}👋`,
//       });
//     }
//   };

//   return (
//     <>
//       <MapView
//         style={{ width: '100%', height: '100%' }}
//         region={{
//           latitude: lat,
//           longitude: long,
//           latitudeDelta: latDelta,
//           longitudeDelta: longDelta,
//         }}
//         minZoomLevel={10}
//         maxZoomLevel={20}
//         zoomEnabled>
//         <Marker coordinate={{ latitude: lat, longitude: long }} description="Your Location">
//           <Callout>
//             <View style={{ height: verticalScale(50), width: horizontalScale(50) }}>
//               <Text style={{ color: PRIOR_FONT_COLOR, fontSize: moderateScale(16) }}>Your Location</Text>
//             </View>
//           </Callout>
//         </Marker>
//         {Object.keys(nextStop).length > 0 && (
//           <>
//             <Marker coordinate={{ latitude: nextStop?.lat, longitude: nextStop?.lng }}>
//               <Callout>
//                 <View
//                   style={{ height: verticalScale(120), width: horizontalScale(200) }}>
//                   <Text style={{ color: PRIOR_FONT_COLOR, fontSize: moderateScale(16) }}>
//                     {getTextWithoutHTMLTags(nextStop?.customer_address)}{' '}
//                   </Text>
//                 </View>
//               </Callout>
//             </Marker>
//             <MapViewDirections
//               origin={{ latitude: lat, longitude: long }}
//               destination={{ latitude: nextStop?.lat, longitude: nextStop?.lng }}
//               apikey={' '}
//               strokeWidth={3}
//               strokeColor={SECONDARY_COLOR}
//             />
//           </>
//         )}
//       </MapView>
//       <View
//         style={{
//           backgroundColor: 'white',
//           width: horizontalScale(50),
//           height: horizontalScale(50),
//           borderRadius: 15,
//           justifyContent: 'center',
//           alignItems: 'center',
//           position: 'absolute',
//           top: verticalScale(40),
//           left: horizontalScale(15),
//         }}>
//         <Icon
//           name="chevron-back-sharp"
//           type="ionicon"
//           size={moderateScale(26)}
//           color={SECONDARY_COLOR}
//           onPress={() => navigation.goBack()}
//         />
//       </View>
//       <PanGestureHandler
//         activeOffsetY={[-10, 10]}
//         onGestureEvent={e => {
//           if (e.nativeEvent.translationY < 0) {
//             bringUpActionSheet();
//           } else if (e.nativeEvent.translationY > 0) {
//             endUpActionSheet();
//           }
//         }}>
//         <Animated.View
//           style={{
//             width: horizontalScale(375),
//             height: verticalScale(665.4),
//             position: 'absolute',
//             bottom: actionSheetInterpolate,
//           }}>
//           <View
//             style={{
//               backgroundColor: PRIMARY_COLOR,
//               borderTopLeftRadius: 25,
//               borderTopRightRadius: 25,
//               height: verticalScale(146.16),
//             }}>
//             <View
//               style={{
//                 width: horizontalScale(56.25),
//                 height: verticalScale(4),
//                 marginTop: verticalScale(10),
//                 borderRadius: 15,
//                 alignSelf: 'center',
//                 backgroundColor: LIGHT_GREY,
//               }} />
//             <View style={{ height: verticalScale(17) }} />
//             <View
//               style={{
//                 width: horizontalScale(310),
//                 height: verticalScale(100),
//                 alignSelf: 'center',
//                 flexDirection: 'row',
//                 justifyContent: 'space-between',
//               }}>
//               <View>
//                 <Text
//                   allowFontScaling={false}
//                   style={{
//                     fontFamily: 'Outfit-Medium',
//                     fontSize: moderateScale(20),
//                     color: PRIOR_FONT_COLOR,
//                     fontWeight: '700',

//                     marginTop: verticalScale(2),
//                   }}>
//                   {Object.keys(nextStop).length > 0 ?
//                     moment(nextStop?.estimated_arrival).format('MMM D HH:mm')
//                     :
//                     null}

//                 </Text>
//                 <Text
//                   allowFontScaling={false}
//                   style={{
//                     fontFamily: 'Outfit-Medium',
//                     fontSize: moderateScale(20),
//                     color: PRIOR_FONT_COLOR,
//                     fontWeight: '700',
//                     letterSpacing: horizontalScale(1),
//                     marginTop: verticalScale(2),
//                   }}>
//                   {Object.keys(nextStop).length > 0 ?
//                     `${nextStop?.distance}` + `${(nextStop?.uom === 'Meter') ? ' m' : ''}` + ' on way'
//                     :
//                     'WELL DONE!'
//                   }

//                 </Text>
//                 <Text
//                   allowFontScaling={false}
//                   style={{
//                     fontFamily: 'Outfit-Medium',
//                     fontSize: moderateScale(16),
//                     color: LOW_PRIOR_FONT_COLOR,
//                     fontWeight: '700',

//                     marginTop: verticalScale(2),
//                   }}>
//                   {Object.keys(nextStop).length > 0 ?
//                     'Next stop estimated time with distance'
//                     :
//                     'Job Completed'
//                   }

//                 </Text>
//               </View>
//             </View>
//           </View>
//           <Divider
//             style={{
//               width: horizontalScale(375),
//               borderWidth: 1,
//               borderColor: LIGHT_GREY,
//             }}
//           />
//           <ScrollView ref={scrollViewRef}
//             contentContainerStyle={{ backgroundColor: 'white' }}
//             style={{ flex: 1 }}
//           >
//             <View
//               style={{
//                 height: verticalScale(519.5),
//                 width: horizontalScale(375),
//                 backgroundColor: PRIMARY_COLOR,
//               }}>
//               <View
//                 style={{
//                   height: verticalScale(25),
//                 }}
//               />
//               <Text
//                 style={{
//                   fontFamily: 'Outfit-Medium',
//                   color: PRIOR_FONT_COLOR,
//                   fontSize: moderateScale(25),
//                   marginLeft: horizontalScale(25),
//                 }}>
//                 Route Details
//               </Text>
//               <View
//                 style={{
//                   height: verticalScale(15),
//                 }}
//               />
//               <View
//                 style={{
//                   width: horizontalScale(375),
//                   alignSelf: 'center',
//                   height: verticalScale(230),
//                   backgroundColor: 'white',
//                   marginTop: verticalScale(5),
//                 }}>
//                 <View style={{ width: horizontalScale(345), alignSelf: 'center' }}>
//                   <View
//                     style={{ flexDirection: 'row' }}
//                   >
//                     <View>
//                       {visited.map((item, index) => {
//                         return (
//                           <View key={index}>
//                             {index < visited.length ? (
//                               <View style={{ marginTop: verticalScale(5) }}>
//                                 <View
//                                   style={{
//                                     width: horizontalScale(12),
//                                     height: horizontalScale(12),
//                                     borderRadius: horizontalScale(12) / 2,
//                                     borderColor: SECONDARY_COLOR,
//                                     borderWidth: 2,
//                                   }}
//                                 />

//                                 <View style={{ width: horizontalScale(12) }}>
//                                   <View
//                                     style={{
//                                       width: horizontalScale(0.5),
//                                       height: verticalScale(60),
//                                       borderWidth: 0.5,
//                                       borderStyle: 'dashed',
//                                       borderColor: SECONDARY_COLOR,
//                                       alignSelf: 'center',
//                                       marginTop: verticalScale(5),
//                                     }}
//                                   />
//                                 </View>
//                               </View>
//                             ) : null}
//                           </View>
//                         );
//                       })}
//                     </View>
//                     <View>
//                       {visited.map((item, index) => {
//                         return (
//                           <View key={index} style={{ marginLeft: horizontalScale(10) }}>
//                             <View
//                               style={{
//                                 width: horizontalScale(300),
//                                 flexDirection: 'row',
//                                 justifyContent: 'space-between',
//                               }}>
//                               <View>
//                                 <Text
//                                   style={{
//                                     fontFamily: 'Outfit-Medium',
//                                     color: PRIOR_FONT_COLOR,
//                                     fontSize: moderateScale(20),
//                                   }}>
//                                   {item?.address}
//                                 </Text>
//                                 <Text
//                                   style={{
//                                     fontFamily: 'Outfit-Regular',
//                                     color: LOW_PRIOR_FONT_COLOR,
//                                     fontSize: moderateScale(15),
//                                   }}>
//                                   {moment(item?.estimated_arrival).format(
//                                     'MMM D HH:mm',
//                                   )}
//                                 </Text>
//                               </View>
//                               <Icon
//                                 name="checksquare"
//                                 color={SECONDARY_COLOR}
//                                 type="antdesign"
//                                 size={moderateScale(25)}
//                               />
//                             </View>
//                             <View style={{ height: verticalScale(45) }} />
//                           </View>
//                         );
//                       })}
//                     </View>
//                   </View>
//                 </View>
//                 {Object.keys(nextStop).length > 0 ? (
//                   <View
//                     style={{
//                       width: horizontalScale(345),
//                       alignSelf: 'center',
//                       flexDirection: 'row',
//                       marginTop: verticalScale(5),
//                     }}>
//                     <View
//                       style={{
//                         width: horizontalScale(12),
//                         height: horizontalScale(12),
//                         borderRadius: horizontalScale(12) / 2,
//                         borderColor: LOW_PRIOR_FONT_COLOR,
//                         borderWidth: 2,
//                       }}
//                     />
//                     <View
//                       style={{
//                         marginLeft: horizontalScale(10),
//                         marginTop: verticalScale(-5),
//                       }}>
//                       <View
//                         style={{
//                           width: horizontalScale(300),
//                           flexDirection: 'row',
//                           justifyContent: 'space-between',
//                         }}>
//                         <View>
//                           <Text
//                             style={{
//                               fontFamily: 'Outfit-Medium',
//                               color: PRIOR_FONT_COLOR,
//                               fontSize: moderateScale(20),
//                             }}>
//                             {nextStop?.address}
//                           </Text>
//                           <Text
//                             style={{
//                               fontFamily: 'Outfit-Regular',
//                               color: LOW_PRIOR_FONT_COLOR,
//                               fontSize: moderateScale(15),
//                             }}>
//                             {moment(nextStop?.estimated_arrival).format(
//                               'MMM D HH:mm',
//                             )}
//                           </Text>
//                         </View>
//                         {check ? (
//                           <Icon
//                             name="checksquare"
//                             color={SECONDARY_COLOR}
//                             type="antdesign"
//                             size={moderateScale(25)}
//                             onPress={() => setCheck(!check)}
//                           />
//                         ) : (
//                           <Icon
//                             name="square"
//                             color={SECONDARY_COLOR}
//                             type="feather"
//                             size={moderateScale(25)}
//                             onPress={() => setCheck(!check)}
//                           />
//                         )}
//                       </View>
//                     </View>
//                   </View>
//                 ) : null}
//               </View>

//             </View>
//             {/* <View style={{height:verticalScale(550/3.5)}}></View>  */}
//           </ScrollView>
//           <View style={{
//             position: 'absolute',
//             bottom: verticalScale(10),
//             marginHorizontal: 30,
//             display: Object.keys(nextStop).length > 0 ? 'flex' : 'none',
//           }}>

//             <PrimaryGradientButton onPress={onComplete} text="Complete" />
//           </View>
//         </Animated.View>
//       </PanGestureHandler>

//       {(load) && <Loading />}
//     </>
//   );
// };

// export default DetailsScreen;


import React, { useCallback, useRef, useState } from 'react';
import {
  View,
  Text,
  Animated,
  ScrollView,
  TouchableHighlight,
  TouchableOpacity,
} from 'react-native';
import { Divider } from '@rneui/base';
import moment from 'moment';
import { useFocusEffect } from '@react-navigation/native';
import GetLocation from 'react-native-get-location';
import Toast from 'react-native-toast-message';
import { PanGestureHandler } from 'react-native-gesture-handler';

import PrimaryGradientButton from '../components/PrimaryGradientButton';
import {
  LOW_PRIOR_FONT_COLOR,
  PRIMARY_COLOR,
  PRIOR_FONT_COLOR,
  LIGHT_GREY,
  SECONDARY_COLOR,
} from '../assets/colors/colors';
import {
  horizontalScale,
  verticalScale,
  moderateScale,
} from '../helpers/responsive';
import { httpGet, httpPUT } from '../network calls/networkCalls';
import LoadingOverlay from '../components/LoadingOverlay';
import VisitedStopItem from '../components/ActionSheet/VisitedStopItem';
import NextStopItem from '../components/ActionSheet/NextStopItem';
import MapDisplay from '../components/MapDisplay';
import BackButton from '../components/BackButton';

const DetailsScreen = ({ route, navigation }) => {
  const scrollViewRef = useRef(null);
  const [lat, setLat] = useState(24.8601);
  const [long, setLong] = useState(67.0565);
  const [visited, setVisited] = useState([]);
  const [animationBottom] = useState(new Animated.Value(0));
  const [longDelta, setLongDelta] = useState(0.03);
  const [check, setCheck] = useState(false);
  const [singleDeliveryTrip, setSingleDeliveryTrip] = useState({});
  const [latDelta, setLatDelta] = useState(0.03 * (horizontalScale(1) / verticalScale(1)));
  const [load, setLoad] = useState(true);
  const [nextStop, setNextStop] = useState({});

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
    outputRange: [verticalScale(-519.5), 0],
    extrapolate: 'clamp',
  });

  const getTextWithoutHTMLTags = (text) => text.replace(/(<([^>]+)>)/gi, ' ');

  const getCurrentLocation = () => {
    GetLocation.getCurrentPosition({ enableHighAccuracy: true, timeout: 60000 })
      .then(location => {
        setLat(location.latitude);
        setLong(location.longitude);
      })
      .catch(error => console.warn(error.code, error.message));
  };

  useFocusEffect(
    useCallback(() => {
      const getSingleDetail = async () => {
        const response = await httpGet(`/api/resource/Delivery Trip/${route.params.data}`);
        if (response.error) {
          setLoad(false);
          Toast.show({ type: 'error', position: 'top', text1: `${response.error}👋` });
        } else {
          const trip = response.data;
          setSingleDeliveryTrip(trip);

          const visitedStops = trip.delivery_stops.filter(stop => stop.visited === 1);
          const unvisitedStops = trip.delivery_stops.filter(stop => stop.visited === 0);
          if (visitedStops.length > 0) setVisited(visitedStops);
          if (unvisitedStops.length > 0) setNextStop(unvisitedStops[0]);

          setLoad(false);
        }
      };
      getCurrentLocation();
      getSingleDetail();
    }, [])
  );

  const onComplete = async () => {
    if (!check) {
      Toast.show({ type: 'error', position: 'top', text1: 'Check last location 👋' });
      return;
    }
    setLoad(true);
    const updatedStops = singleDeliveryTrip.delivery_stops.map(item =>
      item.name === nextStop?.name ? { ...item, visited: 1 } : item
    );
    const response = await httpPUT(`/api/resource/Delivery Trip/${route.params.data}`, { delivery_stops: updatedStops });
    if (response.error) {
      setLoad(false);
      Toast.show({ type: 'error', position: 'top', text1: `${response.error}👋` });
    } else {
      const visitedStops = response.Data.delivery_stops.filter(stop => stop.visited === 1);
      const unvisitedStops = response.Data.delivery_stops.filter(stop => stop.visited === 0);
      setVisited(visitedStops);
      setNextStop(unvisitedStops.length > 0 ? unvisitedStops[0] : {});
      setCheck(false);
      setLoad(false);
    }
  };

  return (
    <>
      <MapDisplay lat={lat} long={long} latDelta={latDelta} longDelta={longDelta} nextStop={nextStop} getTextWithoutHTMLTags={getTextWithoutHTMLTags} />
      <BackButton onPress={() => navigation.goBack()} />

      <PanGestureHandler
        activeOffsetY={[-10, 10]}
        onGestureEvent={e => e.nativeEvent.translationY < 0 ? bringUpActionSheet() : endUpActionSheet()}>
        <Animated.View style={{ width: horizontalScale(375), height: verticalScale(665.4), position: 'absolute', bottom: actionSheetInterpolate }}>
          <View style={{ backgroundColor: PRIMARY_COLOR, borderTopLeftRadius: 25, borderTopRightRadius: 25, height: verticalScale(146.16) }}>
            <View style={{ width: horizontalScale(56.25), height: verticalScale(4), marginTop: verticalScale(10), borderRadius: 15, alignSelf: 'center', backgroundColor: LIGHT_GREY }} />
            <View style={{ height: verticalScale(17) }} />
            <View style={{ width: horizontalScale(310), height: verticalScale(100), alignSelf: 'center', flexDirection: 'row', justifyContent: 'space-between' }}>
              <View>
                <Text style={{ fontFamily: 'Outfit-Medium', fontSize: moderateScale(20), color: PRIOR_FONT_COLOR, fontWeight: '700', marginTop: verticalScale(2) }}>
                  {Object.keys(nextStop).length > 0 ? moment(nextStop?.estimated_arrival).format('MMM D HH:mm') : null}
                </Text>
                <Text style={{ fontFamily: 'Outfit-Medium', fontSize: moderateScale(20), color: PRIOR_FONT_COLOR, fontWeight: '700', letterSpacing: horizontalScale(1), marginTop: verticalScale(2) }}>
                  {Object.keys(nextStop).length > 0 ? `${nextStop?.distance}${nextStop?.uom === 'Meter' ? ' m' : ''} on way` : 'WELL DONE!'}
                </Text>
                <Text style={{ fontFamily: 'Outfit-Medium', fontSize: moderateScale(16), color: LOW_PRIOR_FONT_COLOR, fontWeight: '700', marginTop: verticalScale(2) }}>
                  {Object.keys(nextStop).length > 0 ? 'Next stop estimated time with distance' : 'Job Completed'}
                </Text>
              </View>
            </View>
          </View>

          <Divider style={{ width: horizontalScale(375), borderWidth: 1, borderColor: LIGHT_GREY }} />

          <ScrollView ref={scrollViewRef} contentContainerStyle={{ backgroundColor: 'white' }} style={{ flex: 1 }}>
            <View style={{ height: verticalScale(519.5), width: horizontalScale(375), backgroundColor: PRIMARY_COLOR }}>
              <View style={{ height: verticalScale(25) }} />
              <Text style={{ fontFamily: 'Outfit-Medium', color: PRIOR_FONT_COLOR, fontSize: moderateScale(25), marginLeft: horizontalScale(25) }}>
                Route Details
              </Text>
              <View style={{ height: verticalScale(15) }} />
              <View style={{ width: horizontalScale(375), alignSelf: 'center', height: verticalScale(230), backgroundColor: 'white', marginTop: verticalScale(5) }}>
                <View style={{ width: horizontalScale(345), alignSelf: 'center', flexDirection: 'row' }}>
                  <View>
                    {visited.map((_, index) => (
                      <View key={`dot-${index}`} style={{ marginTop: verticalScale(5) }}>
                        <TouchableOpacity onPress={() => console.log("Heelo")
                        }>
                          <View style={{ width: horizontalScale(12), height: horizontalScale(12), borderRadius: horizontalScale(12) / 2, borderColor: SECONDARY_COLOR, borderWidth: 2 }} />
                          <View style={{ width: horizontalScale(12) }}>
                            <View style={{ width: horizontalScale(0.5), height: verticalScale(60), borderWidth: 0.5, borderStyle: 'dashed', borderColor: SECONDARY_COLOR, alignSelf: 'center', marginTop: verticalScale(5) }} />
                          </View>
                        </TouchableOpacity>
                      </View>
                    ))}
                  </View>
                  <View>
                    {visited.map((item, index) => <VisitedStopItem key={`visited-${index}`} item={item} />)}
                  </View>
                </View>
                {Object.keys(nextStop).length > 0 && <NextStopItem nextStop={nextStop} check={check} onToggleCheck={() => setCheck(!check)} />}
              </View>
            </View>
          </ScrollView>

          {Object.keys(nextStop).length > 0 && (
            <View style={{ position: 'absolute', bottom: verticalScale(10), marginHorizontal: 30 }}>
              <PrimaryGradientButton onPress={onComplete} text="Complete" />
            </View>
          )}
        </Animated.View>
      </PanGestureHandler>

      <LoadingOverlay visible={load} />
    </>
  );
};

export default DetailsScreen;

