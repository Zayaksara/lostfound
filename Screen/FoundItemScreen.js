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

export default function FoundItemScreen() {
  const [searchQuery, setSearchQuery] = useState('');

  const items = [
    {
      id: '1',
      title: 'Pod Oxva NeXLim',
      location: 'Kedai Sejati',
      time: '2 hari lalu',
      reward: '50.000',
      image: 'https://i.ibb.co/Hf0RC0QS/Screenshot-20251023-145652-Gallery.jpg',
      desc: 'Pod warna hitam dengan stiker kecil di sisi kiri.',
    },
    {
      id: '2',
      title: 'iPhone 13',
      location: 'Mushola FDKI',
      time: '5 hari lalu',
      reward: '500.000',
      image: 'https://i.ibb.co/SXZMXmdH/Screenshot-20251023-144525-Facebook.jpg',
      desc: 'iPhone 13 casing biru, retak kecil di pojok kanan atas.',
    },
    {
      id: '3',
      title: 'Botol Minum',
      location: 'Mahad Qodim',
      time: '1 hari lalu',
      reward: '20.000',
      image: 'https://i.ibb.co/n86bNDvP/e6a4deb5-3d90-42ff-be2e-22d03685f470.webp',
      desc: 'Botol stainless dengan label “AquaSport” merah.',
    },
  ];

  const filtered = items.filter((item) =>
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
});
