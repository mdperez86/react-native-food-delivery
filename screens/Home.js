import React, {useState} from 'react';
import {
  Text,
  View,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';
import {FlatList} from 'react-native-gesture-handler';
import categories from '../api/categories';
import restaurantList from '../api/restaurants';
import {COLORS, FONTS, ICONS, SIZES} from '../constants';

export function Home({navigation}) {
  const [restaurants, setRestaurants] = useState(restaurantList);
  const [location, setLocation] = useState({
    streetName: 'Placilla',
    gps: {
      latitude: -33.4572088,
      longitude: -70.6941162,
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      <Header location={location} />
      <MainCategories onSelectCategory={handleSelectedCategory} />
      <RestaurantList
        restaurants={restaurants}
        onSelectRestaurant={handleSelectedRestaurant}
      />
    </SafeAreaView>
  );

  function handleSelectedCategory(category) {
    if (category) {
      setRestaurants(getRestaurantsByCategory(category));
    }
  }

  function getRestaurantsByCategory(category) {
    return restaurantList.filter(byCategory);

    function byCategory(restaurant) {
      return restaurant?.categories?.includes(category?.id);
    }
  }

  function handleSelectedRestaurant(restaurant) {
    navigation.navigate('Restaurant', {
      item: restaurant,
      currentLocation: location,
    });
  }
}

function Header({location}) {
  return (
    <View
      style={{
        flexDirection: 'row',
        height: 48,
        justifyContent: 'space-between',
        alignItems: 'center',
        margin: SIZES.padding * 0.5,
      }}>
      <TouchableOpacity
        style={{
          width: 48,
          paddingLeft: SIZES.padding * 2,
          justifyContent: 'center',
        }}>
        <Image
          source={ICONS.nearby}
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
            {location?.streetName}
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
          source={ICONS.basket}
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

function MainCategories({onSelectCategory}) {
  const [selectedCategory, setSelectedCategory] = useState(null);

  return (
    <View style={{padding: SIZES.padding * 2}}>
      <Text style={{...FONTS.h1, color: COLORS.black}}>Categories</Text>
      <FlatList
        data={categories}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={item => `${item?.id}`}
        renderItem={renderItem}
        contentContainerStyle={{
          padding: SIZES.padding * 0.5,
        }}
      />
    </View>
  );

  function handleSelectedCategory(category) {
    setSelectedCategory(category);
    onSelectCategory(category);
  }

  function renderItem({item}) {
    return (
      <CategoryListItem
        category={item}
        selected={selectedCategory?.id === item?.id}
        onSelectCategory={handleSelectedCategory}
      />
    );
  }
}

function CategoryListItem({category, selected, onSelectCategory}) {
  return (
    <TouchableOpacity
      style={{
        padding: SIZES.padding,
        paddingBottom: SIZES.padding * 1.5,
        backgroundColor: selected ? COLORS.primary : COLORS.white,
        borderRadius: SIZES.radius,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: SIZES.padding,
        elevation: 3,
      }}
      onPress={handleSelectedCategory}>
      <View
        style={{
          width: 52,
          height: 52,
          borderRadius: 26,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: selected ? COLORS.white : COLORS.lightGray,
        }}>
        <Image
          source={category?.icon}
          resizeMode="contain"
          style={{width: 36, height: 36}}
        />
      </View>
      <Text
        style={{
          marginTop: SIZES.padding,
          color: selected ? COLORS.white : COLORS.black,
          ...FONTS.body5,
        }}>
        {category?.name}
      </Text>
    </TouchableOpacity>
  );

  function handleSelectedCategory() {
    onSelectCategory(category);
  }
}

function RestaurantList({restaurants, onSelectRestaurant}) {
  return (
    <FlatList
      data={restaurants}
      key={item => `${item?.id}`}
      renderItem={renderItem}
      contentContainerStyle={{
        paddingHorizontal: SIZES.padding * 2,
        paddingBottom: 32,
      }}
    />
  );

  function renderItem({item}) {
    return (
      <RestaurantListItem
        restaurant={item}
        onSelectRestaurant={onSelectRestaurant}
      />
    );
  }
}

function RestaurantListItem({restaurant, onSelectRestaurant}) {
  return (
    <TouchableOpacity
      style={{marginBottom: SIZES.padding * 6}}
      onPress={handleRestaurantPress}>
      <View style={{marginBottom: SIZES.padding}}>
        <Image
          source={restaurant?.photo}
          resizeMode="cover"
          style={{
            width: '100%',
            height: 200,
            borderRadius: SIZES.radius,
          }}
        />
        <View
          style={{
            position: 'absolute',
            bottom: 0,
            height: 48,
            width: SIZES.width * 0.3,
            backgroundColor: COLORS.white,
            borderTopRightRadius: SIZES.radius,
            borderBottomLeftRadius: SIZES.radius,
            alignItems: 'center',
            justifyContent: 'center',
            elevation: 1,
          }}>
          <Text style={{...FONTS.h4, color: COLORS.darkGray}}>
            {restaurant?.duration}
          </Text>
        </View>
      </View>

      <Text style={{...FONTS.body2, color: COLORS.black}}>
        {restaurant?.name}
      </Text>

      <View
        style={{
          marginTop: SIZES.padding,
          flexDirection: 'row',
        }}>
        <Image
          source={ICONS.star}
          style={{
            width: 20,
            height: 20,
            tintColor: COLORS.primary,
            marginRight: 8,
          }}
        />
        <Text style={{...FONTS.body3, color: COLORS.black}}>
          {restaurant?.rating}
        </Text>

        <View style={{flexDirection: 'row', marginLeft: 8}}>
          {getRestaurantCategories(restaurant).map(category => (
            <View style={{flexDirection: 'row'}} key={category?.id}>
              <Text style={{...FONTS.body3, color: COLORS.darkGray}}>
                {category?.name}
              </Text>
              <Text style={{...FONTS.h3, color: COLORS.darkGray}}> . </Text>
            </View>
          ))}
          {[1, 2, 3].map(rating => (
            <Text
              key={rating}
              style={{
                ...FONTS.body3,
                color:
                  rating <= restaurant?.price ? COLORS.black : COLORS.darkGray,
              }}>
              $
            </Text>
          ))}
        </View>
      </View>
    </TouchableOpacity>
  );

  function handleRestaurantPress() {
    onSelectRestaurant(restaurant);
  }

  function getRestaurantCategories(restaurant) {
    return restaurant?.categories?.map(mapToCategory);

    function mapToCategory(categoryId) {
      return categories.find(findCategoryById);

      function findCategoryById(category) {
        return category.id === categoryId;
      }
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.lightGray4,
  },
  shadow: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 1,
  },
});

export default Home;
