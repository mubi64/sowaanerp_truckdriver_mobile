// import React, { useCallback, useState } from 'react';
// import {
//     View,
//     Text,
//     TextInput,
//     FlatList,
//     TouchableOpacity,
//     StyleSheet,
//     Alert,
//     Image,
// } from 'react-native';
// import { CheckBox, Icon } from '@rneui/base';
// import { useFocusEffect, useNavigation } from '@react-navigation/native';
// import { httpGet, httpPUT, uploadToERP } from '../network calls/networkCalls';
// import Appbar from '../components/appbar';
// import PrimaryGradientButton from '../components/PrimaryGradientButton';
// import Toast from 'react-native-toast-message';
// import Loading from '../components/Loading';
// import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
// import { SECONDARY_COLOR } from '../assets/colors/colors';


// const Items = ({ route }) => {
//     const navigation = useNavigation();
//     const [items, setItems] = useState([]);
//     const [loading, setLoading] = useState(false);
//     const [error, setError] = useState('');
//     const { note, trip, stop } = route.params;

//     useFocusEffect(
//         useCallback(() => {
//             const getDeliveryNotes = async () => {
//                 try {
//                     setLoading(true);
//                     const response = await httpGet(`/api/resource/Delivery Note/${note}`);
//                     if (response?.data?.items) {
//                         setItems(response.data.items);
//                     } else {
//                         throw new Error('No items found in this delivery note.');
//                     }
//                 } catch (err) {
//                     console.log('Error fetching delivery note:', err);
//                     setError(err.message);
//                     Toast.show({
//                         type: 'error',
//                         text1: 'Error',
//                         text2: err.message,
//                         position: 'top',
//                     });
//                 } finally {
//                     setLoading(false);
//                 }
//             };

//             getDeliveryNotes();
//         }, [note])
//     );

//     const toggleDelivered = (index) => {
//         const updated = [...items];
//         updated[index].custom_delivered = !updated[index].custom_delivered;
//         if (updated[index].custom_delivered) {
//             updated[index].custom_return = false;
//             updated[index].custom_reason = '';
//         }
//         setItems(updated);
//     };

//     const toggleReturn = (index) => {
//         const updated = [...items];
//         updated[index].custom_return = !updated[index].custom_return;
//         if (updated[index].custom_return) {
//             updated[index].custom_delivered = false;
//             updated[index].image = null;
//         }
//         setItems(updated);
//     };

//     const handleReasonChange = (text, index) => {
//         const updated = [...items];
//         updated[index].custom_reason = text;
//         setItems(updated);
//     };

//     const handleUploadImage = (index) => {
//         Alert.alert(
//             'Upload Image',
//             'Choose an option',
//             [
//                 {
//                     text: 'Camera',
//                     onPress: () => pickFromCamera(index),
//                 },
//                 {
//                     text: 'Gallery',
//                     onPress: () => pickFromGallery(index),
//                 },
//                 {
//                     text: 'Cancel',
//                     style: 'cancel',
//                 },
//             ],
//             { cancelable: true }
//         );
//     };

//     const imageOptions = {
//         mediaType: 'photo',
//         quality: 1,
//         includeBase64: false,
//     };

//     const pickFromCamera = (index) => {
//         launchCamera(imageOptions, (response) => {
//             if (response.didCancel) return;
//             if (response.errorCode || response.errorMessage) {
//                 Toast.show({
//                     type: 'error',
//                     text1: 'Camera Error',
//                     text2: response.errorMessage || 'Something went wrong.',
//                 });
//             } else {
//                 if (response?.assets?.length) {
//                     const selectedAsset = response.assets[0];
//                     const updated = [...items];
//                     updated[index].custom_item_image = [...(updated[index].custom_item_image || []), selectedAsset.uri];
//                     setItems(updated);
//                 }
//             }
//         });
//     };

//     const pickFromGallery = (index) => {
//         launchImageLibrary(imageOptions, (response) => {
//             if (response.didCancel) return;
//             if (response.errorCode || response.errorMessage) {
//                 Toast.show({
//                     type: 'error',
//                     text1: 'Gallery Error',
//                     text2: response.errorMessage || 'Something went wrong.',
//                 });
//             } else {
//                 if (response?.assets?.length) {
//                     const selectedAsset = response.assets[0];
//                     const updated = [...items];
//                     updated[index].custom_item_image = [...(updated[index].custom_item_image || []), selectedAsset.uri];
//                     setItems(updated);
//                 }
//             }
//         });
//     };


