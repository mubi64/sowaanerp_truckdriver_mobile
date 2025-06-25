import React, { useState } from 'react';
import { View, Text, FlatList, RefreshControl, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native';
import {
  LOW_PRIOR_FONT_COLOR,
  PRIMARY_COLOR,
  PRIOR_FONT_COLOR,
  SECONDARY_COLOR,
} from '../assets/colors/colors';
import moment from 'moment';
import {
  verticalScale,
  moderateScale,
} from '../helpers/responsive';
import { useAuth } from '../context/auth-context';
import CalendarStrip from 'react-native-calendar-strip-moment-modification';
import Icon from 'react-native-vector-icons/Ionicons';
import { TextInput } from 'react-native';
import { httpGet } from '../network calls/networkCalls';
import { Toast } from 'react-native-toast-message/lib/src/Toast';
import Loading from '../components/Loading';
import { styles } from '../helpers/styles';
import Appbar from '../components/appbar';
import LinearGradient from 'react-native-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
const maxDate = new Date();
const theDayOfTheMonthOnTodayWeek = maxDate.getDate();
const LastOrder = (props) => {

  const [dataArray, setDataArray] = useState([])
  const [refresh, setRefresh] = useState(false)

  const [load, setLoad] = useState(true)
  React.useEffect(() => {
    getDeliveryTrip();
  }, [])
  const getDeliveryTrip = async () => {
    setRefresh(true);
    setLoad(true)
    const getTripsResponse = await httpGet('/api/method/driver_tracker.api.mobile_api.get_complete_order')
    // const getTripsResponse = await httpGet(`/api/resource/Delivery Trip?limit_page_length=5000&fields=["*"]&filters=[["docstatus","=",1],["status","=","Completed"]]`)
    if (getTripsResponse.error != undefined) {
      Toast.show({
        type: 'error',
        position: "top",
        text1: `${getTripsResponse.error}👋`
      });
      setRefresh(false)
      setLoad(false)
    }
    else {
      console.log('suuceess', JSON.stringify(getTripsResponse.message, null, 2))
      setDataArray(getTripsResponse.message)
      setRefresh(false)
      setLoad(false)
    }
  }
  const getDeliveryTripByDate = async (date) => {
    setLoad(true)
    const getTripsResponse = await httpGet(`/api/method/driver_tracker.api.mobile_api.get_complete_order?date=${date}`)
    // const getTripsResponse = await httpGet(`/api/resource/Delivery Trip?limit_page_length=5000&fields=["*"]&filters=[["docstatus","=",1],["status","=","Completed"],["departure_time","between",["${date}","${date}"]]]`)
    if (getTripsResponse.error != undefined) {
      Toast.show({
        type: 'error',
        position: "top",
        text1: `${getTripsResponse.error}👋`
      });
      setRefresh(false)
      setLoad(false)
    }
    else {
      console.log('suuceess', JSON.stringify(getTripsResponse.message, null, 2))
      setDataArray(getTripsResponse.message)
      setRefresh(false)
      setLoad(false)
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <Appbar />
      <View
        style={styles.headerContainer}>
        <View style={styles.titleContainer}>
          <View style={[styles.rowBetween, styles.itemCenter]}>
            <Text style={styles.title}>List <Text style={styles.subtitle}>of past orders</Text></Text>
            <Text style={styles.sortText}>Sort</Text>
          </View>
        </View>
        <CalendarStrip
          scrollable
          showMonth={false}
          style={{ height: verticalScale(50) }}
          onDateSelected={(date) => getDeliveryTripByDate(moment(date).format('DD-MM-YYYY'))}
          maxDate={maxDate.setDate(theDayOfTheMonthOnTodayWeek)}
          calendarColor={PRIMARY_COLOR}
          dateNumberStyle={styles.dateNumberStyle}
          dateNameStyle={styles.dateNameStyle}
          highlightDateNameStyle={styles.highlightDateNameStyle}
          highlightDateNumberStyle={styles.highlightDateNumberStyle}
        />
      </View>
      <View style={{ height: verticalScale(10) }} />
      <View
        style={styles.searchContainer}>
        <Icon name="search" size={24} color={SECONDARY_COLOR} />
        <TextInput
          style={styles.searchInput}
          placeholderTextColor={LOW_PRIOR_FONT_COLOR}
          placeholder="All Loads Near You"
        />
      </View>
      <Text
        style={styles.results}>
        Result: {dataArray.length}
      </Text>
      {(load === false && dataArray.length > 0) ?
        <FlatList
          data={dataArray}
          refreshControl={
            <RefreshControl
              refreshing={refresh}
              onRefresh={() => getDeliveryTrip()}
            />
          }
          renderItem={({ item, index }) => {
            return (
              <TouchableOpacity
                key={index}
                style={styles.itemContainer}
                onPress={() => props.navigation.navigate('Details', { data: item.name })}
              >
                <View
                  style={[styles.rowBetween, styles.mb_3]}>
                  <View style={styles.mb_3}>
                    <Text style={styles.itemHeading}>
                      {item?.name}
                    </Text>
                    <Text style={styles.itemSubHeading}>
                      Order ID
                    </Text>
                  </View>
                  <Text
                    style={styles.itemDistance}>
                    {item?.total_distance} {item.uom}
                  </Text>
                </View>
                <View style={styles.mb_3} >
                  <View style={[styles.row, styles.itemCenter, styles.mb_3]} >
                    <View style={styles.locationIcon}>
                      <Icon
                        name="location"
                        color={SECONDARY_COLOR}
                        size={moderateScale(16)}
                      />
                    </View>
                    <Text style={styles.locationText}>{item.delivery_stops.length > 0 ? item.delivery_stops[item.delivery_stops.length - 1].custom_address_name : "--"}</Text>
                  </View>
                  <View style={[styles.row, styles.itemCenter, styles.mb_3]} >
                    <View style={styles.locationIcon}>
                      <Icon
                        name="calendar"
                        color={SECONDARY_COLOR}
                        type="feather"
                        size={moderateScale(16)}
                      />
                    </View>
                    <Text style={styles.locationText}>{item.departure_time}</Text>
                  </View>
                </View>
                <LinearGradient colors={['#4CAF50', '#1B5E20']} start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }} style={styles.status} >
                  <Text style={{ color: 'white', fontWeight: '600' }} >{item?.status}</Text>
                </LinearGradient>
              </TouchableOpacity>
            )
          }}
        />
        : (load === false) &&
        <Text style={styles.notFondText}>No Trips Found...</Text>
      }
      {load && <Loading />}
    </SafeAreaView>
  );
};

export default LastOrder;