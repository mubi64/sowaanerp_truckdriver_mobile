import React, { useEffect, useState, useMemo } from 'react';
import MapView, { Callout, Marker, Polyline } from 'react-native-maps';
import { PRIOR_FONT_COLOR, SECONDARY_COLOR } from '../assets/colors/colors';
import GetLocation from 'react-native-get-location';
import { View, Text } from 'react-native';
import { horizontalScale, moderateScale, verticalScale } from '../helpers/responsive';

const MapDisplay = ({ nextStop, getTextWithoutHTMLTags }) => {
  const [lat, setLat] = useState(24.7138956);
  const [long, setLong] = useState(46.5897598);

  const getCurrentLocation = () => {
    GetLocation.getCurrentPosition({
      enableHighAccuracy: true,
      timeout: 60000,
    })
      .then(location => {
        setLat(location.latitude);
        setLong(location.longitude);
      })
      .catch(error => console.warn(error.code, error.message));
  };

  useEffect(() => {
    getCurrentLocation();
  }, []);

  const currentLocation = { latitude: lat, longitude: long };
  const nextLocation =
    nextStop && nextStop.lat && nextStop.lng
      ? { latitude: nextStop.lat, longitude: nextStop.lng }
      : null;

  // 🧠 Create a unique key to force re-render when location or nextStop changes
  const mapKey = useMemo(
    () => `${lat}-${long}-${nextStop?.lat || ''}-${nextStop?.lng || ''}`,
    [lat, long, nextStop]
  );

  return (
    <MapView
      key={mapKey} // 👈 force remount on key change
      style={{ flex: 1 }}
      region={{
        latitude: lat,
        longitude: long,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      }}
    >
      <Marker coordinate={currentLocation} >
        <Callout>
          <View style={{ height: verticalScale(50), width: horizontalScale(50) }}>
            <Text style={{ color: PRIOR_FONT_COLOR, fontSize: moderateScale(16) }}>Your Location</Text>
          </View>
        </Callout>
      </Marker>

      {nextLocation && <Marker coordinate={nextLocation} />}

      {nextLocation && (
        <Polyline
          coordinates={[currentLocation, nextLocation]}
          strokeColor={SECONDARY_COLOR}
          strokeWidth={4}
        />
      )}
    </MapView>
  );
};

export default MapDisplay;
