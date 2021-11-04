import React from 'react';
import {View, TouchableOpacity, Image} from 'react-native';
import Svg, {Path} from 'react-native-svg';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';

import {Home} from '../screens';
import {COLORS, ICONS} from '../constants';

const Tab = createBottomTabNavigator();

export function Tabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          borderTopWidth: 0,
          backgroundColor: COLORS.transparent,
          elevation: 0,
          position: 'absolute',
          height: 48,
        },
      }}>
      <Tab.Screen
        name="Categories"
        component={Home}
        options={getOptions(ICONS.cutlery)}
      />
      <Tab.Screen
        name="Search"
        component={Home}
        options={getOptions(ICONS.search)}
      />
      <Tab.Screen
        name="Like"
        component={Home}
        options={getOptions(ICONS.like)}
      />
      <Tab.Screen
        name="User"
        component={Home}
        options={getOptions(ICONS.user)}
      />
    </Tab.Navigator>
  );
}

function getOptions(icon) {
  return {tabBarIcon: TabBarIcon, tabBarButton: TabBarButton};

  function TabBarIcon({focused}) {
    const tintColor = focused ? COLORS.primary : COLORS.secondary;
    return (
      <Image
        source={icon}
        resizeMode="contain"
        style={{width: 24, height: 24, tintColor}}
      />
    );
  }

  function TabBarButton({accessibilityState, children, onPress}) {
    const {selected} = accessibilityState;
    return selected ? (
      <View
        style={{
          flex: 1,
          alignItems: 'center',
        }}>
        <View
          style={{
            flexDirection: 'row',
            position: 'absolute',
            top: 0,
          }}>
          <View style={{flex: 1, backgroundColor: COLORS.white}} />
          <Svg width={75} height={64} viewBox="0 0 75 64">
            <Path
              d="M75.2 0v61H0V0c4.1 0 7.4 3.1 7.9 7.1C10 21.7 22.5 33 37.7 33c15.2 0 27.7-11.3 29.7-25.9.5-4 3.9-7.1 7.9-7.1h-.1z"
              fill={COLORS.white}
            />
          </Svg>
          <View style={{flex: 1, backgroundColor: COLORS.white}} />
        </View>
        <TouchableOpacity
          style={{
            top: -24,
            justifyContent: 'center',
            alignItems: 'center',
            width: 52,
            height: 52,
            borderRadius: 26,
            backgroundColor: COLORS.white,
            elevation: 3,
          }}
          onPress={onPress}>
          {children}
        </TouchableOpacity>
      </View>
    ) : (
      <TouchableOpacity
        style={{flex: 1, height: 48, backgroundColor: COLORS.white}}
        activeOpacity={1}
        onPress={onPress}>
        {children}
      </TouchableOpacity>
    );
  }
}
