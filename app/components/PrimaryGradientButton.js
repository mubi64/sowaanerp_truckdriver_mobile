import React from 'react';
import { Text, TouchableOpacity } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { styles } from '../helpers/styles';

const PrimaryGradientButton = ({onPress, text}) => {
    return (
        <TouchableOpacity onPress={onPress}>
            <LinearGradient colors={['#4CAF50', '#1B5E20']} start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }} style={styles.gradientButton}>
                <Text style={styles.buttonText}>{text}</Text>
            </LinearGradient>
        </TouchableOpacity>
    );
}

export default PrimaryGradientButton;
