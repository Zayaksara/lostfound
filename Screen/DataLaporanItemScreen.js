import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TextInput,
  Pressable,
  StatusBar,
  Dimensions,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

export default function DataItemScreen() {
  const [searchQuery, setSearchQuery] = useState('');

  // 📋 Contoh data laporan kehilangan
  const reports = [
    {
      id: '1',
      title: 'Dompet Coklat',
      location: 'Kantin Fakultas',
      date: '20 Okt 2025',
      status: 'Diproses',
      image: 'https://i.ibb.co/Fw1Xf9f/dompet.jpg',
      desc: 'Dompet warna coklat berisi KTP dan kartu mahasiswa.',
    },
    {
      id: '2',
      title: 'Kunci Motor',
      location: 'Parkiran Utama',
      date: '18 Okt 2025',
      status: 'Selesai',
      image: 'https://i.ibb.co/vcwJ0Pb/key.jpg',
      desc: 'Kunci motor Honda Beat dengan gantungan bulat biru.',
    },
    {
      id: '3',
      title: 'Tas Hitam',
      location: 'Ruang B203',
      date: '17 Okt 2025',
      status: 'Menunggu Verifikasi',
      image: 'https://i.ibb.co/RDJy1S1/bag.jpg',
      desc: 'Tas ransel warna hitam merk Eiger berisi buku dan charger.',
    },
  ];

  const filtered = reports.filter((item) =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderItem = ({ item }) => (
    <Pressable
      key={item.id}
      style={({ pressed }) => [
        styles.card,
        { opacity: pressed ? 0.9 : 1, transform: [{ scale: pressed ? 0.97 : 1 }] },
      ]}
    >
      <Image source={{ uri: item.image }} style={styles.cardImage} />
      <View style={styles.cardBody}>
        <Text style={styles.cardTitle}>{item.title}</Text>
        <Text style={styles.cardSub}>📍 {item.location}</Text>
        <Text style={styles.cardSub}>📅 {item.date}</Text>
        <Text
          style={[
            styles.cardStatus,
            {
              color:
                item.status === 'Selesai'
                  ? '#2E7D32'
                  : item.status === 'Diproses'
                  ? '#C9A13B'
                  : '#B12E2E',
            },
          ]}
        >
          🔖 {item.status}
        </Text>
      </View>
    </Pressable>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#006B3F" />

      {/* HEADER */}
      <LinearGradient
        colors={['#B38E2F', '#006B3F']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <Text style={styles.headerTitle}>Data Laporan Kehilangan</Text>
        <View style={styles.searchBox}>
          <Ionicons name="search-outline" size={18} color="#777" />
          <TextInput
            style={styles.searchInput}
            placeholder="Cari berdasarkan nama barang atau lokasi..."
            placeholderTextColor="#999"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </LinearGradient>

      {/* LIST DATA */}
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
          <Text style={styles.noResult}>Belum ada laporan kehilangan.</Text>
        )}
      </ScrollView>
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
  cardStatus: { fontSize: 13, fontWeight: 'bold', marginTop: 6 },

  noResult: {
    textAlign: 'center',
    marginTop: 50,
    color: '#888',
    fontSize: 14,
  },
});
