// ==========================================
// DATA LAPORAN ITEM SCREEN
// Screen untuk lihat semua laporan kehilangan
// ==========================================

import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import * as FileSystem from 'expo-file-system/legacy';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useCallback, useState } from 'react';
import {
  Alert,
  Dimensions,
  FlatList,
  Image,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

const { width } = Dimensions.get('window');

export default function DataItemScreen() {
  // STATE UNTUK SEARCH DAN DATA
  const [searchQuery, setSearchQuery] = useState('');  // Teks pencarian
  const [reports, setReports] = useState([]);          // Array data laporan
  const [failedImages, setFailedImages] = useState(new Set()); // Track gambar yang gagal load

  // FUNGSI UNTUK LOAD DATA DARI ASYNCSTORAGE
  const loadReports = async () => {
    try {
      const data = await AsyncStorage.getItem('reports');
      if (data) {
        setReports(JSON.parse(data));
      }
    } catch (error) {
      console.log('Error loading reports:', error);
    }
  };

  // LOAD DATA SETIAP KALI SCREEN DIBUKA
  useFocusEffect(
    useCallback(() => {
      loadReports();
    }, [])
  );

  // ==========================================
  // FUNGSI HAPUS SEMUA DATA (CLEAR CACHE)
  // Untuk menghemat storage di mobile
  // ==========================================
  const handleClearAll = () => {
    Alert.alert(
      '⚠️ Hapus Semua Data',
      'Apakah Anda yakin ingin menghapus semua laporan dan gambar? Tindakan ini tidak dapat dibatalkan.',
      [
        { text: 'Batal', style: 'cancel' },
        {
          text: 'Hapus',
          style: 'destructive',
          onPress: async () => {
            try {
              // Hapus AsyncStorage
              await AsyncStorage.removeItem('reports');
              
              // Hapus semua gambar di folder img/
              const imgDir = FileSystem.documentDirectory + 'img/';
              const dirInfo = await FileSystem.getInfoAsync(imgDir);
              if (dirInfo.exists) {
                await FileSystem.deleteAsync(imgDir, { idempotent: true });
                console.log('Folder img dihapus');
              }
              
              setReports([]);
              Alert.alert('✅ Sukses', 'Semua data dan gambar berhasil dihapus.');
            } catch (error) {
              console.log('Error clearing data:', error);
              Alert.alert('Error', 'Gagal menghapus data.');
            }
          },
        },
      ]
    );
  };

  // FILTER LAPORAN BERDASARKAN SEARCH QUERY
  const filtered = reports.filter((item) =>
    item.namaBarang?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.lokasi?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // FUNGSI UNTUK RENDER SETIAP ITEM DI LIST
  const renderItem = ({ item }) => {
    // CEK JENIS DATA GAMBAR (BASE64 UNTUK MOBILE ATAU URL UNTUK WEB)
    let imageSource;
    if (item.imageData && !failedImages.has(item.id)) {
      // Deteksi apakah data base64 (data:image/...) atau URL biasa (blob:http://...)
      if (item.imageData.startsWith('data:image/')) {
        // MOBILE: data URI base64
        imageSource = { uri: item.imageData };
      } else if (item.imageData.startsWith('blob:') || item.imageData.startsWith('http://') || item.imageData.startsWith('https://')) {
        // WEB: URL blob atau http/https
        imageSource = { uri: item.imageData };
      } else {
        // Format tidak dikenali, pakai placeholder
        imageSource = { uri: 'https://via.placeholder.com/70?text=No+Image' };
      }
    } else {
      // Tidak ada gambar atau gambar gagal load
      imageSource = { uri: 'https://via.placeholder.com/70?text=No+Image' };
    }
    
    return (
      <Pressable
        key={item.id}
        style={({ pressed }) => [
          styles.card,
          { opacity: pressed ? 0.9 : 1, transform: [{ scale: pressed ? 0.97 : 1 }] },
        ]}
      >
        <Image 
          source={imageSource} 
          style={styles.cardImage}
          onError={() => {
            // Jika gambar gagal load, tambahkan ke failedImages
            setFailedImages(prev => new Set(prev).add(item.id));
            console.log('Gambar gagal load untuk item:', item.id);
          }}
        />
        <View style={styles.cardBody}>
          <Text style={styles.cardTitle}>{item.namaBarang}</Text>
          <Text style={styles.cardSub}>📍 {item.lokasi}</Text>
          <Text style={styles.cardSub}>📅 {item.date}</Text>
          <Text style={styles.cardSub}>💰 {item.imbalan}</Text>
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
  };

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
        <View style={styles.headerTop}>
          <Text style={styles.headerTitle}>Data Laporan Kehilangan</Text>
          {reports.length > 0 && (
            <Pressable onPress={handleClearAll} style={styles.clearButton}>
              <Ionicons name="trash-outline" size={20} color="#fff" />
            </Pressable>
          )}
        </View>
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

      {/* LIST LAPORAN YANG TERSIMPAN */}
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
          <View style={styles.emptyContainer}>
            <Ionicons name="document-outline" size={64} color="#ccc" />
            <Text style={styles.noResult}>Belum ada laporan kehilangan.</Text>
            <Text style={styles.emptySubtitle}>Klik "Lapor Kehilangan" untuk membuat laporan baru</Text>
          </View>
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
