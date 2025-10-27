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
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

const { width } = Dimensions.get('window');

export default function HomeScreen({ navigation }) {
  // STATE UNTUK SEARCH DAN MENU
  const [searchQuery, setSearchQuery] = useState('');        // Teks pencarian
  const [activeIndex, setActiveIndex] = useState(0);        // Index slider yang aktif
  const flatListRef = useRef(null);                          // Ref untuk FlatList slider
  const menuScrollRef = useRef(null);                        // Ref untuk scroll menu
  const [autoScroll, setAutoScroll] = useState(false);      // Auto scroll menu aktif/tidak

  // ==========================================
  // ANIMASI LOADING SAAT SCREEN MUNCUL
  // ==========================================
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

  // ==========================================
  // GAMBAR SLIDER BANNER
  // ==========================================
  const sliderImages = [
    require('../assets/images/halaman/cat.png'),
    require('../assets/images/halaman/cat2.png'),
    require('../assets/images/halaman/cat3.png'),
  ];

  // NOTE: removed auto-advance effect for slider — user will swipe manually
  // useEffect that auto advances slider has been intentionally removed.

  // ==========================================
  // MENU CEPAT (QUICK ACTIONS)
  // ==========================================
  const quickActions = [
    { id: '1', title: 'Lapor Kehilangan', icon: 'alert-circle-outline' },
    { id: '2', title: 'Menemukan Barang', icon: 'search-outline' },
    { id: '3', title: 'Data Laporan', icon: 'document-text-outline' },
    { id: '4', title: 'Notifikasi', icon: 'notifications-outline' },
    { id: '5', title: 'Bantuan', icon: 'help-circle-outline' },
  ];

  // ==========================================
  // FUNGSI AUTO SCROLL MENU CEPAT
  // Menu akan scroll otomatis bolak-balik
  // ==========================================
  useEffect(() => {
    if (!autoScroll) return;
    let scrollValue = 0;
    let direction = 1;
    const speed = 0.25; // makin kecil makin halus
    const maxScroll = 320;
    let pause = false;

    const smoothScroll = setInterval(() => {
      if (!menuScrollRef.current || pause) return;

      scrollValue += direction * speed;
      menuScrollRef.current.scrollTo({ x: scrollValue, animated: false });

      if (scrollValue >= maxScroll || scrollValue <= 0) {
        direction *= -1;
        pause = true;
        setTimeout(() => (pause = false), 1000);
      }
    }, 16);

    return () => clearInterval(smoothScroll);
  }, [autoScroll]);

  // ==========================================
  // DATA BARANG DENGAN IMBALAN
  // ==========================================
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

  // FUNGSI UNTUK RENDER SETIAP CARD MENU CEPAT
  // Setiap card bisa diklik untuk navigasi ke screen lain
  const renderQuickAction = ({ item }) => (
    <Pressable
      key={item.id}
      style={({ pressed }) => [
        styles.actionCard,
        { opacity: pressed ? 0.8 : 1, transform: [{ scale: pressed ? 0.96 : 1 }] },
      ]}
      onPress={() => {
        // NAVIGASI KE SCREEN YANG BERBEDA
        if (item.title === 'Menemukan Barang') {
          navigation.navigate('FoundItem');
        } else if (item.title === 'Lapor Kehilangan') {
          navigation.navigate('LaporItem');
        } else if (item.title === 'Data Laporan') {
          navigation.navigate('DataLaporanItem');
        } else if (item.title === 'Notifikasi') {
          navigation.navigate('NotifikasiItem');
        } else if (item.title === 'Bantuan') {
          navigation.navigate('BantuanItem');
        }
      }}
    >
      <LinearGradient
        colors={['#D4AF37', '#2E4A0D']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.iconBox}
      >
        <Ionicons name={item.icon} size={26} color="#fff" />
      </LinearGradient>
      <Text style={styles.actionText}>{item.title}</Text>
    </Pressable>
  );

  // FUNGSI UNTUK CEK SLIDER YANG AKTIF
  // Saat user swipe slider, hitung slide mana yang aktif
  const onSliderMomentumEnd = (event) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    // setiap item (dengan marginHorizontal width*0.05 di kiri dan kanan) total mengisi 100% width
    const newIndex = Math.round(offsetX / width);
    if (newIndex !== activeIndex) setActiveIndex(newIndex);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#C9A13B" />

      {/* HEADER - LOGO DAN SEARCH BAR */}
      <Animated.View style={[styles.header, { opacity: fadeHeader, transform: [{ translateY: slideHeader }] }]}>
        <LinearGradient
          colors={['#B38E2F', '#006B3F']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.headerGradient}
        >
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
        {/* SALAM PEMBUKA */}
        <View style={styles.greetingContainer}>
          <Text style={styles.greeting}>Halo, Mahasiswa UIN SSC👋</Text>
          <Text style={styles.welcomeText}>
            Selamat datang di temUIN! Yuk bantu temuin barang yang hilang di kampus UIN SSC.
          </Text>
        </View>

        {/* SLIDER BANNER - GAMBAR PROMOSI */}
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

          {/* INDIKATOR SLIDER (DOTS) */}
          <View style={styles.dotsContainer}>
            {sliderImages.map((_, i) => (
              <View
                key={i}
                style={[
                  styles.dot,
                  activeIndex === i ? styles.dotActive : null,
                ]}
              />
            ))}
          </View>
        </Animated.View>

        {/* MENU CEPAT - NAVIGASI KE SCREEN LAINNYA */}
        <Animated.View style={{ opacity: fadeMenu, transform: [{ translateX: slideMenu }] }}>
          <Text style={styles.sectionTitle}>Menu Cepat</Text>
          <ScrollView
            horizontal
            ref={menuScrollRef}
            showsHorizontalScrollIndicator={false}
            scrollEventThrottle={16}
            onTouchStart={() => setAutoScroll(false)}
            onTouchEnd={() => setAutoScroll(false)}
          >
            <View style={styles.actionsList}>
              {quickActions.map((item) => renderQuickAction({ item }))}
            </View>
          </ScrollView>
        </Animated.View>

        {/* STATISTIK LAPORAN - TAMPILKAN DATA SUMMARY */}
        <Animated.View style={{ opacity: fadeStats, transform: [{ translateY: slideStats }] }}>
          <Text style={styles.sectionTitle}>Statistik Laporan</Text>
          <Text style={styles.statsNote}>📊 Data diperbarui setiap 24 jam</Text>
          <View style={styles.statsContainer}>
            {[{ icon: 'alert-circle', label: 'Kehilangan Hari Ini', value: 12 },
              { icon: 'checkmark-circle', label: 'Ditemukan Hari Ini', value: 8 },
              { icon: 'time-outline', label: 'Belum Ditemukan', value: 4 },
            ].map((item, i) => (
              <LinearGradient
                key={i}
                colors={['#FFC107', '#388E3C']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.statCard}
              >
                <Ionicons name={item.icon} size={24} color="#fff" />
                <Text style={[styles.statValue, { color: '#fff' }]}>{item.value}</Text>
                <Text style={[styles.statLabel, { color: '#FFF8E8' }]}>{item.label}</Text>
              </LinearGradient>
            ))}
          </View>
        </Animated.View>

        {/* DAFTAR BARANG DENGAN IMBALAN TERUSINGGI */}
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

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAFAF5' },
  header: { borderBottomLeftRadius: 24, borderBottomRightRadius: 24, overflow: 'hidden', elevation: 8 },
  headerGradient: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 24,
    alignItems: 'center',
  },
  headerTitle: { fontSize: 26, fontWeight: '900', color: '#fff', letterSpacing: 1 },
  headerSubtitle: { fontSize: 13, color: '#FFF8E8' },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 14,
    paddingHorizontal: 10,
    height: 36,
    width: 150,
    elevation: 2,
  },
  searchInput: { flex: 1, fontSize: 12, color: '#333' },
  greetingContainer: { marginHorizontal: 20, marginTop: 20 },
  greeting: { fontSize: 18, fontWeight: '700', color: '#222' },
  welcomeText: { fontSize: 13, color: '#666', marginTop: 4 },
  sliderImage: {
    width: width * 0.9,
    height: 160,
    borderRadius: 18,
    marginHorizontal: width * 0.05,
    marginVertical: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  // pagination dots
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: -8,
    marginBottom: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 8,
    backgroundColor: '#ccc',
    marginHorizontal: 6,
  },
  dotActive: {
    backgroundColor: '#2E4A0D',
    width: 12,
    height: 12,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
    marginHorizontal: 20,
    marginTop: 15,
    marginBottom: 6,
    color: '#000',
  },
  actionsList: { flexDirection: 'row', paddingHorizontal: 15, gap: 12, paddingBottom: 10 },
  actionCard: {
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 14,
    alignItems: 'center',
    justifyContent: 'center',
    width: 100,
    height: 100,
    elevation: 3,
  },
  iconBox: { padding: 10, borderRadius: 50, marginBottom: 6 },
  actionText: { fontSize: 12, fontWeight: '600', textAlign: 'center', color: '#222' },
  statsNote: { fontSize: 11, color: '#ff0000ff', marginHorizontal: 20, marginBottom: 6 },
  statsContainer: { flexDirection: 'row', justifyContent: 'space-around', marginHorizontal: 10, marginBottom: 20 },
  statCard: { flex: 1, alignItems: 'center', marginHorizontal: 6, borderRadius: 16, paddingVertical: 16 },
  statValue: { fontSize: 18, fontWeight: 'bold' },
  statLabel: { fontSize: 11, textAlign: 'center' },
  bountyCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 16,
    marginHorizontal: 20,
    marginBottom: 12,
    elevation: 3,
    padding: 12,
  },
  bountyImage: { width: 70, height: 70, borderRadius: 12, marginRight: 10 },
  bountyInfo: { flex: 1 },
  bountyTitle: { fontSize: 15, fontWeight: '700', color: '#111' },
  bountySub: { fontSize: 12, color: '#666' },
  bountyReward: { fontSize: 13, color: '#b12e2eff', fontWeight: 'bold', marginTop: 4 },
});
