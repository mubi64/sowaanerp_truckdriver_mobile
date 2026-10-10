import React from 'react';
import { Text, View } from 'react-native';
import { ActivityIndicator } from 'react-native-paper';
import { SECONDARY_COLOR } from '../assets/colors/colors';
import { loadingStyles as styles } from '../styles/components/loading.styles';

const Loading = () => {
    return (
        <View style={styles.loadingContainer}>
            <View style={styles.loadingBox}>
                <View style={styles.loadingRow}>
                    <ActivityIndicator size={'small'} color={SECONDARY_COLOR} />
                    <Text style={styles.loadingText}> Loading...</Text>
                </View>
            </View>
        </View>
    );
}

export default Loading;
