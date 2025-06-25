import React, { useCallback, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, RefreshControl } from 'react-native';
import {
  PRIMARY_COLOR,
} from '../assets/colors/colors';
import {
  verticalScale,
} from '../helpers/responsive';
import CalendarStrip from 'react-native-calendar-strip-moment-modification';
import moment from 'moment';
import { Toast } from 'react-native-toast-message/lib/src/Toast';
import { useFocusEffect } from '@react-navigation/native';
import { httpGet } from '../network calls/networkCalls';
import Loading from '../components/Loading';
import { styles } from '../helpers/styles';
import Appbar from '../components/appbar';
import LinearGradient from 'react-native-linear-gradient';
import { Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const HomeScreen = (props) => {
  const [dataArray, setDataArray] = useState([]);
  const [selectedDate, setSelectedDate] = useState(moment());
  const [refresh, setRefresh] = useState(false);
  const [load, setLoad] = useState(true);
  useFocusEffect(
    useCallback(() => {
      // Your code here
      getDeliveryTrip();
      return () => {
        // Clean up code here
      };
    }, [])
  );


  const getDeliveryTripByDate = async (date) => {
    setLoad(true);
    const getTripsResponse = await httpGet(`/api/method/driver_tracker.api.mobile_api.get_panding_order?date=${date}`);
    // const getTripsResponse = await httpGet(`/api/resource/Delivery Trip?limit_page_length=5000&fields=["*"]&filters=[["docstatus","=",1],["status","!=","Completed"],["departure_time","between",["${date}","${date}"]]]`);
    if (getTripsResponse.error != undefined) {
      Toast.show({
        type: 'error',
        position: 'top',
        text1: `${getTripsResponse.error}👋`,
      });
      setRefresh(false);
      setLoad(false);
    }
    else {
      // console.log('suuceess', JSON.stringify(getTripsResponse.message, null, 2));
      setDataArray(getTripsResponse.message);
      setRefresh(false);
      setLoad(false);
    }
  };
  const getDeliveryTrip = async () => {
    setRefresh(true);

    const getTripsResponse = await httpGet(`/api/method/driver_tracker.api.mobile_api.get_panding_order?date=${moment().format('YYYY-MM-DD')}`);
    // const getTripsResponse = await httpGet(`/api/resource/Delivery Trip?limit_page_length=5000&fields=["*"]&filters=[["docstatus","=",1],["status","!=","Completed"],["departure_time","between",["${moment().format('YYYY-MM-DD')}","${moment().format('YYYY-MM-DD')}"]]]`);
    // const getTripsResponse = await httpGet(`/api/resource/Delivery Trip?limit_page_length=5000&fields=["*"]&filters=[["docstatus","=",1],["status","!=","Completed"]]`)

    if (getTripsResponse.error != undefined) {
      Toast.show({
        type: 'error',
        position: 'top',
        text1: `${getTripsResponse.error}👋`,
      });
      setRefresh(false);
      setLoad(false);
    }
    else {
      console.log('suuceess', JSON.stringify(getTripsResponse.message, null, 2));
      setDataArray(getTripsResponse.message);
      setRefresh(false);
      setLoad(false);
    }
  };
  const theDayOfTheMonthOnNextWeek = () => {
    const maxDate = new Date();
    const max = maxDate.getDate() + 6;
    const setmax = maxDate.setDate(max);
    return setmax;
  };
  const theDayOfTheMonthOnTodayWeek = () => {
    const minDate = new Date();
    const min = minDate.getDate();
    const setmin = minDate.setDate(min);
    return setmin;
  };

  return (
    <SafeAreaView style={styles.container}>
      <Appbar />
      <View style={styles.headerContainer}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>List <Text style={styles.subtitle}>of orders</Text></Text>
        </View>
        <CalendarStrip
          scrollable
          showMonth={false}
          style={styles.calendar}
          onDateSelected={(date) => {
            setSelectedDate(moment(date));
            getDeliveryTripByDate(moment(date).format('YYYY-MM-DD'));
          }
          }
          minDate={theDayOfTheMonthOnTodayWeek()}
          maxDate={theDayOfTheMonthOnNextWeek()}
          calendarColor={PRIMARY_COLOR}
          useIsoWeekday={false}
          dateNumberStyle={styles.dateNumberStyle}
          dateNameStyle={styles.dateNameStyle}
          highlightDateNameStyle={styles.highlightDateNameStyle}
          highlightDateNumberStyle={styles.highlightDateNumberStyle}
        />
      </View>
      <View style={{ height: verticalScale(10) }} />
      <Text style={styles.dateText}>{moment().isSame(selectedDate, 'date') ? 'Today' : moment(selectedDate).format('DD MMM, YYYY')}</Text>
      {/* <View style={{ height: verticalScale(10) }} /> */}
      {(load === false) ?
        <FlatList
          data={dataArray}
          refreshControl={<RefreshControl refreshing={refresh} onRefresh={() => getDeliveryTrip()} />}
          renderItem={({ item, index }) => {
            return (
              <TouchableOpacity
                style={styles.itemContainer}
                onPress={() => props.navigation.navigate('Details', { data: item.name })}
              >
                <View
                  style={[styles.rowBetween, styles.itemCenter]}>
                  <Text style={styles.itemHeading}>
                    {item?.name}
                  </Text>
                  <Text
                    style={styles.itemDistance}>
                    {item?.total_distance} {item.uom}
                  </Text>
                </View>
                <Text style={styles.itemSubHeading}>Order ID</Text>
                <View style={[styles.rowBetween, styles.mt_10]}>
                  <LinearGradient colors={['#4CB84A', '#50B84C', '#186131']} style={styles.point} />
                  <View style={[styles.road, styles.mt_20]} >
                    <Image
                      source={require('./../assets/images/truck.png')}
                      style={styles.track_truck}
                    />
                  </View>
                  <LinearGradient colors={['#CC7781', '#CA5B74', '#9F1D20']} style={styles.point} />
                </View>
                <View style={[styles.rowBetween, styles.mb_3]}>
                  <View styles={[styles.mt_10, { flex: 1 }]} >
                    <Text style={styles.locationText} numberOfLines={1} ellipsizeMode="tail">
                      {item.delivery_stops.length > 0 ? item.delivery_stops[0].custom_address_name : "--"}
                    </Text>
                    <Text style={styles.locationDateText}>{item.delivery_stops.length > 0 ? moment(item.delivery_stops[0].estimated_arrival).format('MMM D HH:mm') : "--"}</Text>
                  </View>
                  <View styles={[styles.mt_10, { flex: 1 }]} >
                    <Text style={[styles.locationText, { textAlign: 'right' }]} numberOfLines={1} ellipsizeMode="tail">{item.delivery_stops.length > 0 ? item.delivery_stops[item.delivery_stops.length - 1].custom_address_name : "--"}</Text>
                    <Text style={[styles.locationDateText, { textAlign: 'right' }]}>{item.delivery_stops.length > 0 ? moment(item.delivery_stops[item.delivery_stops.length - 1].estimated_arrival).format('MMM D HH:mm') : "--"}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            );
          }}
          ListEmptyComponent={<Text style={styles.notFondText}>No Trips Found...</Text>}
        />
        : <Loading />
      }
    </SafeAreaView>
  );
};


export default HomeScreen;

