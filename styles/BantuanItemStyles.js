import { Dimensions, StyleSheet } from 'react-native';
const { width } = Dimensions.get('window');

export default StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAFAF5' },

  header: {
    paddingTop: 50,
    paddingBottom: 24,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    elevation: 8,
  },
  headerTitle: {
    fontSize: width < 360 ? 20 : 24,
    fontWeight: '900',
    color: '#fff',
    letterSpacing: 0.5,
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
    marginHorizontal: 20,
    marginTop: 20,
    marginBottom: 10,
  },

  faqCard: {
    backgroundColor: '#fff',
    marginHorizontal: 20,
    marginVertical: 6,
    borderRadius: 14,
    elevation: 3,
    padding: 12,
  },
  faqHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  faqQuestion: {
    fontSize: 14,
    fontWeight: '600',
    color: '#222',
    flex: 1,
    marginRight: 10,
  },
  faqAnswer: {
    fontSize: 13,
    color: '#555',
    marginTop: 8,
    lineHeight: 18,
  },

  contactCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    marginHorizontal: 20,
    marginVertical: 6,
    borderRadius: 14,
    elevation: 3,
    padding: 12,
  },
  contactText: {
    fontSize: 14,
    color: '#006B3F',
    fontWeight: '600',
    marginLeft: 8,
  },
});
