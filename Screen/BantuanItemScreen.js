import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useState } from 'react';
import {
  Dimensions,
  LayoutAnimation,
  Linking,
  Platform,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  UIManager,
  View,
} from 'react-native';

import styles from '../styles/BantuanItemStyles'; // ⬅ STYLE TERPISAH

const { width } = Dimensions.get('window');

// Aktifkan animasi layout di Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export default function BantuanItemScreen() {
  const [expanded, setExpanded] = useState(null);

  const faqData = [
    {
      id: 1,
      question: 'Bagaimana cara melaporkan barang hilang?',
      answer:
        'Masuk ke menu “Lapor Barang”, isi detail seperti nama barang, lokasi, waktu kehilangan, dan tambahkan foto. Setelah dikirim, admin akan memverifikasi laporan kamu.',
    },
    {
      id: 2,
      question: 'Bagaimana cara melihat barang yang ditemukan?',
      answer:
        'Kamu bisa masuk ke menu “Barang Ditemukan” untuk melihat daftar barang yang sudah dilaporkan oleh pengguna lain.',
    },
    {
      id: 3,
      question: 'Berapa lama laporan diverifikasi?',
      answer:
        'Biasanya 1x24 jam setelah pengiriman laporan. Kamu akan mendapatkan notifikasi jika laporan sudah diverifikasi.',
    },
    {
      id: 4,
      question: 'Apakah saya bisa menghapus laporan saya?',
      answer:
        'Ya, kamu bisa menghapus laporan melalui halaman profil atau menu riwayat laporan jika barang sudah ditemukan.',
    },
  ];

  const toggleExpand = (id) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpanded(expanded === id ? null : id);
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
        <Text style={styles.headerTitle}>Pusat Bantuan</Text>
      </LinearGradient>

      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
        <Text style={styles.sectionTitle}>❓ Pertanyaan Umum</Text>

        {faqData.map((item) => (
          <View key={item.id} style={styles.faqCard}>
            <TouchableOpacity
              style={styles.faqHeader}
              onPress={() => toggleExpand(item.id)}
              activeOpacity={0.7}
            >
              <Text style={styles.faqQuestion}>{item.question}</Text>
              <Ionicons
                name={expanded === item.id ? 'chevron-up' : 'chevron-down'}
                size={20}
                color="#333"
              />
            </TouchableOpacity>

            {expanded === item.id && (
              <Text style={styles.faqAnswer}>{item.answer}</Text>
            )}
          </View>
        ))}

        <Text style={styles.sectionTitle}>📞 Hubungi Kami</Text>
        <View style={styles.contactCard}>
          <Ionicons name="call-outline" size={22} color="#006B3F" />
          <TouchableOpacity onPress={() => Linking.openURL('https://wa.me/+628889903069')}>
            <Text style={styles.contactText}>+62 888-9903-069 (Super Deu)</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.contactCard}>
          <Ionicons name="mail-outline" size={22} color="#006B3F" />
          <TouchableOpacity onPress={() => Linking.openURL('mailto:farizinformatikaa@gmail.com')}>
            <Text style={styles.contactText}>farizinformatikaa@gmail.com</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}
