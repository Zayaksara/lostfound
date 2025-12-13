import { Dimensions, StyleSheet } from 'react-native';
const { width } = Dimensions.get('window');

export default StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAFAF5' },

  // HEADER
  header: {
    paddingTop: 50,
    paddingBottom: 24,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    elevation: 8,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  headerTitle: {
    fontSize: width < 360 ? 20 : 24,
    fontWeight: '900',
    color: '#fff',
    letterSpacing: 0.5,
    flex: 1,
  },
  clearButton: {
    padding: 8,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 8,
    marginLeft: 10,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 14,
    paddingHorizontal: 10,
    height: 38,
    elevation: 2,
  },
  searchInput: { flex: 1, fontSize: 13, color: '#333', marginLeft: 4 },

  // CARD
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 16,
    marginHorizontal: 20,
    marginVertical: 8,
    elevation: 3,
    padding: 12,
  },
  cardImage: {
    width: 70,
    height: 70,
    borderRadius: 12,
    marginRight: 10,
    backgroundColor: '#eee',
  },
  cardBody: { flex: 1, justifyContent: 'center' },
  cardTitle: { fontSize: 15, fontWeight: '700', color: '#111' },
  cardSub: { fontSize: 12, color: '#666', marginTop: 2 },
  cardStatus: { fontSize: 13, fontWeight: 'bold', marginTop: 6 },

  // EMPTY STATE
  noResult: {
    textAlign: 'center',
    marginTop: 20,
    color: '#888',
    fontSize: 16,
    fontWeight: '600',
  },
  emptySubtitle: {
    textAlign: 'center',
    marginTop: 8,
    color: '#aaa',
    fontSize: 13,
  },
  emptyContainer: {
    alignItems: 'center',
    marginTop: 80,
    paddingHorizontal: 20,
  },
});
