import { StyleSheet } from 'react-native';
import { BACKGROUND_COLOR, LOW_PRIOR_FONT_COLOR, PRIMARY_COLOR, PRIOR_FONT_COLOR, SECONDARY_COLOR } from '../assets/colors/colors';
import { horizontalScale, moderateScale, verticalScale } from './responsive';

export const styles = StyleSheet.create({
    flex_1: { flex: 1 },
    backgroundColor: { backgroundColor: BACKGROUND_COLOR },
    loginContainer: {
        flex: 1,
        alignItems: 'center',
        paddingVertical: verticalScale(80),
    },
    logoContainer: {
        width: horizontalScale(120),
        height: horizontalScale(120),
        borderRadius: horizontalScale(200),
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 6,
    },
    logoImageSize: {
        width: horizontalScale(90),
        height: verticalScale(80),
    },
    appTitle: {
        fontSize: moderateScale(30),
        color: SECONDARY_COLOR,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    loginPrompt: {
        fontFamily: 'Proxima Nova',
        fontSize: moderateScale(20),
        color: PRIOR_FONT_COLOR,
        fontWeight: '700',
        textAlign: 'center',
    },
    inputContainer: {
        width: horizontalScale(330),
        height: verticalScale(60),
    },
    inputStyle: {
        borderRadius: 8,
        borderColor: '#F4F4F4',
        borderWidth: 2,
        paddingLeft: 10,
        backgroundColor: 'white',
        height: verticalScale(50),
        color: PRIOR_FONT_COLOR,
    },
    gradientButton: {
        width: horizontalScale(320),
        height: verticalScale(50),
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 8,
    },
    buttonText: {
        color: 'white',
        fontSize: moderateScale(16),
        fontWeight: '700',
    },
    // Appbar Style
    appbar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
        paddingHorizontal: 20
    },
    centerRow: { flexDirection: 'row', alignItems: 'center' },
    greeting: {
        color: LOW_PRIOR_FONT_COLOR,
    },
    appbar_location: {
        color: PRIOR_FONT_COLOR,
        fontWeight: 'bold', fontSize: 16,
    },
    notify_container: {
        height: verticalScale(30),
        width: horizontalScale(30),
        backgroundColor: 'white',
    },
    container: { flex: 1, backgroundColor: BACKGROUND_COLOR },
    headerContainer: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        backgroundColor: 'white',
    },
    header: {
        width: horizontalScale(335),
        height: verticalScale(50),
        alignSelf: 'center',
        justifyContent: 'space-between',
        flexDirection: 'row',
    },
    titleContainer: {
        marginBottom: 20,
        marginLeft: 16,
    },
    title: {
        fontFamily: 'Outfit-Bold',
        color: PRIOR_FONT_COLOR,
        fontSize: moderateScale(26),
    },
    subtitle: {
        fontFamily: 'Outfit-Regular',
        color: PRIOR_FONT_COLOR,
        fontSize: moderateScale(26),
    },
    fontBold: {
        fontFamily: 'Outfit-Bold',
    },
    fontReguler: {
        fontFamily: 'Outfit-Regular',
    },
    sortText: {
        fontFamily: 'Outfit-Regular',
        color: SECONDARY_COLOR,
        fontSize: moderateScale(16),
        alignSelf: 'center',
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 12,
        paddingHorizontal: 8,
        paddingVertical: 4,
        marginHorizontal: 20,
        shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 5, elevation: 2,
    },
    searchIcon: {
        alignSelf: 'center',
        marginLeft: horizontalScale(10),
    },
    searchInput: {
        width: horizontalScale(270),
        alignSelf: 'center',
        height: verticalScale(45),
        fontSize: moderateScale(20),
        marginLeft: horizontalScale(10),
        color: PRIOR_FONT_COLOR,
        flex: 1,
    },
    calendar: {
        height: verticalScale(50),
        width: '100%',
    },
    dateText: {
        fontFamily: 'Outfit-Medium',
        color: PRIOR_FONT_COLOR,
        fontSize: moderateScale(24),
        fontWeight: 900,
        marginLeft: horizontalScale(15),
    },
    loader: {
        alignSelf: 'center',
        marginTop: verticalScale(20),
    },
    itemTitle: {
        fontFamily: 'Outfit-Medium',
        color: PRIOR_FONT_COLOR,
        fontSize: moderateScale(25),
    },
    itemSubtitle: {
        fontFamily: 'Outfit-Regular',
        color: LOW_PRIOR_FONT_COLOR,
        fontSize: moderateScale(20),
    },
    image: {
        width: horizontalScale(150),
        height: verticalScale(100),
        position: 'absolute',
        right: 0,
        bottom: verticalScale(10),
    },
    results: {
        fontFamily: 'Outfit-Medium',
        color: LOW_PRIOR_FONT_COLOR,
        fontSize: moderateScale(20),
        marginLeft: horizontalScale(15),
        marginVertical: verticalScale(10),
    },
    itemContainer: {
        alignSelf: 'center',
        backgroundColor: PRIMARY_COLOR,
        padding: 15,
        marginTop: 10,
        borderRadius: 15,
        width: '92%',
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 5, elevation: 2,
        overflow: 'hidden',
        flexWrap: 'wrap'
    },
    itemWidth: {
        width: horizontalScale(315),
        alignSelf: 'center',
    },
    rowBetween: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    row: {
        flexDirection: 'row',
    },
    itemHeading: {
        fontFamily: 'Outfit-Medium',
        fontWeight: 'bold', fontSize: 16,
    },
    itemSubHeading: {
        fontFamily: 'Outfit-Medium',
        color: LOW_PRIOR_FONT_COLOR,
        fontSize: moderateScale(12),
        fontWeight: 'bo',
    },
    itemDistance: {
        fontFamily: 'Outfit-Regular',
        color: SECONDARY_COLOR,
        fontSize: moderateScale(12),
    },
    status: {
        position: 'absolute',
        right: verticalScale(0),
        bottom: verticalScale(0),
        color: 'white',
        padding: 6,
        borderTopLeftRadius: 10,
        borderBottomRightRadius: 10,
    },
    locationIcon: {
        color: SECONDARY_COLOR,
        marginRight: 2,
    },
    locationText: {
        color: PRIOR_FONT_COLOR,
        minWidth: 0,
    },
    locationDateText: {
        color: LOW_PRIOR_FONT_COLOR,
        fontSize: moderateScale(14),
    },
    notFondText: {
        fontFamily: 'Outfit-Regular',
        color: PRIOR_FONT_COLOR,
        fontSize: moderateScale(25),
        marginLeft: horizontalScale(15),
    },
    // Calender Style
    dateNumberStyle: {
        color: LOW_PRIOR_FONT_COLOR,
        fontSize: moderateScale(20),
        fontFamily: 'Outfit-SemiBold',
    },
    dateNameStyle: {
        color: LOW_PRIOR_FONT_COLOR,
        fontSize: moderateScale(16),
        fontFamily: 'Outfit-Regular',
    },
    highlightDateNameStyle: {
        color: SECONDARY_COLOR,
        fontSize: moderateScale(16),
        fontFamily: 'Outfit-Regular',
    },
    highlightDateNumberStyle: {
        color: SECONDARY_COLOR,
        fontSize: moderateScale(20),
        fontFamily: 'Outfit-SemiBold',
    },
    point: {
        height: verticalScale(20),
        width: horizontalScale(20),
        backgroundColor: SECONDARY_COLOR,
        borderRadius: horizontalScale(100),
        boxShadow: '0px 0px 5px 0px rgba(0,0,0,0.75)',
        elevation: 10,
        marginVertical: 10,
    },
    road: {
        flex: 1,
        width: 2,
        borderTopWidth: 3,
        borderStyle: 'dashed',
        borderColor: LOW_PRIOR_FONT_COLOR,
    },
    track_truck: {
        height: verticalScale(70),
        width: horizontalScale(70),
        position: 'absolute',
        bottom: -21,
        left: 40,
    },
    mt_10: { marginTop: verticalScale(10) },
    mt_20: { marginTop: verticalScale(20) },
    mb_3: { marginBottom: 3 },
    itemCenter: { alignItems: 'center' },
    flexEnd: { justifyContent: 'flex-end' },
    uploadButton: { flexDirection: 'row', backgroundColor: SECONDARY_COLOR, padding: 10, marginTop: 10, borderRadius: 5, alignItems: 'center', justifyContent: 'center' },
});
