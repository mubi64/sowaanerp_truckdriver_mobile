import { TextInput, View } from 'react-native';
import { styles } from '../helpers/styles';
import { LOW_PRIOR_FONT_COLOR, SECONDARY_COLOR } from '../assets/colors/colors';
import Icon from 'react-native-vector-icons/FontAwesome';

const Input = ({ keyboardType, placeholder, value, onChangeText }) => {
    return (
        <View style={styles.inputContainer}>
            <Icon name="search" size={20} color={SECONDARY_COLOR} />
            <TextInput
                keyboardType={keyboardType}
                placeholder={placeholder}
                value={value}
                onChangeText={onChangeText}
                style={styles.inputStyle}
                placeholderTextColor={LOW_PRIOR_FONT_COLOR}
            />
        </View>
    );
};

export default Input;