//     const handleSubmit = async () => {
//         let allValid = true;

//         for (let i = 0; i < items.length; i++) {
//             const item = items[i];

//             const isDelivered = item.custom_delivered;
//             const isReturned = item.custom_return;

//             if (!isDelivered && !isReturned) {
//                 allValid = false;
//                 Toast.show({
//                     type: 'error',
//                     text1: `${item.item_name}`,
//                     text2: 'Please select Delivered or Return for item',
//                     position: 'top',
//                 });
//                 break;
//             }

//             if (isReturned && !item.custom_reason) {
//                 allValid = false;
//                 Toast.show({
//                     type: 'error',
//                     text1: `${item.item_name}`,
//                     text2: 'Please provide a return reason for item',
//                     position: 'top',
//                 });
//                 break;
//             }

//             if (isDelivered && !item.custom_item_image) {
//                 allValid = false;
//                 Toast.show({
//                     type: 'error',
//                     text1: `${item.item_name}`,
//                     text2: 'Please upload an image for delivered item',
//                     position: 'top',
//                 });
//                 break;
//             }
//         }

//         if (!allValid) return;
//         try {
//             setLoading(true);
//             // Upload images for delivered items
//             const updatedItems = await Promise.all(
//                 items.map(async (item) => {
//                     if (item.custom_delivered && item.custom_item_image?.startsWith('file')) {
//                         const erpImageUrl = await uploadToERP(item.custom_item_image);
//                         return {
//                             ...item,
//                             custom_item_image: erpImageUrl,
//                         };
//                     }
//                     return item;
//                 })
//             );
//             const payload = {
//                 items: updatedItems.map(item => ({
//                     ...item,
//                     custom_delivered: item.custom_delivered || 0,
//                     custom_return: item.custom_return || 0,
//                     custom_reason: item.custom_reason || '',
//                     custom_item_image: item.custom_item_image || '',
//                 })),
//             };

//             console.log("checking payloafd", payload);

//             const response = await httpPUT(`/api/resource/Delivery Note/${note}`, payload);

//             if (response?.data) {
//                 Toast.show({
//                     type: 'success',
//                     text1: 'Success',
//                     text2: 'Delivery Note updated successfully!',
//                 });
//                 console.log('Updated Delivery Note:', response.data);
//                 const updatedStops = await httpPUT(`/api/resource/Delivery Trip/${trip}`, {
//                     delivery_stops: stop,
//                 });
//                 if (updatedStops.error) {
//                     throw new Error(updatedStops.error);
//                 } else {
//                     console.log('Updated Delivery Trip:', updatedStops.data);
//                 }
//                 setItems([]);
//                 setLoading(false);
//                 setError('');
//             } else {
//                 console.log(response, "want to check response");
//                 throw new Error(response.error || 'Unknown error');
//             }
//         } catch (error) {
//             console.log('Update failed:', error);
//             Toast.show({
//                 type: 'error',
//                 text1: 'Update Failed',
//                 text2: error.message || 'Something went wrong!',
//             });
//         } finally {
//             setLoading(false);
//             navigation.navigate('Details', { data: trip });
//         }

//     };


//     const renderItem = ({ item, index }) => (
//         <View key={index} style={styles.itemCard}>
//             <Text style={styles.itemTitle}>{item.item_name}</Text>

//             <View style={styles.checkboxRow}>
//                 <CheckBox
//                     title="Delivered"
//                     checked={item.custom_delivered}
//                     onPress={() => toggleDelivered(index)}
//                 />
//                 <CheckBox
//                     title="Return"
//                     checked={item.custom_return}
//                     onPress={() => toggleReturn(index)}
//                 />
//             </View>

//             {item.custom_return && (
//                 <TextInput
//                     placeholder="Reason for return"
//                     value={item.custom_reason}
//                     onChangeText={text => handleReasonChange(text, index)}
//                     style={styles.input}
//                 />
//             )}

