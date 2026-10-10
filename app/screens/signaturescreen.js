import React, { useRef, useState } from 'react';
import { KeyboardAvoidingView, Platform, TextInput, TouchableOpacity } from 'react-native';
import { Alert } from 'react-native';
import { View, Image, Text, ScrollView } from 'react-native';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { Icon } from '@rneui/base';
import SignatureCanvas from 'react-native-signature-canvas';
import Toast from 'react-native-toast-message';
import { httpPUT, uploadToERP } from '../network calls/networkCalls';
import Loading from '../components/Loading';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { styles } from '../styles/common';
import { signatureStyles } from '../styles/screens/signature.styles';

const DriverSignatureScreen = ({ route }) => {
    const navigation = useNavigation();
    const { name, trip } = route.params;
    const [customrName, setCustomrName] = useState('');
    const [customerNumber, setCustomerNumber] = useState('');
    const [signature, setSignature] = useState(null);
    const [image, setImage] = useState('');
    const [loading, setLoading] = useState(false);
    const ref = useRef();
    const imageOptions = {
        mediaType: 'photo',
        quality: 1,
        includeBase64: false,
    };

    const handleSignature = (sig) => {
        setSignature(sig);
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
            if (customrName || customerNumber) {
                const payload = {
                    'custom_delivered_customer_name': customrName,
                    'custom_delivered_customer_number': customerNumber,
                };
                await httpPUT(`/api/resource/Delivery Note/${name}`, payload);
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
        <SafeAreaView style={signatureStyles.container}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.flex_1}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
            >
                <ScrollView
                    contentContainerStyle={styles.flexGrow_1}
                    keyboardShouldPersistTaps="handled"
                >
                    <Text>Upload Delivery Note</Text>
                    <View style={styles.imageSection}>
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
                        webStyle={`
                    .button {
                    display: none;
                    }
                    .button.clear {
                    display: inline-block;
                    }
                `}
                    />
                    <TextInput
                        placeholder="Name"
                        placeholderTextColor="black"
                        value={customrName}
                        onChangeText={text => setCustomrName(text)}
                        style={[styles.borderedInput, signatureStyles.input]} />
                    <TextInput
                        placeholder="Number"
                        placeholderTextColor="black"
                        value={customerNumber}
                        onChangeText={text => setCustomerNumber(text)}
                        style={[styles.borderedInput, signatureStyles.input]} />
                    <TouchableOpacity style={styles.uploadButton} onPress={() => handleSave()}>
                        <Icon name="edit" type="feather" color="#fff" />
                        <Text style={styles.uploadText}>Update</Text>
                    </TouchableOpacity>
                    {loading && <Loading />}
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

export default DriverSignatureScreen;
