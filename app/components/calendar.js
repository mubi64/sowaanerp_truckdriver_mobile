import React from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { calendarStyles as styles } from '../styles/components/calendar.styles';

const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const getDayName = (year, month, day) => {
  const date = new Date(year, month, day);
  const dayIndex = date.getDay();
  return daysOfWeek[dayIndex];
};

const HorizontalDateCalendar = ({ selectedDate, onSelectDate, year, month }) => {
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const renderDayName = (dayName, index) => (
    <View style={styles.dayNameContainer} key={index}>
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
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
};

export default HorizontalDateCalendar;