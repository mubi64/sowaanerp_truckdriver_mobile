import React, { useRef, useState } from 'react';
import { TouchableOpacity } from 'react-native';
import { Alert } from 'react-native';
import { StyleSheet, View, Image, Text, ScrollView } from 'react-native';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { Icon } from '@rneui/base';
import SignatureCanvas from 'react-native-signature-canvas';
import Toast from 'react-native-toast-message';
import { uploadToERP } from '../network calls/networkCalls';
import { SECONDARY_COLOR } from '../assets/colors/colors';
import Loading from '../components/Loading';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';

const DriverSignatureScreen = ({ route }) => {
    const navigation = useNavigation();
    const { name, trip } = route.params;
    const [signature, setSignature] = useState(null);
    const [image, setImage] = useState("");
    const [loading, setLoading] = useState(false);
    const ref = useRef();
    const imageOptions = {
        mediaType: 'photo',
        quality: 1,
        includeBase64: false,
    };

    const handleSignature = (signature) => {
        console.log('signature', signature);
        setSignature(signature);
    };

    const handleSave = async () => {
        setLoading(true);
        try {
            if (!image) {
                Toast.show({ type: 'error', text1: 'Please upload an image', position: 'top' });
                return;
            }
            if (!signature) {
                Toast.show({ type: 'error', text1: 'Please provide a signature', position: 'top' });
                return;
            }
            if (image) {
                await uploadToERP(image, 'Delivery Note', name);
            }
            if (signature) {
                await uploadToERP(signature, 'Delivery Note', name, 'PNG');
                Toast.show({ type: 'success', text1: 'Signature saved successfully', position: 'top' });
            }
            navigation.reset({
                index: 0,
                routes: [{ name: 'Details', params: { data: trip } }],
            });
        } catch (error) {
            setLoading(false);
            Toast.show({ type: 'error', text1: 'Upload Failed', text2: error.message || 'Something went wrong!', position: 'top' });
        } finally {
            setLoading(false);
        }
    };

    const handleEmpty = () => {
        console.log('Empty');
    };

    const handleClear = () => {
        console.log('Clear success!');
    };

    const handleEnd = () => {
        ref.current.readSignature();
    };

    const handleUploadImage = () => {
        Alert.alert(
            'Upload Image',
            'Choose an option',
            [
                { text: 'Camera', onPress: () => pickFromCamera() },
                { text: 'Gallery', onPress: () => pickFromGallery() },
                { text: 'Cancel', style: 'cancel' },
            ],
            { cancelable: true }
        );
    };

    const pickFromCamera = () => {
        launchCamera(imageOptions, (response) => {
            const selectedAsset = response.assets?.[0];
            if (selectedAsset) {
                setImage(selectedAsset.uri);
            }
        });
    };

    const pickFromGallery = () => {
        launchImageLibrary(imageOptions, (response) => {
            const selectedAsset = response.assets?.[0];
            if (selectedAsset) {
                setImage(selectedAsset.uri);
            }
        });
    };

    return (
        <SafeAreaView style={styles.container}>
            <Text>Upload Delivery Note</Text>
            <View style={{ marginTop: 10 }}>
                {image &&
                    <Image source={{ uri: image }} style={styles.previewImage} />
                }
                <TouchableOpacity style={styles.uploadButton} onPress={() => handleUploadImage()}>
                    <Icon name="camera" type="feather" color="#fff" />
                    <Text style={styles.uploadText}>Upload Image</Text>
                </TouchableOpacity>
            </View>
            {/* <View style={styles.preview}>
                {signature && (
                    <Image
                        resizeMode="contain"
                        style={{ width: 335, height: 114 }}
                        source={{ uri: signature }}
                    />
                )}
            </View> */}
            <SignatureCanvas
                ref={ref}
                onEnd={handleEnd}
                onOK={handleSignature}
                onEmpty={handleEmpty}
                onClear={handleClear}
                autoClear={false}
                clearText="Clear"
                confirmText="Save"
            />
            <TouchableOpacity style={styles.uploadButton} onPress={() => handleSave()}>
                <Icon name="edit" type="feather" color="#fff" />
                <Text style={styles.uploadText}>Update</Text>
            </TouchableOpacity>
            {loading && <Loading />}

        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    preview: {
        width: 335,
        height: 114,
        backgroundColor: '#F8F8F8',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 15,
    },
    previewImage: { width: 80, height: 80, marginRight: 8, borderRadius: 8, borderWidth: 1, borderColor: '#ccc' },
    uploadText: { color: '#fff', marginLeft: 8, fontWeight: '600' },
    uploadButton: { flexDirection: 'row', backgroundColor: SECONDARY_COLOR, padding: 10, marginTop: 10, borderRadius: 5, alignItems: 'center', justifyContent: 'center' },
});


export default DriverSignatureScreen;
