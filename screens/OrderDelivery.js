import React, {useEffect, useRef, useState} from 'react';
import {Image, Text, View, TouchableOpacity} from 'react-native';
import MapView, {PROVIDER_GOOGLE, Marker} from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import {COLORS, FONTS, GOOGLE_API_KEY, ICONS, SIZES} from '../constants';

export function OrderDelivery({route, navigation}) {
  const [restaurant, setRestaurant] = useState(null);
  const [streetName, setStreetName] = useState('');
  const [from, setFrom] = useState(null);
  const [to, setTo] = useState(null);

  const [duration, setDuration] = useState(0);

  useEffect(retrieveParamsEffect, [route]);

  return (
    <View style={{flex: 1}}>
      <Header streetName={streetName} duration={duration} />
      <Map from={from} to={to} onDirectionsReady={handleDirectionsReady} />
      <DeliveryInfo
        restaurant={restaurant}
        onCallPress={handleCallPress}
        onCancelPress={handleCancelPress}
      />
    </View>
  );

  function retrieveParamsEffect() {
    const {
      params: {item, currentLocation},
    } = route;

    const from = currentLocation?.gps;
    const to = item?.location;
    const street = currentLocation?.streetName;

    setRestaurant(item);
    setFrom(from);
    setTo(to);
    setStreetName(street);
  }

  function handleDirectionsReady(result) {
    setFrom(result.from);
    setDuration(result.duration);
  }

  function handleCallPress() {
    navigation.navigate('Home');
  }

  function handleCancelPress() {
    navigation.goBack();
  }
}

function Map({from, to, onDirectionsReady}) {
  const [region, setRegion] = useState(null);
  const [isReady, setIsReady] = useState(false);
  const [angle, setAngle] = useState(0);
  const mapView = useRef();

  useEffect(calcRegion, [from, to]);

  return (
    <View style={{flex: 1, position: 'relative', zIndex: 0}}>
      <MapView
        ref={mapView}
        provider={PROVIDER_GOOGLE}
        initialRegion={region}
        style={{flex: 1}}>
        <MapViewDirections
          origin={from}
          destination={to}
          apikey={GOOGLE_API_KEY}
          strokeWidth={5}
          strokeColor={COLORS.primary}
          optimizeWaypoints={true}
          onReady={handleDirectionsReady()}
        />
        <DestinationMarker to={to} />
        <CarIcon from={from} angle={angle} />
      </MapView>
      <ZoomButtons onZoomIn={handleZoomIn} onZoomOut={handleZoomOut} />
    </View>
  );

  function calcRegion() {
    if (from && to) {
      setRegion({
        latitude: (from.latitude + to.latitude) / 2,
        longitude: (from.longitude + to.longitude) / 2,
        latitudeDelta: Math.abs(from.latitude - to.latitude) * 2,
        longitudeDelta: Math.abs(from.longitude - to.longitude) * 2,
      });
    }
  }

  function handleDirectionsReady() {
    return function onReady(result) {
      if (!isReady) {
        mapView.current.fitToCoordinates(result.coordinates, {
          edgePadding: {
            right: SIZES.width / 20,
            bottom: SIZES.height / 4,
            left: SIZES.width / 20,
            top: SIZES.height / 8,
          },
        });

        const nextLocation = {
          latitude: result.coordinates[0].latitude,
          longitude: result.coordinates[0].longitude,
        };

        if (result.coordinates.length >= 2) {
          setAngle(calcAngle(result.coordinates));
        }

        setIsReady(true);

        onDirectionsReady({from: nextLocation, duration: result.duration});
      }
    };
  }

  function handleZoomIn() {
    const newRegion = {
      latitude: region.latitude,
      longitude: region.longitude,
      latitudeDelta: region.latitudeDelta / 2,
      longitudeDelta: region.longitudeDelta / 2,
    };
    setRegion(newRegion);
    mapView.current.animateToRegion(newRegion, 200);
  }

  function handleZoomOut() {
    const newRegion = {
      latitude: region.latitude,
      longitude: region.longitude,
      latitudeDelta: region.latitudeDelta * 2,
      longitudeDelta: region.longitudeDelta * 2,
    };
    setRegion(newRegion);
    mapView.current.animateToRegion(newRegion, 200);
  }
}

function calcAngle([from, to]) {
  const x = to.latitude - from.latitude;
  const y = to.longitude - from.longitude;
  return (Math.atan2(y, x) * 90) / Math.PI;
}

