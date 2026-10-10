import { StyleSheet } from 'react-native';

export const signatureStyles = StyleSheet.create({
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
  // Combine with styles.borderedInput from common
  input: { marginVertical: 10 },
});
