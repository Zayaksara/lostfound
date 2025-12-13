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
  headerTitle: {
    fontSize: width < 360 ? 20 : 24,
    fontWeight: '900',
    color: '#fff',
    letterSpacing: 0.5,
    marginBottom: 12,
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
  cardReward: { fontSize: 13, color: '#b12e2e', fontWeight: 'bold', marginTop: 6 },

  noResult: {
    textAlign: 'center',
    marginTop: 50,
    color: '#888',
    fontSize: 14,
  },

  // MODAL
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FAFAF5',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '90%',
    padding: 20,
    paddingTop: 40,
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    padding: 8,
    zIndex: 1,
  },
  modalImage: {
    width: width - 40,
    height: width - 40,
    borderRadius: 20,
    marginBottom: 16,
    backgroundColor: '#eee',
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: '#111',
    marginBottom: 8,
  },
  modalDesc: {
    fontSize: 14,
    color: '#666',
    marginBottom: 20,
    lineHeight: 20,
  },
  modalInfoBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 12,
    marginBottom: 10,
    elevation: 2,
  },
  modalInfoText: {
    fontSize: 14,
    color: '#333',
    marginLeft: 12,
    flex: 1,
  },
  modalRewardText: {
    fontSize: 15,
    color: '#B12E2E',
    fontWeight: 'bold',
    marginLeft: 12,
    flex: 1,
  },
  modalContactBox: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 16,
    marginTop: 20,
    elevation: 3,
    borderWidth: 2,
    borderColor: '#ffcccb',
  },
  modalContactInfo: {
    marginLeft: 12,
    flex: 1,
  },
  modalContactLabel: {
    fontSize: 13,
    color: '#666',
    marginBottom: 4,
  },
  modalContactNumber: {
    fontSize: 18,
    color: '#B12E2E',
    fontWeight: 'bold',
  },
  modalActionSection: {
    marginTop: 30,
  },
  modalActionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111',
    textAlign: 'center',
    marginBottom: 8,
  },
  modalActionSubtitle: {
    fontSize: 13,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  modalContactButton: {
    marginBottom: 12,
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 4,
  },
  modalButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
  },
  modalButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
});
