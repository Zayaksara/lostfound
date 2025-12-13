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
  Text,
  TextInput,
  View
} from 'react-native';

import styles from '../styles/FoundItemStyles'; // ⬅ STYLE TERPISAH
const { width } = Dimensions.get('window');

export default function FoundItemScreen({ navigation }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);

  const handleCall = () => {
    if (!selectedItem) return;
    const phoneNumber = selectedItem.kontak.replace(/[^0-9]/g, '');
    Linking.openURL(`tel:${phoneNumber}`);
  };

  const handleWhatsApp = () => {
    if (!selectedItem) return;
    const phoneNumber = selectedItem.kontak.replace(/[^0-9]/g, '');
    Linking.openURL(
      `https://wa.me/${phoneNumber}?text=Halo%2C%20saya%20menemukan%20barang%20${encodeURIComponent(selectedItem.title)}%20yang%20Anda%20laporkan.`
    );
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
      kontak: '+6281291585155',
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
    {
      id: '4',
      title: 'Botol Azul',
      location: 'Mahad Qodim',
      time: '1 hari lalu',
      reward: '20.000',
      image: require('../assets/images/halaman/botol.png'),
      desc: 'Botol stainless dengan label "AquaSport" merah.',
      kontak: '082345678901',
    },
    {
      id: '5',
      title: 'Botol Arak',
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

  const renderItem = ({ item }) => (
    <Pressable
      key={item.id}
      style={({ pressed }) => [
        styles.card,
        { opacity: pressed ? 0.9 : 1, transform: [{ scale: pressed ? 0.97 : 1 }] },
      ]}
      onPress={() => setSelectedItem(item)}
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

      <LinearGradient
        colors={['#dca61dff', '#015c36ff']}
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
                <Pressable style={styles.closeButton} onPress={() => setSelectedItem(null)}>
                  <Ionicons name="close" size={24} color="#666" />
                </Pressable>

                <ScrollView showsVerticalScrollIndicator={false}>
                  <Image source={selectedItem.image} style={styles.modalImage} />

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

                  <View style={styles.modalContactBox}>
                    <Ionicons name="call-outline" size={24} color="#B12E2E" />
                    <View style={styles.modalContactInfo}>
                      <Text style={styles.modalContactLabel}>Hubungi Pemilik:</Text>
                      <Text style={styles.modalContactNumber}>{selectedItem.kontak}</Text>
                    </View>
                  </View>

                  <View style={styles.modalActionSection}>
                    <Text style={styles.modalActionTitle}>Apakah kamu menemukan barang tersebut?</Text>
                    <Text style={styles.modalActionSubtitle}>Hubungi pemilik untuk mengembalikan barang</Text>

                    <Pressable onPress={handleCall} style={styles.modalContactButton}>
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

                    <Pressable onPress={handleWhatsApp} style={styles.modalContactButton}>
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
