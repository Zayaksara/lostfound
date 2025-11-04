import React from 'react'; 
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  StatusBar,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

export default function NotifikasiItemScreen() {
  const notifications = [
    {
      id: '1',
      title: 'Barang kamu sudah diverifikasi!',
      desc: 'Laporan kehilangan “Kunci Motor Scoopy” sudah diverifikasi oleh admin.',
      time: '5 menit lalu',
      type: 'success',
    },
    {
      id: '2',
      title: 'Ada barang mirip dengan laporanmu!',
      desc: 'Seseorang melaporkan menemukan “Kunci Motor” di area parkir FST.',
      time: '2 jam lalu',
      type: 'info',
    },
    {
      id: '3',
      title: 'Laporanmu telah diterima',
      desc: 'Kami sedang memproses laporan kehilangan “Kartu KTM Mahasiswa”.',
      time: '1 hari lalu',
      type: 'pending',
    },
  ];

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.iconContainer}>
        <Ionicons
          name={
            item.type === 'success'
              ? 'checkmark-circle-outline'
              : item.type === 'info'
              ? 'information-circle-outline'
              : 'time-outline'
          }
          size={28}
          color={
            item.type === 'success'
              ? '#2ECC71'
              : item.type === 'info'
              ? '#3498DB'
              : '#F1C40F'
          }
        />
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.desc}>{item.desc}</Text>
        <Text style={styles.time}>{item.time}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#C9A13B" />
      <LinearGradient
        colors={['#B38E2F', '#006B3F']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <Text style={styles.headerTitle}>Notifikasi</Text>
      </LinearGradient>

      <FlatList
        data={notifications}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
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
  },

  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    marginHorizontal: 20,
    marginVertical: 10,
    borderRadius: 14,
    padding: 12,
    elevation: 3,
  },
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  textContainer: { flex: 1 },
  title: { fontSize: 15, fontWeight: '700', color: '#222' },
  desc: { fontSize: 13, color: '#555', marginTop: 4 },
  time: { fontSize: 11, color: '#888', marginTop: 6 },
});
