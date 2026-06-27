import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, ActivityIndicator, SafeAreaView, StatusBar, Platform } from 'react-native';
import CountryFlag from "react-native-country-flag";

export default function ExploreScreen() {
  const [rates, setRates] = useState<any>({});
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchAllRates = async () => {
    try {
      const response = await fetch('https://v6.exchangerate-api.com/v6/5114366b336dfa7ab5f719bf/latest/USD');
      const data = await response.json();
      if (data.conversion_rates) {
        setRates(data.conversion_rates);
      }
    } catch (error) { 
      console.error(error); 
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAllRates(); }, []);

  const filteredData = Object.keys(rates).filter((code) => 
    code.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" />
      <View style={styles.container}>
        <Text style={styles.title}>Daftar Kurs Terkini</Text>
        
        <TextInput 
          style={styles.searchBar}
          placeholder="Cari mata uang (misal: USD)..."
          placeholderTextColor="#888"
          value={search}
          onChangeText={setSearch}
        />

        {loading ? (
          <ActivityIndicator size="large" color="#8b5cf6" style={{marginTop: 50}} />
        ) : (
          <FlatList
            data={filteredData}
            keyExtractor={(item) => item}
            renderItem={({ item }) => (
              <View style={styles.row}>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <CountryFlag isoCode={item.substring(0, 2).toLowerCase()} size={20} />
                  <Text style={[styles.currency, {marginLeft: 10}]}>{item}</Text>
                </View>
                <Text style={styles.rate}>
                  1 {item} = Rp {Math.round(rates[item]).toLocaleString('id-ID')}
                </Text>
              </View>
            )}
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#121212', paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0 },
  container: { flex: 1, padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#fff', marginBottom: 20 },
  searchBar: { 
    backgroundColor: '#1e1e1e', 
    padding: 15, 
    borderRadius: 12, 
    color: '#fff', 
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#333'
  },
  row: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    paddingVertical: 15, 
    borderBottomWidth: 1, 
    borderBottomColor: '#333' 
  },
  currency: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  rate: { color: '#aaa', fontSize: 16 },
});