//             {item.custom_delivered && (
//                 item.custom_item_image ? (
//                     <TouchableOpacity
//                         style={styles.imagePreviewWrapper}
//                         onPress={() => handleUploadImage(index)}
//                         activeOpacity={0.8}
//                     >
//                         <Text style={styles.imageLabel}>📷 Tap to change image</Text>
//                         <Image
//                             source={{ uri: item.custom_item_image }}
//                             style={styles.previewImage}
//                             resizeMode="cover"
//                         />
//                     </TouchableOpacity>

//                 ) : (
//                     <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginTop: 10 }}>
//                         {(item.custom_item_images || []).map((imgUri, i) => (
//                             <Image
//                                 key={i}
//                                 source={{ uri: imgUri }}
//                                 style={{ width: 80, height: 80, marginRight: 8, marginBottom: 8, borderRadius: 8 }}
//                             />
//                         ))}
//                         <TouchableOpacity
//                             style={styles.uploadButton}
//                             onPress={() => handleUploadImage(index)}
//                         >
//                             <Icon name="camera" type="feather" color="#fff" />
//                             <Text style={styles.uploadText}>Add Image</Text>
//                         </TouchableOpacity>
//                     </View>

//                 )
//             )}

//         </View>
//     );

//     return (
//         <View style={styles.container}>
//             <Appbar />
//             {loading ? (
//                 <Loading />
//             ) : error ? (
//                 <View style={{ padding: 20 }}>
//                     <Text style={{ color: 'red', fontSize: 16, textAlign: 'center' }}>{error}</Text>
//                 </View>
//             ) : (
//                 <>
//                     <FlatList
//                         data={items}
//                         keyExtractor={(item, index) => `${item.item_code}_${index}`}
//                         renderItem={renderItem}
//                         contentContainerStyle={{ paddingBottom: 80 }}
//                     />
//                     <View style={styles.submitContainer}>
//                         <PrimaryGradientButton onPress={handleSubmit} text="Submit" />
//                     </View>
//                 </>
//             )}
//         </View>
//     );
// };

// export default Items;

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         marginTop: 36,
//     },
//     itemCard: {
//         backgroundColor: '#f4f4f4',
//         padding: 16,
//         paddingVertical: 6,
//         borderRadius: 10,
//         marginBottom: 10,
//         marginHorizontal: 10,
//     },
//     itemTitle: {
//         fontSize: 18,
//         fontWeight: 'bold',
//         marginBottom: 8,
//     },
//     checkboxRow: {
//         flexDirection: 'row',
//         justifyContent: 'space-between',
//     },
//     input: {
//         borderColor: '#ccc',
//         borderWidth: 1,
//         marginTop: 10,
//         paddingHorizontal: 10,
//         borderRadius: 5,
//     },
//     uploadButton: {
//         flexDirection: 'row',
//         backgroundColor: SECONDARY_COLOR,
//         padding: 10,
//         marginTop: 10,
//         borderRadius: 5,
//         alignItems: 'center',
//         justifyContent: 'center',
//     },
//     uploadText: {
//         color: '#fff',
//         marginLeft: 8,
//         fontWeight: '600',
//     },
//     submitContainer: {
//         padding: 10,
//         borderTopWidth: 1,
//         borderColor: '#ddd',
//         alignItems: 'center',
//         backgroundColor: '#fff',
//         position: 'absolute',
//         bottom: 0,
//         left: 0,
//         right: 0,
//     },
//     imagePreviewWrapper: {
//         marginTop: 10,
//         alignItems: 'center',
//     },
//     imageLabel: {
//         fontSize: 14,
//         marginBottom: 5,
//         color: 'green',
//         fontWeight: '600',
//     },
//     previewImage: {
//         width: 150,
//         height: 150,
//         borderRadius: 8,
//         borderColor: '#ccc',
//         borderWidth: 1,
//     },

// });


// updated Items.js with multiple image support
import React, { useCallback, useState } from 'react';
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
import { httpGet, httpPUT, uploadToERP } from '../network calls/networkCalls';
import Appbar from '../components/appbar';
import PrimaryGradientButton from '../components/PrimaryGradientButton';
import Toast from 'react-native-toast-message';
import Loading from '../components/Loading';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { SECONDARY_COLOR } from '../assets/colors/colors';

