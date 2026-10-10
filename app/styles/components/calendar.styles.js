import { StyleSheet, Dimensions } from 'react-native';

const windowWidth = Dimensions.get('window').width;

export const calendarStyles = StyleSheet.create({
  container: {
    padding: 0,
  },
  dayNamesRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  dayNameContainer: {
    flex: 1,
    alignItems: 'center',
  },
  dayName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  dateItem: {
    borderRadius: 20,
    padding: 10,
    marginHorizontal: 5,
    backgroundColor: 'white',
    alignItems: 'center',
  },
  selectedDateItem: {
    backgroundColor: 'blue', // Change to your preferred color for selected date
  },
  dateText: {
    textAlign: 'center',
    fontSize: 16,
  },
  selectedDateText: {
    color: 'white',
  },
  listContent: { width: windowWidth }, // Ensures horizontal scrolling
});
