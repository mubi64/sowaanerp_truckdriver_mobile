import React from 'react';
import { View, Text, FlatList, StyleSheet, Dimensions,TouchableOpacity } from 'react-native';

const windowWidth = Dimensions.get('window').width;
const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const getDayName = (year, month, day) => {
  const date = new Date(year, month, day);
  const dayIndex = date.getDay();
  return daysOfWeek[dayIndex];
};

const HorizontalDateCalendar = ({ selectedDate, onSelectDate, year, month }) => {
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const renderDayName = (dayName) => (
    <View style={styles.dayNameContainer} key={dayName}>
      <Text style={styles.dayName}>{dayName}</Text>
    </View>
  );

  const renderDateItem = ({ item }) => {
    const day = item + 1; // Days are 1-based
    const isSelected = selectedDate === day;
    const dayName = getDayName(year, month, day);

    return (
      <TouchableOpacity
        style={[styles.dateItem, isSelected && styles.selectedDateItem]}
        onPress={() => onSelectDate(day)}
      >
        <Text style={[styles.dateText, isSelected && styles.selectedDateText]}>
          {day}
        </Text>
        <Text style={styles.dayName}>{dayName}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.dayNamesRow}>
        {daysOfWeek.map(renderDayName)}
      </View>
      <FlatList
        data={Array.from({ length: daysInMonth }, (_, index) => index)}
        renderItem={renderDateItem}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.toString()}
        contentContainerStyle={{ width: windowWidth }} // Ensures horizontal scrolling
      />
    </View>
  );
};

const styles = StyleSheet.create({
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
});

export default HorizontalDateCalendar;