import React, { useCallback, useRef, useState } from 'react';
import {
  View,
  Text,
  Animated,
  ScrollView,
} from 'react-native';
import { Divider } from '@rneui/base';
import moment from 'moment';
import { useFocusEffect } from '@react-navigation/native';
import GetLocation from 'react-native-get-location';
import Toast from 'react-native-toast-message';
import { FlatList, PanGestureHandler } from 'react-native-gesture-handler';

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
import { SafeAreaView } from 'react-native-safe-area-context';

const DetailsScreen = ({ route, navigation }) => {
  const scrollViewRef = useRef(null);
  const [visited, setVisited] = useState([]);
  const [animationBottom] = useState(new Animated.Value(0));
  const [checkedIndex, setCheckedIndex] = useState(null);
  const [singleDeliveryTrip, setSingleDeliveryTrip] = useState({});
  const [load, setLoad] = useState(true);
  const [nextStop, setNextStop] = useState([]);

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
          if (unvisitedStops.length > 0) setNextStop(unvisitedStops);

          setLoad(false);
        }
      };
      getSingleDetail();
    }, [route.params.data])
  );

  const onComplete = async () => {
    if (checkedIndex === null) {
      Toast.show({ type: 'error', position: 'top', text1: 'Please check one stop 👋' });
      return;
    }
    setLoad(true);
    const selectedStop = nextStop[checkedIndex];
    const updatedStops = singleDeliveryTrip.delivery_stops.map(item =>
      item.name === selectedStop?.name ? { ...item, visited: 1 } : item
    );

    if (selectedStop?.delivery_note) {
      navigation.navigate('Items', {
        note: selectedStop?.delivery_note,
        trip: route.params.data,
        stop: updatedStops,
      });
    } else {
      Toast.show({
        type: 'error',
        text1: 'No Delivery Note Found',
        position: 'top',
      });
      const response = await httpPUT(`/api/resource/Delivery Trip/${route.params.data}`, { delivery_stops: updatedStops });
      setLoad(false);
      if (response.error) {
        setLoad(false);
        Toast.show({ type: 'error', position: 'top', text1: `${response.error}👋` });
      } else {
        const visitedStops = response.data.delivery_stops.filter(stop => stop.visited === 1);
        const unvisitedStops = response.data.delivery_stops.filter(stop => stop.visited === 0);
        setVisited(visitedStops);
        setNextStop(unvisitedStops);
        setCheckedIndex(null);
        setLoad(false);
      }
    }
  };

  const handleToggleCheck = (index) => {
    // Toggle selection: deselect if already selected, else select
    setCheckedIndex(prev => (prev === index ? null : index));
  };

  return (
    <View style={{ flex: 1, backgroundColor: PRIMARY_COLOR }}>
      <MapDisplay nextStop={nextStop.length > 0 ? nextStop[0] : {}} getTextWithoutHTMLTags={getTextWithoutHTMLTags} />
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
                  {nextStop.length > 0 ? moment(nextStop[0]?.estimated_arrival).format('MMM D HH:mm') : null}
                </Text>
                <Text style={{ fontFamily: 'Outfit-Medium', fontSize: moderateScale(20), color: PRIOR_FONT_COLOR, fontWeight: '700', letterSpacing: horizontalScale(1), marginTop: verticalScale(2) }}>
                  {nextStop.length > 0 ? `${nextStop[0]?.distance}${nextStop[0]?.uom === 'Meter' ? ' m' : ''} on way` : 'WELL DONE!'}
                </Text>
                <Text style={{ fontFamily: 'Outfit-Medium', fontSize: moderateScale(16), color: LOW_PRIOR_FONT_COLOR, fontWeight: '700', marginTop: verticalScale(2) }}>
                  {nextStop.length > 0 ? 'Next stop estimated time with distance' : 'Job Completed'}
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
                        <View style={{ width: horizontalScale(12), height: horizontalScale(12), borderRadius: horizontalScale(12) / 2, borderColor: LOW_PRIOR_FONT_COLOR, borderWidth: 2 }} />

                        {!(visited.length - 1 === index) && <View style={{ width: horizontalScale(12) }}>
                          <View style={{ width: horizontalScale(0.5), height: verticalScale(40), borderWidth: 0.5, borderStyle: 'dashed', borderColor: LOW_PRIOR_FONT_COLOR, alignSelf: 'center', marginTop: verticalScale(5) }} />
                        </View>}
                      </View>
                    ))}
                  </View>
                  <View>
                    {visited.map((item, index) => <VisitedStopItem key={`visited-${index}`} item={item} />)}
                  </View>
                </View>
                {nextStop.length > 0 &&
                  // for loop to display next stop items
                  nextStop.map((item, index) => (
                    <NextStopItem key={`next-stop-${index}`} nextStop={item} check={checkedIndex === index}
                      onToggleCheck={() => handleToggleCheck(index)} stopLength={nextStop.length - 1 === index} />
                  ))
                }
              </View>
            </View>
          </ScrollView>

          {checkedIndex !== null && (
            <View style={{ position: 'absolute', bottom: verticalScale(10), marginHorizontal: 30 }}>
              <PrimaryGradientButton onPress={onComplete} text="Next" />
            </View>
          )}
        </Animated.View>
      </PanGestureHandler>

      <LoadingOverlay visible={load} />
    </View>
  );
};

export default DetailsScreen;

