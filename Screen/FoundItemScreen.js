// ==========================================
// FOUND ITEM SCREEN
// Screen untuk lihat barang yang ditemukan orang lain
// ==========================================

import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useState } from 'react';
import {
  Dimensions,
  FlatList,
  Image,
  Linking,
  Modal,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View
} from 'react-native';

const { width } = Dimensions.get('window');

export default function FoundItemScreen({ navigation }) {
  // STATE UNTUK SEARCH DAN MODAL
  const [searchQuery, setSearchQuery] = useState('');        // Teks pencarian
  const [selectedItem, setSelectedItem] = useState(null);    // Item yang dipilih untuk modal

  // ==========================================
  // FUNGSI UNTUK TELEPON PEMILIK BARANG
  // ==========================================
  const handleCall = () => {
    if (!selectedItem) return;
    // Ambil nomor telepon (hapus karakter selain angka)
    const phoneNumber = selectedItem.kontak.replace(/[^0-9]/g, '');
    // Buka aplikasi telepon
    Linking.openURL(`tel:${phoneNumber}`);
  };

  // ==========================================
  // FUNGSI UNTUK WHATSAPP PEMILIK BARANG
  // ==========================================
  const handleWhatsApp = () => {
    if (!selectedItem) return;
    // Ambil nomor telepon
    const phoneNumber = selectedItem.kontak.replace(/[^0-9]/g, '');
    // Buka WhatsApp dengan pesan otomatis
    Linking.openURL(`https://wa.me/${phoneNumber}?text=Halo%2C%20saya%20menemukan%20barang%20${encodeURIComponent(selectedItem.title)}%20yang%20Anda%20laporkan.`);
  };

  const items = [
    {
      id: '1',
      title: 'Pod Oxva NeXLim',
      location: 'Kedai Sejati',
      time: '2 hari lalu',
      reward: '50.000',
      image: require('../assets/images/nemu/pod.jpg'),
      desc: 'Pod warna hitam dengan stiker kecil di sisi kiri.',
      kontak: '081234567890',
    },
    {
      id: '2',
      title: 'iPhone 13',
      location: 'Mushola FDKI',
      time: '5 hari lalu',
      reward: '500.000',
      image: require('../assets/images/nemu/iphone.png'),
      desc: 'iPhone 13 casing biru, retak kecil di pojok kanan atas.',
      kontak: '081987654321',
    },
    {
      id: '3',
      title: 'Botol Minum',
      location: 'Mahad Qodim',
      time: '1 hari lalu',
      reward: '20.000',
      image: require('../assets/images/halaman/botol.png'),
      desc: 'Botol stainless dengan label "AquaSport" merah.',
      kontak: '082345678901',
    },
  ];

  const filtered = items.filter((item) =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // FUNGSI UNTUK RENDER SETIAP CARD ITEM
  const renderItem = ({ item }) => (
    <Pressable
      key={item.id}
      style={({ pressed }) => [
        styles.card,
        { opacity: pressed ? 0.9 : 1, transform: [{ scale: pressed ? 0.97 : 1 }] },
      ]}
      onPress={() => setSelectedItem(item)} // Klik card untuk buka modal
    >
      <Image source={item.image} style={styles.cardImage} />
      <View style={styles.cardBody}>
        <Text style={styles.cardTitle}>{item.title}</Text>
        <Text style={styles.cardSub}>📍 {item.location}</Text>
        <Text style={styles.cardSub}>🕒 {item.time}</Text>
        <Text style={styles.cardReward}>💰 Rp {item.reward}</Text>
      </View>
    </Pressable>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#C9A13B" />

      {/* HEADER */}
      <LinearGradient
        colors={['#B38E2F', '#006B3F']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <Text style={styles.headerTitle}>Cari Barang Kamu</Text>
        <View style={styles.searchBox}>
          <Ionicons name="search-outline" size={18} color="#777" />
          <TextInput
            style={styles.searchInput}
            placeholder="Cari barang atau lokasi..."
            placeholderTextColor="#999"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </LinearGradient>

      {/* DAFTAR ITEM */}
      <ScrollView showsVerticalScrollIndicator={false}>
        {filtered.length > 0 ? (
          <FlatList
            data={filtered}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
            contentContainerStyle={{ paddingBottom: 20 }}
          />
        ) : (
          <Text style={styles.noResult}>Tidak ada barang ditemukan.</Text>
        )}
      </ScrollView>

      {/* MODAL UNTUK TAMPILKAN DETAIL BARANG */}
      {/* Muncul dari bawah saat user klik card */}
      <Modal
        visible={selectedItem !== null}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setSelectedItem(null)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            {selectedItem && (
              <>
                <Pressable
                  style={styles.closeButton}
                  onPress={() => setSelectedItem(null)}
                >
                  <Ionicons name="close" size={24} color="#666" />
                </Pressable>

                <ScrollView showsVerticalScrollIndicator={false}>
                  {/* GAMBAR BARANG */}
                  <Image source={selectedItem.image} style={styles.modalImage} />
                  
                  {/* INFO BARANG */}
                  <Text style={styles.modalTitle}>{selectedItem.title}</Text>
                  <Text style={styles.modalDesc}>{selectedItem.desc}</Text>

                  <View style={styles.modalInfoBox}>
                    <Ionicons name="location-outline" size={20} color="#B38E2F" />
                    <Text style={styles.modalInfoText}>{selectedItem.location}</Text>
                  </View>

                  <View style={styles.modalInfoBox}>
                    <Ionicons name="time-outline" size={20} color="#B38E2F" />
                    <Text style={styles.modalInfoText}>Ditemukan: {selectedItem.time}</Text>
                  </View>

                  <View style={styles.modalInfoBox}>
                    <Ionicons name="cash-outline" size={20} color="#B38E2F" />
                    <Text style={styles.modalRewardText}>Imbalan: Rp {selectedItem.reward}</Text>
                  </View>

                  {/* INFO KONTAK PEMILIK */}
                  <View style={styles.modalContactBox}>
                    <Ionicons name="call-outline" size={24} color="#B12E2E" />
                    <View style={styles.modalContactInfo}>
                      <Text style={styles.modalContactLabel}>Hubungi Pemilik:</Text>
                      <Text style={styles.modalContactNumber}>{selectedItem.kontak}</Text>
                    </View>
                  </View>

                  {/* TOMBOL UNTUK HUBUNGI PEMILIK */}
                  <View style={styles.modalActionSection}>
                    <Text style={styles.modalActionTitle}>Apakah kamu menemukan barang tersebut?</Text>
                    <Text style={styles.modalActionSubtitle}>Hubungi pemilik untuk mengembalikan barang</Text>

                    <Pressable
                      style={({ pressed }) => [styles.modalContactButton, pressed && { opacity: 0.8 }]}
                      onPress={handleCall}
                    >
                      <LinearGradient
                        colors={['#25D366', '#128C7E']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={styles.modalButtonGradient}
                      >
                        <Ionicons name="call" size={20} color="#fff" />
                        <Text style={styles.modalButtonText}>Telepon</Text>
                      </LinearGradient>
                    </Pressable>

                    <Pressable
                      style={({ pressed }) => [styles.modalContactButton, pressed && { opacity: 0.8 }]}
                      onPress={handleWhatsApp}
                    >
                      <LinearGradient
                        colors={['#25D366', '#20BA5A']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={styles.modalButtonGradient}
                      >
                        <Ionicons name="logo-whatsapp" size={20} color="#fff" />
                        <Text style={styles.modalButtonText}>WhatsApp</Text>
                      </LinearGradient>
                    </Pressable>
                  </View>
                </ScrollView>
              </>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
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
