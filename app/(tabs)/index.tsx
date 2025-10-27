import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React, { useEffect } from 'react';
import { Image, StyleSheet, View } from 'react-native';

import BantuanItemScreen from '../../Screen/BantuanItemScreen';
import DataLaporanItemScreen from '../../Screen/DataLaporanItemScreen';
import FoundItemScreen from '../../Screen/FoundItemScreen';
import HomeScreen from '../../Screen/HomeScreen';
import LaporItemScreen from '../../Screen/LaporItemScreen';
import NotifikasiItemScreen from '../../Screen/NotifikasiItemScreen';

// ==========================================
// PRELOAD SEMUA GAMBAR UNTUK PERFORMANCE
// Import semua gambar supaya di-cache sejak awal
// ==========================================
const preloadImages = {

  // Gambar buat slider
  cat: require('../../assets/images/halaman/cat.png'),
  cat2: require('../../assets/images/halaman/cat2.png'),
  cat3: require('../../assets/images/halaman/cat3.png'),
  
  // Gambar dari folder halaman (HomeScreen)
  kunci: require('../../assets/images/halaman/kunci.png'),
  ktm: require('../../assets/images/halaman/ktm.png'),
  headphone: require('../../assets/images/halaman/headphone.png'),
  botol: require('../../assets/images/halaman/botol.png'),
  flashdisk: require('../../assets/images/halaman/flashdisk.png'),
  
  // Gambar dari folder nemu (FoundItemScreen)
  pod: require('../../assets/images/nemu/pod.jpg'),
  iphone: require('../../assets/images/nemu/iphone.png'),
};


const Stack = createNativeStackNavigator();

export default function Index() {
  // PRELOAD SEMUA GAMBAR SETIAP KALI NAVIGATOR LOAD
  useEffect(() => {
    // Preload images dengan Image.prefetch untuk web
    if (typeof Image.prefetch !== 'undefined') {
      Object.values(preloadImages).forEach((img) => {
        if (img && typeof img === 'number') {
          Image.prefetch(Image.resolveAssetSource(img).uri);
        }
      });
    }
    
    // Preload untuk mobile (require() sudah otomatis cache)
    console.log('✅ Gambar preloaded untuk performa optimal');
  }, []);

  return (
    <View style={styles.container}>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="FoundItem" component={FoundItemScreen} />
        <Stack.Screen name="LaporItem" component={LaporItemScreen} />
        <Stack.Screen name="DataLaporanItem" component={DataLaporanItemScreen} />
        <Stack.Screen name="NotifikasiItem" component={NotifikasiItemScreen} />
        <Stack.Screen name="BantuanItem" component={BantuanItemScreen} />
      </Stack.Navigator>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
