import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import {
  FlatList,
  StatusBar,
  Text,
  View,
} from 'react-native';

import styles from '../styles/NotifikasiItemStyles'; // ⬅ STYLE TERPISAH

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
