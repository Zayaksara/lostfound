// LaporItemScreen.js
import { Ionicons } from '@expo/vector-icons';
import * as FileSystem from 'expo-file-system';
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
  const [namaBarang, setNamaBarang] = useState('');
  const [lokasi, setLokasi] = useState('');
  const [deskripsi, setDeskripsi] = useState('');
  const [kontak, setKontak] = useState('');
  const [imageUri, setImageUri] = useState(null); // path di storage app

  // Minta izin saat komponen mount (opsional — juga diminta saat pick)
  useEffect(() => {
    (async () => {
      try {
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      } catch (e) {
        console.log('Permission error', e);
      }
    })();
  }, []);

  // PICK IMAGE from gallery & copy to app folder DocumentDirectory/img/
  const pickImageAndSave = async () => {
    try {
      const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (perm.status !== 'granted') {
        Alert.alert('Izin dibutuhkan', 'Aplikasi butuh izin untuk mengakses galeri.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 1,
        allowsEditing: true,
      });

      if (result.canceled || !result.assets || result.assets.length === 0) return;

      const asset = result.assets[0];
      const sourceUri = asset.uri;

      // buat folder img di DocumentDirectory jika belum ada
      const dir = FileSystem.documentDirectory + 'img/';
      const dirInfo = await FileSystem.getInfoAsync(dir);
      if (!dirInfo.exists) {
        await FileSystem.makeDirectoryAsync(dir, { intermediates: true });
      }

      const fileExt = sourceUri.split('.').pop().split('?')[0] || 'jpg';
      const fileName = `img_${Date.now()}.${fileExt}`;
      const dest = dir + fileName;

      // coba copy, jika gagal coba downloadAsync (fallback)
      try {
        await FileSystem.copyAsync({ from: sourceUri, to: dest });
      } catch (errCopy) {
        // fallback untuk beberapa URI (content://) — coba downloadAsync
        try {
          await FileSystem.downloadAsync(sourceUri, dest);
        } catch (errDownload) {
          console.log('Copy and download both failed:', errCopy, errDownload);
          throw new Error('Gagal menyimpan gambar ke storage aplikasi.');
        }
      }

      setImageUri(dest);
      Alert.alert('Sukses', 'Gambar tersimpan di folder aplikasi.');
    } catch (err) {
      console.log(err);
      Alert.alert('Error', err.message || 'Terjadi kesalahan saat memilih gambar.');
    }
  };

  const removeImage = async () => {
    if (!imageUri) return;
    try {
      const info = await FileSystem.getInfoAsync(imageUri);
      if (info.exists) {
        await FileSystem.deleteAsync(imageUri, { idempotent: true });
      }
    } catch (e) {
      console.log('hapus gambar error', e);
    } finally {
      setImageUri(null);
    }
  };

  const handleSubmit = async () => {
    if (!namaBarang || !lokasi || !deskripsi || !kontak) {
      Alert.alert('⚠️ Peringatan', 'Harap isi semua data terlebih dahulu.');
      return;
  }

    // contoh payload untuk disimpan / diupload
    const payload = {
      namaBarang,
      lokasi,
      deskripsi,
      kontak,
      imagePath: imageUri, // path di storage aplikasi
    };

    // TODO: kirim payload ke server / simpan ke local DB sesuai kebutuhan
    console.log('mengirim payload:', payload);

    Alert.alert(
      '✅ Laporan Dikirim',
      `Barang "${namaBarang}" berhasil dilaporkan hilang.\n\nKami akan menampilkan laporanmu di daftar barang hilang.`
    );

    setNamaBarang('');
    setLokasi('');
    setDeskripsi('');
    setKontak('');
    setImageUri(null);
  };

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

      <ScrollView showsVerticalScrollIndicator={false} style={styles.form}>
        {/* Nama */}
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

        {/* Lokasi */}
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

        {/* Deskripsi */}
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

        {/* Kontak */}
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

        {/* IMAGE PICKER */}
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
