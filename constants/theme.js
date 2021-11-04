import {Dimensions} from 'react-native';

const {width, height} = Dimensions.get('window');

export const COLORS = {
  primary: '#fc6d3f',
  secondary: '#cdcdd2',
  black: '#1e1f20',
  white: '#ffffff',
  transparent: 'transparent',
  lightGray: '#f5f5f6',
  lightGray2: '#f6f6f7',
  lightGray3: '#efeff1',
  lightGray4: '#f8f8f9',
  darkGray: '#898c95',
};

export const SIZES = {
  base: 8,
  font: 14,
  radius: 30,
  padding: 10,
  h1: 30,
  h2: 22,
  h3: 20,
  h4: 18,
  body1: 30,
  body2: 20,
  body3: 16,
  body4: 14,
  body5: 12,
  width,
  height,
};

export const FONTS = {
  h1: {
    fontFamily: 'VictorMono Nerd Font',
    fontSize: SIZES.h1,
    fontWeight: '900',
    lineHeight: 36,
  },
  h2: {
    fontFamily: 'VictorMono Nerd Font',
    fontSize: SIZES.h2,
    fontWeight: 'bold',
    lineHeight: 30,
  },
  h3: {
    fontFamily: 'VictorMono Nerd Font',
    fontSize: SIZES.h3,
    fontWeight: 'bold',
    lineHeight: 22,
  },
  h4: {
    fontFamily: 'VictorMono Nerd Font',
    fontSize: SIZES.h4,
    fontWeight: 'bold',
    lineHeight: 22,
  },
  body1: {
    fontFamily: 'VictorMono Nerd Font',
    fontSize: SIZES.body1,
    lineHeight: 36,
  },
  body2: {
    fontFamily: 'VictorMono Nerd Font',
    fontSize: SIZES.body2,
    lineHeight: 30,
  },
  body3: {
    fontFamily: 'VictorMono Nerd Font',
    fontSize: SIZES.body3,
    lineHeight: 22,
  },
  body4: {
    fontFamily: 'VictorMono Nerd Font',
    fontSize: SIZES.body4,
    lineHeight: 22,
  },
  body5: {
    fontFamily: 'VictorMono Nerd Font',
    fontSize: SIZES.body5,
    lineHeight: 22,
  },
};

export const THEME = {
  COLORS,
  SIZES,
  FONTS,
};

export default THEME;