function DestinationMarker({to}) {
  return (
    <Marker coordinate={to}>
      <View
        style={{
          height: 38,
          width: 38,
          borderRadius: 19,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: COLORS.white,
        }}>
        <View
          style={{
            height: 32,
            width: 32,
            borderRadius: 16,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: COLORS.primary,
          }}>
          <Image
            source={ICONS.pin}
            style={{
              height: 24,
              width: 24,
              tintColor: COLORS.white,
            }}
          />
        </View>
      </View>
    </Marker>
  );
}

function CarIcon({from, angle}) {
  return (
    <Marker
      coordinate={from}
      anchor={{x: 0.5, y: 0.5}}
      flat={true}
      rotation={angle}>
      <Image
        source={ICONS.car}
        resizeMode="stretch"
        style={{
          width: 38,
          height: 32,
        }}
      />
    </Marker>
  );
}

function Header({streetName, duration}) {
  return (
    <View
      style={{
        position: 'absolute',
        top: 48,
        left: 0,
        right: 0,
        height: 48,
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1,
      }}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          width: SIZES.width * 0.9,
          paddingVertical: SIZES.padding,
          paddingHorizontal: SIZES.padding * 2,
          borderRadius: SIZES.radius,
          backgroundColor: COLORS.white,
          elevation: 1,
        }}>
        <Image
          source={ICONS.pin}
          style={{
            width: 28,
            height: 28,
            marginRight: SIZES.padding,
          }}
        />

        <View style={{flex: 1}}>
          <Text style={{...FONTS.body3, color: COLORS.black}}>
            {streetName}
          </Text>
        </View>

        <Text style={{...FONTS.body3, color: COLORS.black}}>
          {Math.ceil(duration)} mins
        </Text>
      </View>
    </View>
  );
}

function DeliveryInfo({restaurant, onCallPress, onCancelPress}) {
  return (
    <View
      style={{
        position: 'absolute',
        bottom: 48,
        left: 0,
        right: 0,
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      <View
        style={{
          width: SIZES.width * 0.9,
          paddingVertical: SIZES.padding * 3,
          paddingHorizontal: SIZES.padding * 2,
          borderRadius: SIZES.radius,
          backgroundColor: COLORS.white,
          elevation: 1,
        }}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
          }}>
          <Image
            source={restaurant?.courier?.avatar}
            style={{
              width: 48,
              height: 48,
              borderRadius: 24,
            }}
          />

          <View style={{flex: 1, marginLeft: SIZES.padding}}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}>
              <Text style={{...FONTS.h4, color: COLORS.black}}>
                {restaurant?.courier?.name}
              </Text>

              <View style={{flexDirection: 'row'}}>
                <Image
                  source={ICONS.star}
                  style={{
                    width: 18,
                    height: 18,
                    tintColor: COLORS.primary,
                    marginRight: SIZES.padding,
                  }}
                />
                <Text style={{...FONTS.body3, color: COLORS.black}}>
                  {restaurant?.rating}
                </Text>
              </View>
            </View>

            <Text style={{...FONTS.body4, color: COLORS.darkGray}}>
              {restaurant?.name}
            </Text>
          </View>
        </View>

        <View
          style={{
            flexDirection: 'row',
            marginTop: SIZES.padding * 2,
            justifyContent: 'space-between',
          }}>
          <TouchableOpacity
            style={{
              height: 48,
              flex: 1,
              marginRight: 10,
              backgroundColor: COLORS.primary,
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 10,
            }}
            onPress={onCallPress}>
            <Text style={{...FONTS.h4, color: COLORS.white}}>Call</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={{
              height: 48,
              flex: 1,
              backgroundColor: COLORS.secondary,
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 10,
            }}
            onPress={onCancelPress}>
            <Text style={{...FONTS.h4, color: COLORS.white}}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

function ZoomButtons({onZoomIn, onZoomOut}) {
  return (
    <View
      style={{
        position: 'absolute',
        bottom: SIZES.height * 0.35,
        right: SIZES.padding * 2,
        width: 60,
        height: 130,
        justifyContent: 'space-between',
      }}>
      <TouchableOpacity
        style={{
          width: 60,
          height: 60,
          borderRadius: 30,
          backgroundColor: COLORS.white,
          alignItems: 'center',
          justifyContent: 'center',
          elevation: 3,
        }}
        onPress={onZoomIn}>
        <Text style={{...FONTS.body1, color: COLORS.black}}>+</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={{
          width: 60,
          height: 60,
          borderRadius: 30,
          backgroundColor: COLORS.white,
          alignItems: 'center',
          justifyContent: 'center',
          elevation: 3,
        }}
        onPress={onZoomOut}>
        <Text style={{...FONTS.body1, color: COLORS.black}}>-</Text>
      </TouchableOpacity>
    </View>
  );
}

export default OrderDelivery;
