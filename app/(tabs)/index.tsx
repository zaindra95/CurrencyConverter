import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator, SafeAreaView, StatusBar, Platform } from 'react-native';

export default function CurrencyCardLayout() {
  const [amount, setAmount] = useState('14000');
  const [selectedCurrency, setSelectedCurrency] = useState('USD');
  const [isReverse, setIsReverse] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [rates, setRates] = useState<any>({ USD: 15900, EUR: 17200, JPY: 105, GBP: 20100 });
  const [loading, setLoading] = useState(false);

  const currencies = [
    { code: 'USD', name: 'US Dollar' },
    { code: 'EUR', name: 'Euro' },
    { code: 'JPY', name: 'Yen' },
    { code: 'GBP', name: 'Pound' },
  ];

  const toggleTheme = () => setIsDarkMode(!isDarkMode);

  const theme = {
    bg: isDarkMode ? '#121212' : '#ffffff',
    card: isDarkMode ? '#1e1e1e' : '#f0f0f0',
    text: isDarkMode ? '#ffffff' : '#121212',
    subText: isDarkMode ? '#aaaaaa' : '#666666',
  };

  const fetchRates = async () => {
  setLoading(true);
  try {
    // Pastikan URL-nya sama dengan yang di explore.tsx
    const response = await fetch('https://v6.exchangerate-api.com/v6/5114366b336dfa7ab5f719bf/latest/USD');
    const data = await response.json();
    
    // CEK INI: Kita update state `rates` pake `conversion_rates` dari API
    if (data.conversion_rates) {
      setRates(data.conversion_rates);
      console.log("Data berhasil diambil:", data.conversion_rates); // Biar lo bisa liat di console
    }
  } catch (error) { 
    console.error("Gagal fetch di index:", error); 
  } finally { 
    setLoading(false); 
  }
};

  useEffect(() => { fetchRates(); }, []);

  const numericAmount = parseFloat(amount.replace(/[^0-9]/g, '')) || 0;
  const currentRate = rates[selectedCurrency] || 1; 
  // Rumus konversi yang pas:
  const result = isReverse 
  ? (numericAmount * currentRate).toFixed(2) 
  : (numericAmount / rates['IDR'] * currentRate).toFixed(2);// Konversi dari IDR ke Asing
  const formatNumber = (num: string) => num.replace(/\B(?=(\d{3})+(?!\d))/g, ".");

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.bg, paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0 }}>
      <StatusBar barStyle={isDarkMode ? "light-content" : "dark-content"} />
      <ScrollView style={styles.container}>
        <Text style={styles.subTitle}>Currency Converter</Text>
        
        <View style={styles.header}>
          <Text style={[styles.title, { color: theme.text }]}>{isReverse ? 'Asing ➔ IDR' : 'IDR ➔ Asing'}</Text>
          <View style={{flexDirection: 'row'}}>
            <TouchableOpacity onPress={toggleTheme} style={styles.iconCircle}><Text>{isDarkMode ? '☀️' : '🌙'}</Text></TouchableOpacity>
            <TouchableOpacity onPress={fetchRates} style={[styles.iconCircle, {marginLeft: 10}]}><Text style={[styles.iconText, {color: theme.text}]}>↻</Text></TouchableOpacity>
          </View>
        </View>

        <View style={[styles.inputCard, { backgroundColor: theme.card }]}>
          <Text style={[styles.label, { color: theme.subText }]}>{isReverse ? 'JUMLAH MATA UANG ASING' : 'JUMLAH RUPIAH'}</Text>
          <TextInput style={[styles.amountInput, { color: theme.text }]} value={formatNumber(amount.replace(/[^0-9]/g, ''))} onChangeText={(text) => setAmount(text.replace(/[^0-9]/g, ''))} keyboardType="numeric" />
        </View>

        <TouchableOpacity style={styles.divider} onPress={() => setIsReverse(!isReverse)}><Text style={styles.dividerText}>⇅ Tukar Arah Sekarang</Text></TouchableOpacity>

        <Text style={[styles.sectionLabel, { color: theme.subText }]}>PILIH MATA UANG</Text>
        <View style={styles.gridContainer}>
          {currencies.map((item) => (
            <TouchableOpacity 
              key={item.code} 
              style={[styles.currencyBox, { backgroundColor: theme.card }, selectedCurrency === item.code && styles.activeCurrencyBox]} 
              onPress={() => setSelectedCurrency(item.code)}
            >
              <Text style={[styles.currencyCode, { color: theme.text }]}>{item.code}</Text>
              <Text style={[styles.currencyName, { color: theme.subText }]}>{item.name}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={[styles.resultCard, { backgroundColor: isDarkMode ? '#2d2d5e' : '#e0e7ff' }]}>
          <Text style={[styles.label, { color: isDarkMode ? '#aaa' : '#555' }]}>HASIL KONVERSI</Text>
          {loading ? <ActivityIndicator color={theme.text} /> : <Text style={[styles.resultAmount, { color: theme.text }]}>{result} {isReverse ? 'IDR' : selectedCurrency}</Text>}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  subTitle: { color: '#8b5cf6', fontSize: 11, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 5 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  title: { fontSize: 24, fontWeight: '800' },
  iconCircle: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#a855f720', alignItems: 'center', justifyContent: 'center' },
  iconText: { fontSize: 20 },
  inputCard: { borderRadius: 20, padding: 20, marginBottom: 10 },
  label: { fontSize: 12, fontWeight: 'bold' },
  amountInput: { fontSize: 32, fontWeight: 'bold' },
  divider: { alignItems: 'center', marginVertical: 15 },
  dividerText: { color: '#8b5cf6', fontWeight: 'bold' },
  sectionLabel: { marginBottom: 10, fontSize: 12, fontWeight: 'bold' },
  gridContainer: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginBottom: 20 },
  currencyBox: { width: '48%', padding: 15, borderRadius: 15, marginBottom: 10 },
  activeCurrencyBox: { borderWidth: 2, borderColor: '#8b5cf6' },
  currencyCode: { fontSize: 16, fontWeight: 'bold' },
  currencyName: { fontSize: 12 },
  resultCard: { borderRadius: 20, padding: 20, marginBottom: 40 },
  resultAmount: { fontSize: 40, fontWeight: 'bold', marginVertical: 10 },
});