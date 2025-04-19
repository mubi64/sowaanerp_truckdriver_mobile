import React from 'react';
import { View, Text } from 'react-native';
import MapView, { Marker, Callout } from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import {
  horizontalScale,
  verticalScale,
  moderateScale,
} from '../helpers/responsive';
import {
  SECONDARY_COLOR,
  PRIOR_FONT_COLOR,
} from '../assets/colors/colors';

const MapDisplay = ({ lat, long, latDelta, longDelta, nextStop, getTextWithoutHTMLTags }) => {
  return (
    <MapView
      style={{ width: '100%', height: '100%' }}
      region={{
        latitude: lat,
        longitude: long,
        latitudeDelta: latDelta,
        longitudeDelta: longDelta,
      }}
      minZoomLevel={10}
      maxZoomLevel={20}
      zoomEnabled>

      <Marker coordinate={{ latitude: lat, longitude: long }} description="Your Location">
        <Callout>
          <View style={{ height: verticalScale(50), width: horizontalScale(50) }}>
            <Text style={{ color: PRIOR_FONT_COLOR, fontSize: moderateScale(16) }}>Your Location</Text>
          </View>
        </Callout>
      </Marker>

      {Object.keys(nextStop).length > 0 && (
        <>
          <Marker coordinate={{ latitude: nextStop?.lat, longitude: nextStop?.lng }}>
            <Callout>
              <View style={{ height: verticalScale(120), width: horizontalScale(200) }}>
                <Text style={{ color: PRIOR_FONT_COLOR, fontSize: moderateScale(16) }}>
                  {getTextWithoutHTMLTags(nextStop?.customer_address)}
                </Text>
              </View>
            </Callout>
          </Marker>
          <MapViewDirections
            origin={{ latitude: lat, longitude: long }}
            destination={{ latitude: nextStop?.lat, longitude: nextStop?.lng }}
            apikey={''} // Put your API Key here
            strokeWidth={3}
            strokeColor={SECONDARY_COLOR}
          />
        </>
      )}
    </MapView>
  );
};

export default MapDisplay;
