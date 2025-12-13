import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import React, { useEffect, useRef, useState } from 'react';
import {
  Alert,
  Animated,
  Image,
  Pressable,
  ScrollView,
  StatusBar,
  Text,
  TextInput,
  View
} from 'react-native';

import styles from '../styles/LaporItemStyles';

export default function LaporItemScreen({ navigation }) {
  const [namaBarang, setNamaBarang] = useState('');
  const [lokasi, setLokasi] = useState('');
  const [deskripsi, setDeskripsi] = useState('');
  const [kontak, setKontak] = useState('');
  const [imbalan, setImbalan] = useState('');
  const [imageUri, setImageUri] = useState(null);

  const fade = useRef(new Animated.Value(0)).current;
  const up = useRef(new Animated.Value(30)).current;
  const scaleBtn = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fade, { toValue: 1, duration: 600, useNativeDriver: true }),
      Animated.spring(up, { toValue: 0, friction: 7, useNativeDriver: true }),
    ]).start();
  }, []);

  const onlyLetters = (t) => t.replace(/[^a-zA-Z ]/g, '');
  const lettersNumbers = (t) => t.replace(/[^a-zA-Z0-9 ]/g, '');
  const onlyNumbers = (t) => t.replace(/[^0-9]/g, '');

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      quality: 0.5,
    });

    if (!result.canceled) setImageUri(result.assets[0].uri);
  };

  const submit = async () => {
    Animated.sequence([
      Animated.timing(scaleBtn, { toValue: 0.92, duration: 80, useNativeDriver: true }),
      Animated.timing(scaleBtn, { toValue: 1, duration: 80, useNativeDriver: true }),
    ]).start();

    if (!namaBarang || !lokasi || !deskripsi || !kontak) {
      Alert.alert('⚠️ Lengkapi!', 'Semua field wajib diisi.');
      return;
    }

    const data = {
      id: Date.now().toString(),
      namaBarang,
      lokasi,
      deskripsi,
      kontak,
      imbalan: imbalan || '0',
      imageData: imageUri,
      date: new Date().toLocaleDateString('id-ID'),
      status: 'Menunggu Verifikasi',
    };

    const existing = await AsyncStorage.getItem('reports');
    const arr = existing ? JSON.parse(existing) : [];
    arr.unshift(data);
    await AsyncStorage.setItem('reports', JSON.stringify(arr));

    Alert.alert('🎉 Berhasil!', 'Laporan dikirim.');
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* HEADER */}
      <View style={styles.header}>
        <Pressable
          style={styles.backBtn}
          onPress={() => navigation.goBack()}
          android_ripple={{ color: 'rgba(255,255,255,0.2)' }}
        >
          <Ionicons name="arrow-back" size={22} color="#fff" />
        </Pressable>
        <Text style={styles.headerTitle}>Lapor Barang Hilang</Text>
        <View style={{ width: 30 }} />
      </View>

      {/* BODY */}
      <Animated.View style={{ opacity: fade, transform: [{ translateY: up }], flex: 1 }}>
        <ScrollView showsVerticalScrollIndicator={false}>

          <View style={styles.card}>

            <Text style={styles.label}>Nama Barang</Text>
            <TextInput
              style={styles.input}
              placeholder="Contoh: Dompet"
              value={namaBarang}
              onChangeText={(t) => setNamaBarang(onlyLetters(t))}
            />

            <Text style={styles.label}>Lokasi Kehilangan</Text>
            <TextInput
              style={styles.input}
              placeholder="Gedung, Lantai"
              value={lokasi}
              onChangeText={(t) => setLokasi(lettersNumbers(t))}
            />

            <Text style={styles.label}>Deskripsi</Text>
            <TextInput
              style={styles.textArea}
              multiline
              placeholder="Ciri-ciri barang..."
              value={deskripsi}
              onChangeText={(t) => setDeskripsi(lettersNumbers(t))}
            />

            <Text style={styles.label}>Kontak (WA)</Text>
            <TextInput
              style={styles.input}
              placeholder="08xxxxxxxxxx"
              keyboardType="numeric"
              value={kontak}
              onChangeText={(t) => setKontak(onlyNumbers(t))}
            />

            <Text style={styles.label}>Imbalan (opsional)</Text>
            <TextInput
              style={styles.input}
              placeholder="50000"
              keyboardType="numeric"
              value={imbalan}
              onChangeText={(t) => setImbalan(onlyNumbers(t))}
            />

            {/* FOTO */}
            <Text style={styles.label}>Foto Barang</Text>
            <View style={styles.row}>
              <Pressable style={styles.pickBtn} onPress={pickImage}>
                <Ionicons name="image-outline" size={16} color="#333" />
                <Text style={{ marginLeft: 6 }}>Pilih Gambar</Text>
              </Pressable>
              {imageUri && (
                <Pressable style={styles.removeBtn} onPress={() => setImageUri(null)}>
                  <Ionicons name="trash-outline" size={16} color="#b00" />
                </Pressable>
              )}
            </View>

            {imageUri && <Image source={{ uri: imageUri }} style={styles.image} />}
          </View>
        </ScrollView>
      </Animated.View>

      {/* FLOATING BUTTON */}
      <Animated.View style={[styles.floatingWrap, { transform: [{ scale: scaleBtn }] }]}>
        <Pressable style={styles.floatingBtn} onPress={submit}>
          <Ionicons name="send-outline" size={18} color="#fff" />
          <Text style={styles.floatingText}>Kirim Laporan</Text>
        </Pressable>
      </Animated.View>
    </View>
  );
}
