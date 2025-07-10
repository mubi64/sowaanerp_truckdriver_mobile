import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { ActivityIndicator } from 'react-native-paper';
import { LOW_PRIOR_FONT_COLOR, PRIMARY_COLOR, SECONDARY_COLOR } from '../assets/colors/colors';
import { horizontalScale, moderateScale, verticalScale } from '../helpers/responsive';

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

const styles = StyleSheet.create({
    loadingContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.4)',
        flex: 1,
    },
    loadingBox: {
        width: horizontalScale(250),
        height: verticalScale(70),
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
        backgroundColor: PRIMARY_COLOR,
        borderColor: SECONDARY_COLOR,
        borderWidth: 1,
    },
    loadingText: {
        fontSize: moderateScale(25),
        color: LOW_PRIOR_FONT_COLOR,
    },
    loadingRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
});

export default Loading;
