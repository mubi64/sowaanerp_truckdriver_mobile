import { StyleSheet } from 'react-native';

export const itemsStyles = StyleSheet.create({
  container: { flex: 1 },
  listContent: { paddingBottom: 80 },
  itemCard: { backgroundColor: '#f4f4f4', padding: 8, paddingVertical: 6, borderRadius: 10, marginBottom: 10, marginHorizontal: 10 },
  itemTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 8 },
  checkboxRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', textAlign: 'center' },
  checkboxContainer: {
    borderWidth: 0,
    margin: 0,
    marginRight: 0,
    borderRadius: 5,
  },
  QTYRow: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', textAlign: 'center' },
  reasonContainer: { marginVertical: 20 },
  reasonPicker: {
    padding: 10,
    borderWidth: 1,
    borderRadius: 5,
    borderColor: '#ccc',
  },
  reasonOverlay: { width: '90%' },
  submitContainer: { padding: 10, borderTopWidth: 1, borderColor: '#ddd', alignItems: 'center', backgroundColor: '#fff', position: 'absolute', bottom: 0, left: 0, right: 0 },
  errorContainer: { padding: 20 },
  errorText: { color: 'red', fontSize: 16, textAlign: 'center' },
});
