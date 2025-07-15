import React, { useCallback, useEffect, useState } from 'react';
import {
    View,
    Text,
    TextInput,
    FlatList,
    TouchableOpacity,
    StyleSheet,
    Alert,
    Image,
    ScrollView,
} from 'react-native';
import { CheckBox, Icon } from '@rneui/base';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { httpGet, httpPOST, httpPUT, uploadToERP } from '../network calls/networkCalls';
import PrimaryGradientButton from '../components/PrimaryGradientButton';
import Toast from 'react-native-toast-message';
import Loading from '../components/Loading';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { SECONDARY_COLOR } from '../assets/colors/colors';
import QuantityInput from '../components/QuantityInput';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button, Overlay, ListItem } from '@rneui/themed';

const Items = ({ route }) => {
    const navigation = useNavigation();
    const { note, trip, stop } = route.params;
    const [dNote, setDNote] = useState([]);
    const [items, setItems] = useState([]);
    const [reasons, setReasons] = useState([]);

    const [deliveredQty, setDeliveredQty] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [selectedReasons, setSelectedReasons] = useState([]);
    const [visibleOverlays, setVisibleOverlays] = useState([]);

    const openOverlay = (i) => {
        const updated = [...visibleOverlays];
        updated[i] = true;
        setVisibleOverlays(updated);
    };

    const closeOverlay = (i) => {
        const updated = [...visibleOverlays];
        updated[i] = false;
        setVisibleOverlays(updated);
    };

    const handleSelect = (value, i) => {
        const updated = [...selectedReasons];
        updated[i] = value;
        setSelectedReasons(updated);
        closeOverlay(i);
    };


    useFocusEffect(
        useCallback(() => {
            const getDeliveryNotes = async () => {
                try {
                    setLoading(true);
                    const response = await httpGet(`/api/resource/Delivery Note/${note}`);
                    if (response?.data?.items) {
                        setDNote(response.data);
                        const withImageList = response.data.items.map(item => ({
                            ...item,
                            custom_item_images: item.custom_item_images || [],
                        }));
                        setItems(withImageList);
                    } else {
                        throw new Error('No items found in this delivery note.');
                    }
                } catch (err) {
                    setError(err.message);
                    Toast.show({
                        type: 'error',
                        text1: 'Error',
                        text2: err.message,
                        position: 'top',
                    });
                } finally {
                    setLoading(false);
                }
            };
            getDeliveryNotes();
        }, [note])
    );

    useEffect(() => {
        const getDeliveryReasons = async () => {
            try {
                const response = await httpGet(`/api/resource/Delivery%20Reason?limit_page_length=5000&fields=["name","enabled"]&filters=[["enabled","=",1]]`);
                if (response?.data) {
                    setReasons(response.data);
                } else {
                    setReasons([{ name: 'Other', enabled: 1 }])
                }
            } catch (error) {
                Toast.show({
                    type: 'error',
                    text1: 'Error',
                    text2: error.message,
                    position: 'top',
                });
            }
        }
        getDeliveryReasons();
    }, []);


    const toggleDelivered = (index) => {
        const updated = [...items];
        updated[index].custom_delivered = !updated[index].custom_delivered;
        if (updated[index].custom_delivered) {
            updated[index].custom_return = false;
            updated[index].custom_reason = '';
        }
        setItems(updated);
    };

    const toggleReturn = (index) => {
        const updated = [...items];
        updated[index].custom_return = !updated[index].custom_return;
        if (updated[index].custom_return) {
            updated[index].custom_delivered = false;
            updated[index].x = [];
        }
        setItems(updated);
    };

    const handleReasonChange = (text, index) => {
        const updated = [...items];
        updated[index].custom_reason = text;
        setItems(updated);
    };

    const handleUploadImage = (index) => {
        Alert.alert(
            'Upload Image',
            'Choose an option',
            [
                { text: 'Camera', onPress: () => pickFromCamera(index) },
                { text: 'Gallery', onPress: () => pickFromGallery(index) },
                { text: 'Cancel', style: 'cancel' },
            ],
            { cancelable: true }
        );
    };

    const imageOptions = {
        mediaType: 'photo',
        quality: 1,
        includeBase64: false,
    };

    const pickFromCamera = (index) => {
        launchCamera(imageOptions, (response) => {
            const selectedAsset = response.assets?.[0];
            if (selectedAsset) {
                const updated = [...items];
                updated[index].custom_item_images = [...(updated[index].custom_item_images || []), selectedAsset.uri];
                setItems(updated);
            }
        });
    };

    const pickFromGallery = (index) => {
        launchImageLibrary(imageOptions, (response) => {
            const selectedAsset = response.assets?.[0];
            if (selectedAsset) {
                const updated = [...items];
                updated[index].custom_item_images = [...(updated[index].custom_item_images || []), selectedAsset.uri];
                setItems(updated);
            }
        });
    };

    const handleSubmit = async () => {
        let allValid = true;
        for (let i = 0; i < items.length; i++) {
            const item = items[i];
            if (!item.custom_delivered && !item.custom_return) {
                allValid = false;
                Toast.show({ type: 'error', text1: item.item_name, text2: 'Select Delivered or Return', position: 'top' });
                break;
            }
            if (item.custom_return && !item.custom_reason) {
                allValid = false;
                Toast.show({ type: 'error', text1: item.item_name, text2: 'Provide return reason', position: 'top' });
                break;
            }
            if (item.custom_delivered && (!item.custom_item_images || item.custom_item_images.length === 0)) {
                allValid = false;
                Toast.show({ type: 'error', text1: item.item_name, text2: 'Upload at least one image', position: 'top' });
                break;
            }
        }
        if (!allValid) return;
        updateDeliveryNote();

    };

    const updateDeliveryNote = async () => {
        try {
            setLoading(true);
            const returnNoteItems = [];
            const updatedItems = await Promise.all(
                items.map(async (item, i) => {
                    const uploadedImages = await Promise.all(
                        (item.custom_item_images || []).map(async (uri) =>
                            uri.startsWith('file') ? await uploadToERP(uri) : uri
                        )
                    );
                    return { ...item, custom_item_images: uploadedImages };
                })
            );
            const deliveredItems = updatedItems.map((item, i) => {
                const delivered = parseFloat(deliveredQty[i] > 0 ? deliveredQty[i] : item.qty);
                const original = parseFloat(item.qty);

                if (item.custom_delivered && delivered < original) {
                    const returnedQty = original - delivered;
                    returnNoteItems.push({
                        ...item,
                        qty: returnedQty * -1,
                        stock_qty: returnedQty * -1,
                        custom_return: 1,
                        custom_delivered: 0,
                        custom_item_images: item.custom_item_images.toString(),
                        custom_first_image: item.custom_item_images?.[0] || '',
                        custom_second_image: item.custom_item_images?.[1] || '',
                        custom_third_image: item.custom_item_images?.[2] || '',
                        // custom_item_images: '',
                        // custom_reason: 'Partially delivered - balance returned', // or item.custom_reason
                    });
                }
                return {
                    ...item,
                    custom_item_images: item.custom_item_images.toString(),
                    custom_first_image: item.custom_item_images?.[0] || '',
                    custom_second_image: item.custom_item_images?.[1] || '',
                    custom_third_image: item.custom_item_images?.[2] || '',
                    custom_delivered: item.custom_delivered || 0,
                    custom_return: item.custom_return || 0,
                    custom_reason: item.custom_reason || '',
                };
            });
            const payload = {
                items: deliveredItems,
            };

            const response = await httpPUT(`/api/resource/Delivery Note/${note}`, payload);
            if (response?.data) {
                Toast.show({ type: 'success', text1: 'Success', text2: 'Delivery Note updated!' });
                await httpPUT(`/api/resource/Delivery Trip/${trip}`, { delivery_stops: stop });
                setItems([]);
                // navigation.navigate('Details', { data: trip });
                returnDeliveryNote(returnNoteItems);
                navigation.navigate('DriverSignature', { name: note, trip: trip });
            } else {
                throw new Error(response.error || 'Unknown error');
            }
        } catch (error) {
            Toast.show({ type: 'error', text1: 'Update Failed', text2: error.message || 'Something went wrong!' });
        } finally {
            setLoading(false);
        }
    };


    const returnDeliveryNote = async (returnNoteItems) => {
        console.log('Return Note Items:', returnNoteItems);

        if (returnNoteItems.length > 0) {
            const returnNotePayload = {
                ...dNote,
                docstatus: 0,
                is_return: 1,
                return_against: note,
                items: returnNoteItems,
            };
            console.log('Return Note Payload:', JSON.stringify(returnNotePayload, null, 2));

            try {
                const response = await httpPOST('/api/resource/Delivery Note', returnNotePayload);
                if (response?.data) {
                    Toast.show({
                        type: 'success',
                        text1: 'Return Note Created',
                        text2: `Return Delivery Note: ${response.data.name}`,
                    });
                }
            } catch (error) {
                Toast.show({
                    type: 'error',
                    text1: 'Failed to Create Return Note',
                    text2: error.message || 'Something went wrong!',
                });
            }
        }
    };

    const renderItem = ({ item, index }) => {
        return (
            <View key={index} style={styles.itemCard}>
                <Text style={styles.itemTitle}>{item.item_name} | {item.qty}</Text>
                <View style={styles.checkboxRow}>
                    <CheckBox
                        containerStyle={styles.checkboxContainer}
                        title="Delivered" checked={item.custom_delivered} onPress={() => toggleDelivered(index)} />
                    <CheckBox containerStyle={styles.checkboxContainer} title="Return" checked={item.custom_return} onPress={() => toggleReturn(index)} />
                </View>
                <View style={styles.QTYRow}>
                    <QuantityInput
                        value={deliveredQty[index] || item.qty.toString()}
                        setValue={setDeliveredQty}
                        index={index}
                        defultValue={item.qty}
                        min={0}
                        max={item.qty} />
                </View>
                {item.custom_return || (deliveredQty[index] < item.qty) ?
                    <View>
                        <View style={{ marginVertical: 20 }}>
                            <TouchableOpacity onPress={() => openOverlay(index)}>
                                <Text style={{
                                    padding: 10,
                                    borderWidth: 1,
                                    borderRadius: 5,
                                    borderColor: '#ccc'
                                }}>
                                    {selectedReasons[index] || 'Select Reason'}
                                </Text>
                            </TouchableOpacity>
                            <Overlay overlayStyle={{ width: '90%' }} isVisible={visibleOverlays[index]}
                                onBackdropPress={() => closeOverlay(index)}>
                                <View>
                                    {reasons && reasons.map((option, id) => (
                                        <ListItem key={id} onPress={() => {
                                            handleSelect(option.name, index);
                                            if (option.name !== 'Other') {
                                                handleReasonChange(option.name, index);
                                            }
                                        }}>
                                            <ListItem.Content>
                                                <ListItem.Title>{option.name}</ListItem.Title>
                                            </ListItem.Content>
                                        </ListItem>
                                    ))}
                                </View>
                            </Overlay>
                        </View>
                        {selectedReasons[index] === 'Other' &&
                            <TextInput
                                placeholder="Reason for return"
                                placeholderTextColor="black"
                                value={item.custom_reason}
                                onChangeText={text => handleReasonChange(text, index)}
                                style={styles.input} />
                        }
                    </View> : null
                }

                {item.custom_return && (
                    <View style={{ marginTop: 10 }}>
                        <ScrollView horizontal>
                            {Array.isArray(item.custom_item_images) && (item.custom_item_images || []).map((imgUri, i) => (
                                <Image key={i} source={{ uri: imgUri }} style={styles.previewImage} />
                            ))}
                        </ScrollView>
                        {item.custom_item_images.length < 3 &&
                            <TouchableOpacity style={styles.uploadButton} onPress={() => handleUploadImage(index)}>
                                <Icon name="camera" type="feather" color="#fff" />
                                <Text style={styles.uploadText}>Add Image</Text>
                            </TouchableOpacity>
                        }
                    </View>
                )
                }
                {item.custom_delivered && (
                    <View style={{ marginTop: 10 }}>
                        <ScrollView horizontal>
                            {Array.isArray(item.custom_item_images) && (item.custom_item_images || []).map((imgUri, i) => (
                                <Image key={i} source={{ uri: imgUri }} style={styles.previewImage} />
                            ))}
                        </ScrollView>
                        {item.custom_item_images.length < 3 &&
                            <TouchableOpacity style={styles.uploadButton} onPress={() => handleUploadImage(index)}>
                                <Icon name="camera" type="feather" color="#fff" />
                                <Text style={styles.uploadText}>Add Image</Text>
                            </TouchableOpacity>
                        }
                    </View>
                )
                }
            </View >
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            {/* <Appbar /> */}
            {loading ? <Loading /> : error ? (
                <View style={{ padding: 20 }}>
                    <Text style={{ color: 'red', fontSize: 16, textAlign: 'center' }}>{error}</Text>
                </View>
            ) : (
                <>
                    <FlatList
                        data={items}
                        keyExtractor={(item, index) => `${item.item_code}_${index}`}
                        renderItem={renderItem}
                        contentContainerStyle={{ paddingBottom: 80 }}
                    />
                    <View style={styles.submitContainer}>
                        <PrimaryGradientButton onPress={handleSubmit} text="Submit" />
                    </View>
                </>
            )}
        </SafeAreaView>
    );
};

export default Items;

const styles = StyleSheet.create({
    container: { flex: 1 },
    itemCard: { backgroundColor: '#f4f4f4', padding: 8, paddingVertical: 6, borderRadius: 10, marginBottom: 10, marginHorizontal: 10 },
    itemTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 8 },
    checkboxRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', textAlign: 'center' },
    QTYRow: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', textAlign: 'center' },
    input: { borderColor: '#ccc', borderWidth: 1, paddingHorizontal: 10, borderRadius: 5 },
    uploadButton: { flexDirection: 'row', backgroundColor: SECONDARY_COLOR, padding: 10, marginTop: 10, borderRadius: 5, alignItems: 'center', justifyContent: 'center' },
    uploadText: { color: '#fff', marginLeft: 8, fontWeight: '600' },
    submitContainer: { padding: 10, borderTopWidth: 1, borderColor: '#ddd', alignItems: 'center', backgroundColor: '#fff', position: 'absolute', bottom: 0, left: 0, right: 0 },
    previewImage: { width: 80, height: 80, marginRight: 8, borderRadius: 8, borderWidth: 1, borderColor: '#ccc' },
    checkboxContainer: {
        borderWidth: 0,
        margin: 0,
        marginRight: 0,
        borderRadius: 5,
    },
});