const Items = ({ route }) => {
    const navigation = useNavigation();
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const { note, trip, stop } = route.params;

    useFocusEffect(
        useCallback(() => {
            const getDeliveryNotes = async () => {
                try {
                    setLoading(true);
                    const response = await httpGet(`/api/resource/Delivery Note/${note}`);
                    if (response?.data?.items) {
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
            updated[index].custom_item_images = [];
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

        try {
            setLoading(true);
            const updatedItems = await Promise.all(
                items.map(async (item) => {
                    if (item.custom_delivered && item.custom_item_images?.length) {
                        const uploaded = await Promise.all(
                            item.custom_item_images.map(async (uri) =>
                                uri.startsWith('file') ? await uploadToERP(uri) : uri
                            )
                        );
                        return { ...item, custom_item_images: uploaded };
                    }
                    return item;
                })
            );

            const payload = {
                items: updatedItems.map(item => ({
                    ...item,
                    custom_item_images: item.custom_item_images.toString(),
                    custom_delivered: item.custom_delivered || 0,
                    custom_return: item.custom_return || 0,
                    custom_reason: item.custom_reason || '',
                }))
            };

            console.log("Payload for Delivery Note:", payload);

            const response = await httpPUT(`/api/resource/Delivery Note/${note}`, payload);
            if (response?.data) {
                Toast.show({ type: 'success', text1: 'Success', text2: 'Delivery Note updated!' });
                await httpPUT(`/api/resource/Delivery Trip/${trip}`, { delivery_stops: stop });
                setItems([]);
                navigation.navigate('Details', { data: trip });
            } else {
                throw new Error(response.error || 'Unknown error');
            }
        } catch (error) {
            Toast.show({ type: 'error', text1: 'Update Failed', text2: error.message || 'Something went wrong!' });
        } finally {
            setLoading(false);
        }
    };

    const renderItem = ({ item, index }) => (
        <View key={index} style={styles.itemCard}>
            <Text style={styles.itemTitle}>{item.item_name}</Text>
            <View style={styles.checkboxRow}>
                <CheckBox title="Delivered" checked={item.custom_delivered} onPress={() => toggleDelivered(index)} />
                <CheckBox title="Return" checked={item.custom_return} onPress={() => toggleReturn(index)} />
            </View>
            {item.custom_return && (
                <TextInput
                    placeholder="Reason for return"
                    placeholderTextColor="black"
                    value={item.custom_reason}
                    onChangeText={text => handleReasonChange(text, index)}
                    style={styles.input}
                />
            )}
            {item.custom_delivered || item.custom_return && (
                <View style={{ marginTop: 10 }}>
                    <ScrollView horizontal>
                        {(item.custom_item_images || []).map((imgUri, i) => (
                            <Image key={i} source={{ uri: imgUri }} style={styles.previewImage} />
                        ))}
                    </ScrollView>
                    <TouchableOpacity style={styles.uploadButton} onPress={() => handleUploadImage(index)}>
                        <Icon name="camera" type="feather" color="#fff" />
                        <Text style={styles.uploadText}>Add Image</Text>
                    </TouchableOpacity>
                </View>
            )}
        </View>
    );

    return (
        <View style={styles.container}>
            <Appbar />
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
        </View>
    );
};

export default Items;

const styles = StyleSheet.create({
    container: { flex: 1, marginTop: 36 },
    itemCard: { backgroundColor: '#f4f4f4', padding: 16, paddingVertical: 6, borderRadius: 10, marginBottom: 10, marginHorizontal: 10 },
    itemTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 8 },
    checkboxRow: { flexDirection: 'row', justifyContent: 'space-between' },
    input: { borderColor: '#ccc', borderWidth: 1, marginTop: 10, paddingHorizontal: 10, borderRadius: 5 },
    uploadButton: { flexDirection: 'row', backgroundColor: SECONDARY_COLOR, padding: 10, marginTop: 10, borderRadius: 5, alignItems: 'center', justifyContent: 'center' },
    uploadText: { color: '#fff', marginLeft: 8, fontWeight: '600' },
    submitContainer: { padding: 10, borderTopWidth: 1, borderColor: '#ddd', alignItems: 'center', backgroundColor: '#fff', position: 'absolute', bottom: 0, left: 0, right: 0 },
    previewImage: { width: 80, height: 80, marginRight: 8, borderRadius: 8, borderWidth: 1, borderColor: '#ccc' },
});
