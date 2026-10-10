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
import { verticalScale } from '../helpers/responsive';
import { styles } from '../styles/common';
import { detailsStyles } from '../styles/screens/details.styles';
import { stopItemStyles } from '../styles/components/stopItem.styles';
import { httpGet, httpPUT } from '../network calls/networkCalls';
import LoadingOverlay from '../components/LoadingOverlay';
import VisitedStopItem from '../components/ActionSheet/VisitedStopItem';
import NextStopItem from '../components/ActionSheet/NextStopItem';
import MapDisplay from '../components/MapDisplay';
import BackButton from '../components/BackButton';

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
    <View style={detailsStyles.container}>
      <MapDisplay nextStop={nextStop.length > 0 ? nextStop[0] : {}} getTextWithoutHTMLTags={getTextWithoutHTMLTags} />
      <BackButton onPress={() => {
        if (navigation.canGoBack()) {
          navigation.goBack();
        } else {
          navigation.navigate('Home'); // Replace 'Home' with your actual route name
        }
      }} />

      <PanGestureHandler
        activeOffsetY={[-10, 10]}
        onGestureEvent={e => e.nativeEvent.translationY < 0 ? bringUpActionSheet() : endUpActionSheet()}>
        <Animated.View style={[detailsStyles.actionSheet, { bottom: actionSheetInterpolate }]}>
          <View style={detailsStyles.sheetHeader}>
            <View style={detailsStyles.dragHandle} />
            <View style={detailsStyles.spacer17} />
            <View style={detailsStyles.summaryRow}>
              <View>
                <Text style={detailsStyles.summaryText}>
                  {nextStop.length > 0 ? moment(nextStop[0]?.estimated_arrival).format('MMM D HH:mm') : null}
                </Text>
                <Text style={[detailsStyles.summaryText, detailsStyles.summaryDistance]}>
                  {nextStop.length > 0 ? `${nextStop[0]?.distance}${nextStop[0]?.uom === 'Meter' ? ' m' : ''} on way` : 'WELL DONE!'}
                </Text>
                <Text style={detailsStyles.summarySubText}>
                  {nextStop.length > 0 ? 'Next stop estimated time with distance' : 'Job Completed'}
                </Text>
              </View>
            </View>
          </View>

          <Divider style={detailsStyles.divider} />

          <ScrollView ref={scrollViewRef} contentContainerStyle={detailsStyles.scrollContent} style={styles.flex_1}>
            <View style={detailsStyles.routePanel}>
              <View style={detailsStyles.spacer25} />
              <Text style={detailsStyles.routeTitle}>
                Route Details
              </Text>
              <View style={detailsStyles.spacer15} />
              <View style={detailsStyles.routeList}>
                <View style={stopItemStyles.timelineRow}>
                  <View>
                    {visited.map((_, index) => (
                      <View key={`dot-${index}`} style={styles.mt_5}>
                        <View style={[stopItemStyles.dot, stopItemStyles.dotVisited]} />

                        {!(visited.length - 1 === index) && <View style={stopItemStyles.lineContainer}>
                          <View style={[stopItemStyles.line, stopItemStyles.lineVisited]} />
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
            <View style={detailsStyles.nextButtonContainer}>
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

