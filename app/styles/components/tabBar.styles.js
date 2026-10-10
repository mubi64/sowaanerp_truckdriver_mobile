import { StyleSheet } from 'react-native';
import { PRIMARY_COLOR } from '../../assets/colors/colors';

export const tabBarStyles = StyleSheet.create({
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
    paddingBottom: 20,
    borderTopColor: '#ddd',
    borderTopWidth: 1,
    backgroundColor: PRIMARY_COLOR,
  },
  tabButton: { alignItems: 'center' },
});
