import { StyleSheet } from 'react-native';

export default StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: '#E9EEF2',
  },

  // HEADER
  header: {
    backgroundColor: '#006B3F',
    paddingTop: 48,
    paddingBottom: 18,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
    elevation: 8,
  },

  backBtn: {
    width: 34,
    height: 34,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },

  headerTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '800',
  },

  // CARD
  card: {
    margin: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.82)',
    padding: 16,
    borderRadius: 24,
    shadowColor: '#000',
    shadowOpacity: 0.10,
    shadowRadius: 14,
    elevation: 10,
    backdropFilter: 'blur(12px)',
  },

  label: {
    fontSize: 13,
    fontWeight: '700',
    color: '#344',
    marginBottom: 4,
    marginTop: 8,
  },

  input: {
    backgroundColor: '#fff',
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 14,
    marginBottom: 6,
  },

  textArea: {
    backgroundColor: '#fff',
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 10,
    height: 100,
    textAlignVertical: 'top',
    fontSize: 14,
    marginBottom: 6,
  },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },

  pickBtn: {
    backgroundColor: '#eee',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },

  removeBtn: {
    marginLeft: 10,
    padding: 8,
    borderRadius: 12,
    backgroundColor: '#ffeaea',
  },

  image: {
    marginTop: 10,
    height: 150,
    borderRadius: 14,
  },

  floatingWrap: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
  },

  floatingBtn: {
    backgroundColor: '#006B3F',
    paddingVertical: 16,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    elevation: 12,
  },

  floatingText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '800',
    marginLeft: 8,
  },

});
