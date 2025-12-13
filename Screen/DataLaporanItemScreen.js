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
  Text,
  TextInput,
  View,
} from 'react-native';

import styles from '../styles/DataLaporanItemStyles'; // ⬅ STYLE DIPANGGIL DARI FILE TERPISAH
const { width } = Dimensions.get('window');

export default function DataItemScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [reports, setReports] = useState([]);
  const [failedImages, setFailedImages] = useState(new Set());

  const loadReports = async () => {
    try {
      const data = await AsyncStorage.getItem('reports');
      if (data) setReports(JSON.parse(data));
    } catch (error) {
      console.log('Error loading reports:', error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadReports();
    }, [])
  );

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
              await AsyncStorage.removeItem('reports');

              const imgDir = FileSystem.documentDirectory + 'img/';
              const dirInfo = await FileSystem.getInfoAsync(imgDir);
              if (dirInfo.exists) {
                await FileSystem.deleteAsync(imgDir, { idempotent: true });
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

  const filtered = reports.filter((item) =>
    item.namaBarang?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.lokasi?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderItem = ({ item }) => {
    let imageSource;
    if (item.imageData && !failedImages.has(item.id)) {
      if (item.imageData.startsWith('data:image/')) imageSource = { uri: item.imageData };
      else if (item.imageData.startsWith('blob:') || item.imageData.startsWith('http') || item.imageData.startsWith('https'))
        imageSource = { uri: item.imageData };
      else imageSource = { uri: 'https://via.placeholder.com/70?text=No+Image' };
    } else {
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
          onError={() => setFailedImages((prev) => new Set(prev).add(item.id))}
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

      <LinearGradient colors={['#B38E2F', '#006B3F']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.header}>
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
