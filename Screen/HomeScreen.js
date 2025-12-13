// ==========================================
// HOME SCREEN
// Screen utama aplikasi Lost & Found
// ==========================================

import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
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

import styles from '../styles/HomeScreenStyles'; // ⬅ IMPORT STYLE YANG SUDAH DIPISAH
const { width } = Dimensions.get('window');

export default function HomeScreen({ navigation }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const flatListRef = useRef(null);
  const menuScrollRef = useRef(null);
  const [autoScroll, setAutoScroll] = useState(false);

  // animasi fade
  const fade = (val) => useRef(new Animated.Value(val)).current;
  const fadeHeader = fade(0);
  const slideHeader = fade(-40);
  const fadeBanner = fade(0);
  const slideBanner = fade(50);
  const fadeMenu = fade(0);
  const slideMenu = fade(-50);
  const fadeStats = fade(0);
  const slideStats = fade(50);
  const fadeBounty = fade(0);
  const slideBounty = fade(-50);

  useEffect(() => {
    Animated.stagger(150, [
      Animated.parallel([
        Animated.timing(fadeHeader, { toValue: 1, duration: 500, useNativeDriver: true }),
        Animated.spring(slideHeader, { toValue: 0, useNativeDriver: true }),
      ]),
      Animated.parallel([
        Animated.timing(fadeBanner, { toValue: 1, duration: 500, useNativeDriver: true }),
        Animated.spring(slideBanner, { toValue: 0, useNativeDriver: true }),
      ]),
      Animated.parallel([
        Animated.timing(fadeMenu, { toValue: 1, duration: 500, useNativeDriver: true }),
        Animated.spring(slideMenu, { toValue: 0, useNativeDriver: true }),
      ]),
      Animated.parallel([
        Animated.timing(fadeStats, { toValue: 1, duration: 500, useNativeDriver: true }),
        Animated.spring(slideStats, { toValue: 0, useNativeDriver: true }),
      ]),
      Animated.parallel([
        Animated.timing(fadeBounty, { toValue: 1, duration: 500, useNativeDriver: true }),
        Animated.spring(slideBounty, { toValue: 0, useNativeDriver: true }),
      ]),
    ]).start();
  }, []);

  const sliderImages = [
    require('../assets/images/halaman/cat.png'),
    require('../assets/images/halaman/cat2.png'),
    require('../assets/images/halaman/cat3.png'),
  ];

  const quickActions = [
    { id: '1', title: 'Lapor Kehilangan', icon: 'alert-circle-outline' },
    { id: '2', title: 'Menemukan Barang', icon: 'search-outline' },
    { id: '3', title: 'Data Laporan', icon: 'document-text-outline' },
    { id: '4', title: 'Notifikasi', icon: 'notifications-outline' },
    { id: '5', title: 'Bantuan', icon: 'help-circle-outline' },
  ];

  const bountyItems = [
    {
      id: '1',
      title: 'Kunci Motor Honda Beat',
      location: 'Parkiran Gedung Utama',
      time: '10 menit yang lalu',
      reward: '25.000',
      image: require('../assets/images/halaman/kunci.png'),
    },
    {
      id: '2',
      title: 'Kartu KTM Mahasiswa',
      location: 'Kantin FST',
      time: '1 jam yang lalu',
      reward: '—',
      image: require('../assets/images/halaman/ktm.png'),
    },
    {
      id: '3',
      title: 'Earphone Hitam',
      location: 'Perpustakaan',
      time: '3 jam yang lalu',
      reward: '10.000',
      image: require('../assets/images/halaman/headphone.png'),
    },
    {
      id: '4',
      title: 'Botol Tumbler Hijau',
      location: 'Lapangan Fakultas',
      time: '1 hari lalu',
      reward: '15.000',
      image: require('../assets/images/halaman/botol.png'),
    },
    {
      id: '5',
      title: 'Flashdisk Sandisk 32GB',
      location: 'Lab Komputer',
      time: '2 hari lalu',
      reward: '30.000',
      image: require('../assets/images/halaman/flashdisk.png'),
    },
  ];

  const renderQuickAction = ({ item }) => (
    <Pressable
      key={item.id}
      style={({ pressed }) => [
        styles.actionCard,
        { opacity: pressed ? 0.8 : 1, transform: [{ scale: pressed ? 0.96 : 1 }] },
      ]}
      onPress={() => {
        if (item.title === 'Menemukan Barang') navigation.navigate('FoundItem');
        else if (item.title === 'Lapor Kehilangan') navigation.navigate('LaporItem');
        else if (item.title === 'Data Laporan') navigation.navigate('DataLaporanItem');
        else if (item.title === 'Notifikasi') navigation.navigate('NotifikasiItem');
        else if (item.title === 'Bantuan') navigation.navigate('BantuanItem');
      }}
    >
      <LinearGradient colors={['#7a5c00', '#b8860b', '#d4af37']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.iconBox}>
        <Ionicons name={item.icon} size={26} color="#fff" />
      </LinearGradient>
      <Text style={styles.actionText}>{item.title}</Text>
    </Pressable>
  );

  const onSliderMomentumEnd = (event) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const newIndex = Math.round(offsetX / width);
    if (newIndex !== activeIndex) setActiveIndex(newIndex);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#C9A13B" />

      <Animated.View style={[styles.header, { opacity: fadeHeader, transform: [{ translateY: slideHeader }] }]}>
        <LinearGradient colors={['#b88400ff', '#006B3F']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.headerGradient}>
          <View>
            <Text style={styles.headerTitle}>temUIN</Text>
            <Text style={styles.headerSubtitle}>Barang hilang? Temuin aja!</Text>
          </View>
          <View style={styles.searchBox}>
            <Ionicons name="search-outline" size={18} color="#777" />
            <TextInput
              style={styles.searchInput}
              placeholder="Cari barang..."
              placeholderTextColor="#999"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
        </LinearGradient>
      </Animated.View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.greetingContainer}>
          <Text style={styles.greeting}>Halo, Mahasiswa UIN SSC👋</Text>
          <Text style={styles.welcomeText}>
            Selamat datang di temUIN! Yuk bantu temuin barang yang hilang di kampus UIN SSC.
          </Text>
        </View>

        <Animated.View style={{ opacity: fadeBanner, transform: [{ translateX: slideBanner }] }}>
          <FlatList
            data={sliderImages}
            ref={flatListRef}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onMomentumScrollEnd={onSliderMomentumEnd}
            renderItem={({ item }) => <Image source={item} style={styles.sliderImage} />}
            keyExtractor={(_, i) => i.toString()}
          />
          <View style={styles.dotsContainer}>
            {sliderImages.map((_, i) => (
              <View key={i} style={[styles.dot, activeIndex === i && styles.dotActive]} />
            ))}
          </View>
        </Animated.View>

        <Animated.View style={{ opacity: fadeMenu, transform: [{ translateX: slideMenu }] }}>
          <Text style={styles.sectionTitle}>Menu Cepat</Text>
          <ScrollView
            horizontal
            ref={menuScrollRef}
            showsHorizontalScrollIndicator={false}
            onTouchStart={() => setAutoScroll(false)}
            onTouchEnd={() => setAutoScroll(false)}
          >
            <View style={styles.actionsList}>{quickActions.map((item) => renderQuickAction({ item }))}</View>
          </ScrollView>
        </Animated.View>

        <Animated.View style={{ opacity: fadeStats, transform: [{ translateY: slideStats }] }}>
          <Text style={styles.sectionTitle}>Statistik Laporan</Text>
          <Text style={styles.statsNote}>📊 Data diperbarui setiap 24 jam</Text>
          <View style={styles.statsContainer}>
            {[{ icon: 'alert-circle', label: 'Kehilangan Hari Ini', value: 12 },
              { icon: 'checkmark-circle', label: 'Ditemukan Hari Ini', value: 8 },
              { icon: 'time-outline', label: 'Belum Ditemukan', value: 4 }
            ].map((item, i) => (
              <LinearGradient key={i} colors={['#8f9900ff', '#005813ff']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.statCard}>
                <Ionicons name={item.icon} size={24} color="#fff" />
                <Text style={[styles.statValue, { color: '#fff' }]}>{item.value}</Text>
                <Text style={[styles.statLabel, { color: '#FFF8E8' }]}>{item.label}</Text>
              </LinearGradient>
            ))}
          </View>
        </Animated.View>

        <Animated.View style={{ opacity: fadeBounty, transform: [{ translateY: slideBounty }] }}>
          <Text style={styles.sectionTitle}>Barang dengan Imbalan</Text>
          {bountyItems.map((item) => (
            <Pressable
              key={item.id}
              style={({ pressed }) => [
                styles.bountyCard,
                { opacity: pressed ? 0.85 : 1, transform: [{ scale: pressed ? 0.98 : 1 }] },
              ]}
            >
              <Image source={item.image} style={styles.bountyImage} />
              <View style={styles.bountyInfo}>
                <Text style={styles.bountyTitle}>{item.title}</Text>
                <Text style={styles.bountySub}>📍 {item.location}</Text>
                <Text style={styles.bountySub}>🕒 {item.time}</Text>
                <Text style={styles.bountyReward}>💰 Rp {item.reward}</Text>
              </View>
            </Pressable>
          ))}
        </Animated.View>
      </ScrollView>
    </View>
  );
}
