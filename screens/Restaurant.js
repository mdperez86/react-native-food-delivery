import React, {useEffect} from 'react';
import {useState} from 'react';
import {
  Animated,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {COLORS, FONTS, ICONS, SIZES} from '../constants';

export function Restaurant({route, navigation}) {
  const [restaurant, setRestaurant] = useState(null);
  const [location, setLocation] = useState(null);
  const [cart, setCart] = useState([]);
  const scrollX = new Animated.Value(0);
  const dotPosition = Animated.divide(scrollX, SIZES.width);

  useEffect(retrieveParamsEffect, [route]);

  return (
    <SafeAreaView style={styles.container}>
      <Header
        restaurant={restaurant}
        onNavigateBackPress={handleNavigateBackPress}
      />
      <FoodInfo
        restaurant={restaurant}
        onScroll={createScrollHandler()}
        onLessPress={handleLessPress}
        onMorePress={handleMorePress}
        getQuantity={getQuantity}
      />
      <OrderSection
        location={location}
        restaurant={restaurant}
        calcDot={calcDot}
        cart={cart}
        onOrderPress={handleOrderPress}
      />
    </SafeAreaView>
  );

  function retrieveParamsEffect() {
    const {
      params: {item, currentLocation},
    } = route;

    setRestaurant(item);
    setLocation(currentLocation);
  }

  function handleNavigateBackPress() {
    navigation.goBack();
  }

  function createScrollHandler() {
    return Animated.event([{nativeEvent: {contentOffset: {x: scrollX}}}], {
      useNativeDriver: false,
    });
  }

  function calcDot(index) {
    const opacity = dotPosition.interpolate({
      inputRange: [index - 1, index, index + 1],
      outputRange: [0.3, 1, 0.3],
      extrapolate: 'clamp',
    });
    const size = dotPosition.interpolate({
      inputRange: [index - 1, index, index + 1],
      outputRange: [SIZES.base * 0.8, 10, SIZES.base * 0.8],
      extrapolate: 'clamp',
    });
    const color = dotPosition.interpolate({
      inputRange: [index - 1, index, index + 1],
      outputRange: [COLORS.darkGray, COLORS.primary, COLORS.darkGray],
      extrapolate: 'clamp',
    });

    return {
      opacity,
      size,
      color,
    };
  }

  function handleLessPress(menu) {
    return function onLessPress() {
      setCart(changeCart);
    };

    function changeCart(prevCart) {
      const copyCart = [...prevCart];
      const item = copyCart.find(createCartItemMatcher(menu));
      if (item) {
        if (item.quantity > 0) {
          item.quantity -= 1;
          item.total = item.quantity * item.menu.price;
        }
      }
      return copyCart;
    }
  }

  function handleMorePress(menu) {
    return function onMorePress() {
      setCart(changeCart);
    };

    function changeCart(prevCart) {
      const copyCart = [...prevCart];
      const item = copyCart.find(createCartItemMatcher(menu));
      if (item) {
        item.quantity += 1;
        item.total = item.quantity * item.menu.price;
      } else {
        copyCart.push({
          menu,
          quantity: 1,
          price: menu.price,
          total: menu.price,
        });
      }
      return copyCart;
    }
  }

  function getQuantity(menu) {
    const item = cart.find(createCartItemMatcher(menu));
    return item?.quantity || 0;
  }

  function createCartItemMatcher(menu) {
    return function cartItemMatcher(cartItem) {
      return cartItem.menu.id === menu?.id;
    };
  }

  function handleOrderPress() {
    navigation.navigate('OrderDelivery', {
      item: restaurant,
      currentLocation: location,
    });
  }
}

function Header({restaurant, onNavigateBackPress}) {
  return (
    <View
      style={{
        flexDirection: 'row',
        height: 48,
        justifyContent: 'space-between',
        alignItems: 'center',
        marginVertical: SIZES.padding * 0.5,
      }}>
      <TouchableOpacity
        style={{
          width: 48,
          paddingLeft: SIZES.padding * 2,
          justifyContent: 'center',
        }}
        onPress={onNavigateBackPress}>
        <Image
          source={ICONS.back}
          resizeMode="contain"
          style={{width: 28, height: 28}}
        />
      </TouchableOpacity>

      <View
        style={{
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <View
          style={{
            height: 48,
            backgroundColor: COLORS.lightGray3,
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: SIZES.radius,
            paddingHorizontal: SIZES.padding * 3,
          }}>
          <Text style={{...FONTS.h3, color: COLORS.black}}>
            {restaurant?.name}
          </Text>
        </View>
      </View>

      <TouchableOpacity
        style={{
          width: 48,
          paddingRight: SIZES.padding * 2,
          justifyContent: 'center',
        }}>
        <Image
          source={ICONS.list}
          resizeMode="contain"
          style={{
            width: 28,
            height: 28,
          }}
        />
      </TouchableOpacity>
    </View>
  );
}

function FoodInfo({
  restaurant,
  onScroll,
  onLessPress,
  onMorePress,
  getQuantity,
}) {
  return (
    <Animated.ScrollView
      horizontal
      pagingEnabled
      scrollEventThrottle={16}
      snapToAlignment="center"
      showsHorizontalScrollIndicator={false}
      onScroll={onScroll}>
      {restaurant?.menu?.map(menu => (
        <View key={menu.id} style={{alignItems: 'center'}}>
          <View style={{height: SIZES.height * 0.35}}>
            <Image
              source={menu.photo}
              resizeMode="cover"
              style={{width: SIZES.width, height: '100%'}}
            />
            <View
              style={{
                position: 'absolute',
                bottom: -20,
                width: SIZES.width,
                height: 48,
                justifyContent: 'center',
                flexDirection: 'row',
              }}>
              <View
                style={{
                  flexDirection: 'row',
                  elevation: 3,
                  borderRadius: 24,
                  overflow: 'hidden',
                  backgroundColor: COLORS.white,
                }}>
                <TouchableOpacity
                  style={{
                    width: 48,
                    height: '100%',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                  onPress={handleLessPress(menu)}>
                  <Text style={{...FONTS.body1, color: COLORS.black}}>-</Text>
                </TouchableOpacity>

                <View
                  style={{
                    width: 48,
                    height: '100%',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <Text style={{...FONTS.h2, color: COLORS.black}}>
                    {getQuantity(menu)}
                  </Text>
                </View>

                <TouchableOpacity
                  style={{
                    width: 48,
                    height: '100%',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                  onPress={handleMorePress(menu)}>
                  <Text style={{...FONTS.body1, color: COLORS.black}}>+</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          <View
            style={{
              width: SIZES.width,
              alignItems: 'center',
              marginTop: 15,
              paddingHorizontal: SIZES.padding * 2,
            }}>
            <Text
              style={{
                marginVertical: 8,
                textAlign: 'center',
                color: COLORS.black,
                ...FONTS.h2,
              }}>
              {menu.name} - {menu.price?.toFixed(2)}
            </Text>
            <Text style={{...FONTS.body3, color: COLORS.black}}>
              {menu.description}
            </Text>
          </View>
          <View
            style={{
              flexDirection: 'row',
              marginTop: 8,
            }}>
            <Image
              source={ICONS.calories}
              style={{
                width: 18,
                height: 18,
                marginRight: 8,
              }}
            />
            <Text style={{...FONTS.body3, color: COLORS.darkGray}}>
              {menu.calories?.toFixed(2)} cal
            </Text>
          </View>
        </View>
      ))}
    </Animated.ScrollView>
  );

  function handleLessPress(menu) {
    return onLessPress(menu);
  }

  function handleMorePress(menu) {
    return onMorePress(menu);
  }
}

function Dots({restaurant, calcDot}) {
  return (
    restaurant?.menu?.length > 1 && (
      <View style={{height: 30}}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            height: SIZES.padding,
          }}>
          {restaurant?.menu
            ?.map((_, index) => calcDot(index))
            .map((dot, index) => (
              <Animated.View
                key={index}
                style={{
                  borderRadius: SIZES.radius,
                  marginHorizontal: 6,
                  width: dot.size,
                  height: dot.size,
                  backgroundColor: dot.color,
                }}
              />
            ))}
        </View>
      </View>
    )
  );
}

function OrderSection({location, restaurant, calcDot, cart, onOrderPress}) {
  return (
    <View>
      <Dots restaurant={restaurant} calcDot={calcDot} />
      <View
        style={{
          backgroundColor: COLORS.white,
          borderTopLeftRadius: 48,
          borderTopRightRadius: 48,
          elevation: 8,
        }}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            paddingVertical: SIZES.padding * 2,
            paddingHorizontal: SIZES.padding * 3,
            borderBottomColor: COLORS.lightGray2,
            borderBottomWidth: 1,
          }}>
          <Text style={{...FONTS.h3, color: COLORS.black}}>
            {getTotalQuantity()} items in Cart
          </Text>
          <Text style={{...FONTS.h3, color: COLORS.black}}>
            ${getTotalPrice()}
          </Text>
        </View>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            paddingVertical: SIZES.padding * 2,
            paddingHorizontal: SIZES.padding * 3,
          }}>
          <View style={{flexDirection: 'row'}}>
            <Image
              source={ICONS.pin}
              resizeMode="contain"
              style={{width: 20, height: 20, tintColor: COLORS.darkGray}}
            />
            <Text
              style={{
                marginLeft: SIZES.padding,
                color: COLORS.darkGray,
                ...FONTS.h4,
              }}>
              {location?.streetName}
            </Text>
          </View>
          <View style={{flexDirection: 'row'}}>
            <Image
              source={ICONS.mastercard}
              resizeMode="contain"
              style={{width: 20, height: 20, tintColor: COLORS.darkGray}}
            />
            <Text
              style={{
                marginLeft: SIZES.padding,
                color: COLORS.darkGray,
                ...FONTS.h4,
              }}>
              8888
            </Text>
          </View>
        </View>

        <View
          style={{
            padding: SIZES.padding * 2,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <TouchableOpacity
            style={{
              width: SIZES.width * 0.9,
              padding: SIZES.padding,
              backgroundColor: COLORS.primary,
              alignItems: 'center',
              borderRadius: SIZES.radius,
            }}
            onPress={onOrderPress}>
            <Text
              style={{
                color: COLORS.white,
                ...FONTS.h2,
              }}>
              Order
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  function getTotalQuantity() {
    return cart.reduce((total, item) => total + item.quantity, 0);
  }

  function getTotalPrice() {
    const amount = cart.reduce((total, item) => total + item.total, 0);
    return amount.toFixed(2);
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.lightGray2,
  },
});

export default Restaurant;
