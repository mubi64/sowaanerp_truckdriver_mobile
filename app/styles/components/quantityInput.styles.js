import { StyleSheet } from 'react-native';

export const quantityInputStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 5,
    borderColor: '#ccc',
    overflow: 'hidden',
  },
  button: {
    backgroundColor: '#ddd',
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  input: {
    width: 50,
    textAlign: 'center',
    paddingVertical: 4,
  },
});
