import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StyleSheet, View } from 'react-native';

import HomeScreen from '../../Screen/HomeScreen';
import FoundItemScreen from '../../Screen/FoundItemScreen';
import LaporItemScreen from '../../Screen/LaporItemScreen';
import DataLaporanItemScreen from '../../Screen/DataLaporanItemScreen';
import NotifikasiItemScreen from '../../Screen/NotifikasiItemScreen';
import BantuanItemScreen from '../../Screen/BantuanItemScreen';


const Stack = createNativeStackNavigator();

export default function Index() {
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
