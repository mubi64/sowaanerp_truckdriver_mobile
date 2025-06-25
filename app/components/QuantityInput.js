import React from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet } from 'react-native';

const QuantityInput = ({ value, setValue, index, defultValue, min = 0, max = 999 }) => {
    const increment = () => {
        const current = parseInt(value || '0');
        if (current < max) {
            setValue(prev => ({ ...prev, [index]: String(current + 1) }));
        }
    };

    const decrement = () => {
        const current = parseInt(value || '0');
        if (current > min) {
            setValue(prev => ({ ...prev, [index]: String(current - 1) }));
        }
    };

    const handleChange = (text) => {
        const num = parseInt(text) || 0;
        if (num >= min && num <= max) {
            setValue(prev => ({ ...prev, [index]: String(num) }));
        }
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={decrement} style={styles.button}>
                <Text style={styles.buttonText}>−</Text>
            </TouchableOpacity>
            <TextInput
                style={styles.input}
                keyboardType="numeric"
                value={value}
                onChangeText={handleChange}
                defaultValue={defultValue ? String(defultValue) : '0'}
            />
            <TouchableOpacity onPress={increment} style={styles.button}>
                <Text style={styles.buttonText}>＋</Text>
            </TouchableOpacity>
        </View>
    );
};

export default QuantityInput;

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderRadius: 5,
        borderColor: '#ccc',
        overflow: 'hidden',
    },
    button: {
        backgroundColor: '#ddd',
        paddingHorizontal: 10,
        paddingVertical: 6,
    },
    buttonText: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    input: {
        width: 50,
        textAlign: 'center',
        paddingVertical: 4,
    },
});
