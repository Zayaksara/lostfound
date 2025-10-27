// ==========================================
// LAPOR ITEM SCREEN
// Screen untuk membuat laporan barang hilang
// ==========================================

import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system/legacy';
import * as ImagePicker from 'expo-image-picker';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  Dimensions,
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

export default function LaporItemScreen() {
  // STATE UNTUK SIMPAN DATA FORM
  const [namaBarang, setNamaBarang] = useState('');        // Nama barang yang hilang
  const [lokasi, setLokasi] = useState('');                 // Lokasi kehilangan
  const [deskripsi, setDeskripsi] = useState('');           // Deskripsi barang
  const [kontak, setKontak] = useState('');                 // Nomor WA/Email
  const [imbalan, setImbalan] = useState('');              // Imbalan (opsional)
  const [imageUri, setImageUri] = useState(null);           // Path gambar

  // MINTA IZIN AKSES GALERI SAAT PERTAMA KALI BUKA
  useEffect(() => {
    (async () => {
      try {
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      } catch (e) {
        console.log('Permission error', e);
      }
    })();
  }, []);

  // ==========================================
  // FUNGSI UNTUK PILIH DAN SIMPAN GAMBAR
  // ==========================================
  const pickImageAndSave = async () => {
    try {
      // Cek izin akses galeri dulu
      const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (perm.status !== 'granted') {
        Alert.alert('Izin dibutuhkan', 'Aplikasi butuh izin untuk mengakses galeri.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 0.5, // Kompres ke 50% untuk menghemat storage
        allowsEditing: true,
      });

      if (result.canceled || !result.assets || result.assets.length === 0) return;

      const asset = result.assets[0];
      const sourceUri = asset.uri;

      // CEK APLIKASI JALAN DI WEB ATAU MOBILE?
      const isWeb = typeof window !== 'undefined';
      
      if (isWeb) {
        // ========== DI WEB / LAPTOP ==========
        // Langsung pakai URL gambar, simpan ke AsyncStorage
        setImageUri(sourceUri);
        Alert.alert('Sukses', 'Gambar tersimpan.');
      } else {
        // ========== DI MOBILE ==========
        // 1. Buat folder img/ di penyimpanan aplikasi
        const dir = FileSystem.documentDirectory + 'img/';
        const dirInfo = await FileSystem.getInfoAsync(dir);
        if (!dirInfo.exists) {
          await FileSystem.makeDirectoryAsync(dir, { intermediates: true });
        }

        // 2. Copy gambar dari galeri ke folder aplikasi
        const fileExt = sourceUri.split('.').pop().split('?')[0] || 'jpg';
        const fileName = `img_${Date.now()}.${fileExt}`;
        const dest = dir + fileName;

        try {
          await FileSystem.copyAsync({ from: sourceUri, to: dest });
        } catch (errCopy) {
          try {
            await FileSystem.downloadAsync(sourceUri, dest);
          } catch (errDownload) {
            console.log('Copy and download both failed:', errCopy, errDownload);
            throw new Error('Gagal menyimpan gambar.');
          }
        }

        // 3. Convert gambar jadi base64 supaya bisa ditampilkan
        const base64Image = await FileSystem.readAsStringAsync(dest, {
          encoding: FileSystem.EncodingType.Base64,
        });
        
        // 4. Hapus file fisik setelah convert (hemat storage)
        try {
          await FileSystem.deleteAsync(dest, { idempotent: true });
        } catch (e) {
          console.log('Hapus file fisik:', e);
        }
        
        // 5. Set format gambar (jpg/png)
        let mimeType = 'image/jpeg';
        const ext = fileExt.toLowerCase();
        if (ext === 'png') mimeType = 'image/png';
        
        // 6. Simpan sebagai data URI (format yang bisa ditampilkan)
        const imageDataUri = `data:${mimeType};base64,${base64Image}`;
        setImageUri(imageDataUri);
        
        // 7. Cek ukuran file
        const sizeInMB = (base64Image.length * 3) / 4 / (1024 * 1024);
        if (sizeInMB > 2) {
          Alert.alert('⚠️ Gambar Besar', `Ukuran gambar: ${sizeInMB.toFixed(2)} MB. Disarankan gunakan gambar yang lebih kecil.`);
        } else {
          Alert.alert('Sukses', 'Gambar tersimpan.');
        }
      }
    } catch (err) {
      console.log(err);
      Alert.alert('Error', err.message || 'Terjadi kesalahan saat memilih gambar.');
    }
  };

  // FUNGSI HAPUS GAMBAR YANG SUDAH DIPILIH
  const removeImage = async () => {
    if (!imageUri) return;
    // File fisik sudah dihapus setelah base64 conversion, tinggal reset state
    setImageUri(null);
  };

  // ==========================================
  // FUNGSI UNTUK KIRIM LAPORAN
  // ==========================================
  const handleSubmit = async () => {
    if (!namaBarang || !lokasi || !deskripsi || !kontak) {
      Alert.alert('⚠️ Peringatan', 'Harap isi semua data terlebih dahulu.');
      return;
    }

    // BUAT DATA UNTUK DISIMPAN
    const payload = {
      id: `report_${Date.now()}`,              // ID unik untuk setiap laporan
      namaBarang,                              // Nama barang hilang
      lokasi,                                  // Lokasi kehilangan
      deskripsi,                               // Deskripsi barang
      kontak,                                  // Nomor WA/Email
      imbalan: imbalan || 'Tidak ada',        // Imbalan yang ditawarkan
      imageData: imageUri,                     // Gambar barang (base64)
      date: new Date().toLocaleDateString('id-ID', { 
        day: '2-digit', 
        month: 'short', 
        year: 'numeric' 
      }),                                      // Tanggal laporan
      status: 'Menunggu Verifikasi',           // Status default
    };

    try {
      // 1. Ambil data laporan yang sudah ada
      const existingData = await AsyncStorage.getItem('reports');
      const reports = existingData ? JSON.parse(existingData) : [];
      
      // 2. Tambahkan laporan baru di paling atas
      reports.unshift(payload);
      
      // 3. Simpan ulang ke AsyncStorage
      await AsyncStorage.setItem('reports', JSON.stringify(reports));
      
      console.log('Laporan tersimpan:', payload);

      // 4. Tampilkan notifikasi sukses
      Alert.alert(
        '✅ Laporan Dikirim',
        `Barang "${namaBarang}" berhasil dilaporkan hilang.\n\nKami akan menampilkan laporanmu di daftar barang hilang.`
      );

      setNamaBarang('');
      setLokasi('');
      setDeskripsi('');
      setKontak('');
      setImbalan('');
      setImageUri(null);
    } catch (error) {
      console.log('Error saving report:', error);
      Alert.alert('Error', 'Gagal menyimpan laporan.');
    }
  };

  // ==========================================
  // RENDER UI FORM
  // ==========================================
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#C9A13B" />

      <LinearGradient
        colors={['#B38E2F', '#006B3F']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <Text style={styles.headerTitle}>Form Laporan Kehilangan</Text>
        <Text style={styles.headerSubtitle}>
          Isi data berikut untuk melaporkan barang yang hilang
        </Text>
      </LinearGradient>

      {/* FORM INPUT DATA */}
      <ScrollView showsVerticalScrollIndicator={false} style={styles.form}>
        {/* NAMA BARANG */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Nama Barang</Text>
          <View style={styles.inputBox}>
            <Ionicons name="cube-outline" size={18} color="#777" />
            <TextInput
              style={styles.input}
              placeholder="Contoh: Dompet coklat"
              placeholderTextColor="#999"
              value={namaBarang}
              onChangeText={setNamaBarang}
            />
          </View>
        </View>

        {/* LOKASI KEHILANGAN */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Lokasi Kehilangan</Text>
          <View style={styles.inputBox}>
            <Ionicons name="location-outline" size={18} color="#777" />
            <TextInput
              style={styles.input}
              placeholder="Contoh: Gedung FDKI Lantai 2"
              placeholderTextColor="#999"
              value={lokasi}
              onChangeText={setLokasi}
            />
          </View>
        </View>

        {/* DESKRIPSI BARANG */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Deskripsi Barang</Text>
          <View style={styles.textAreaBox}>
            <Ionicons name="document-text-outline" size={18} color="#777" />
            <TextInput
              style={styles.textArea}
              placeholder="Tuliskan ciri-ciri, warna, atau detail lain..."
              placeholderTextColor="#999"
              multiline
              numberOfLines={4}
              value={deskripsi}
              onChangeText={setDeskripsi}
            />
          </View>
        </View>

        {/* KONTAK (WA/EMAIL) */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Kontak yang Bisa Dihubungi</Text>
          <View style={styles.inputBox}>
            <Ionicons name="call-outline" size={18} color="#777" />
            <TextInput
              style={styles.input}
              placeholder="Nomor WhatsApp atau Email"
              placeholderTextColor="#999"
              keyboardType="default"
              value={kontak}
              onChangeText={setKontak}
            />
          </View>
        </View>

        {/* IMBALAN (OPSIONAL) */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Imbalan (opsional)</Text>
          <View style={styles.inputBox}>
            <Ionicons name="cash-outline" size={18} color="#777" />
            <TextInput
              style={styles.input}
              placeholder="Contoh: Rp 50.000 atau Tidak ada"
              placeholderTextColor="#999"
              keyboardType="default"
              value={imbalan}
              onChangeText={setImbalan}
            />
          </View>
        </View>

        {/* GAMBAR BARANG (FOTO) */}
        <View style={[styles.inputGroup, { marginBottom: 6 }]}>
          <Text style={styles.label}>Foto / Bukti (opsional)</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Pressable
              onPress={pickImageAndSave}
              style={({ pressed }) => [
                {
                  flexDirection: 'row',
                  alignItems: 'center',
                  padding: 10,
                  backgroundColor: '#fff',
                  borderRadius: 12,
                  elevation: 2,
                },
                pressed && { opacity: 0.8 },
              ]}
            >
              <Ionicons name="image-outline" size={18} color="#333" />
              <Text style={{ marginLeft: 8 }}>Pilih Gambar</Text>
            </Pressable>

            {imageUri ? (
              <Pressable
                onPress={removeImage}
                style={{ marginLeft: 12, padding: 8, backgroundColor: '#fee', borderRadius: 10 }}
              >
                <Text style={{ color: '#900' }}>Hapus</Text>
              </Pressable>
            ) : null}
          </View>

          {imageUri ? (
            <Image source={{ uri: imageUri }} style={styles.imagePreview} />
          ) : (
            <Text style={{ color: '#777', marginTop: 8 }}>Belum ada gambar dipilih.</Text>
          )}
        </View>

        {/* TOMBOL KIRIM LAPORAN */}
        <Pressable
          style={({ pressed }) => [
            styles.submitBtn,
            { opacity: pressed ? 0.8 : 1, transform: [{ scale: pressed ? 0.97 : 1 }] },
          ]}
          onPress={handleSubmit}
        >
          <LinearGradient
            colors={['#D4AF37', '#2E4A0D']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.submitGradient}
          >
            <Ionicons name="send-outline" size={18} color="#fff" />
            <Text style={styles.submitText}>Kirim Laporan</Text>
          </LinearGradient>
        </Pressable>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAFAF5' },
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
    marginBottom: 8,
  },
  headerSubtitle: { color: '#FFF8E8', fontSize: 13 },
  form: { paddingHorizontal: 20, marginTop: 20 },
  inputGroup: { marginBottom: 16 },
  label: { fontSize: 13, fontWeight: '600', color: '#333', marginBottom: 6 },
  inputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 14,
    paddingHorizontal: 10,
    elevation: 2,
    height: 40,
  },
  input: { flex: 1, marginLeft: 6, fontSize: 13, color: '#222' },
  textAreaBox: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 10,
    elevation: 2,
    alignItems: 'flex-start',
  },
  textArea: { flex: 1, marginLeft: 6, fontSize: 13, color: '#222', textAlignVertical: 'top' },
  submitBtn: { marginTop: 10, alignSelf: 'center' },
  submitGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 40,
  },
  submitText: { color: '#fff', fontWeight: '700', fontSize: 14, marginLeft: 6 },
  imagePreview: {
    width: 180,
    height: 180,
    borderRadius: 10,
    marginTop: 10,
    resizeMode: 'cover',
  },
});
