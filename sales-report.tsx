import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

// 📊 Mock Sales Data per Month (100% English)
const MONTHLY_SALES_DATA: Record<
  string,
  {
    totalAmount: number;
    totalItems: number;
    topSeller: string;
    topSellerQty: number;
    orders: Array<{ id: string; name: string; qty: number; price: number; date: string }>;
  }
> = {
  September: {
    totalAmount: 24500,
    totalItems: 35,
    topSeller: 'Rose Quartz Crystal',
    topSellerQty: 18,
    orders: [
      { id: 'ORD-001', name: 'Rose Quartz Crystal', qty: 18, price: 890, date: '15 Sep 2026' },
      { id: 'ORD-002', name: 'Amethyst Cluster', qty: 10, price: 650, date: '18 Sep 2026' },
      { id: 'ORD-003', name: 'Clear Quartz Point', qty: 7, price: 300, date: '22 Sep 2026' },
    ],
  },
  October: {
    totalAmount: 0,
    totalItems: 0,
    topSeller: '-',
    topSellerQty: 0,
    orders: [], // Empty
  },
  November: {
    totalAmount: 0,
    totalItems: 0,
    topSeller: '-',
    topSellerQty: 0,
    orders: [], // Empty
  },
};

export default function SalesReportScreen() {
  const router = useRouter();
  const [selectedMonth, setSelectedMonth] = useState<'September' | 'October' | 'November'>('September');

  const currentData = MONTHLY_SALES_DATA[selectedMonth];

  // 🛡️ Safe Back Button Navigation
  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.push('/home'); // Fallback to Home if no back history exists
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={handleBack}>
          <Ionicons name="arrow-back" size={24} color="#4C1D95" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Sales Report</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Month Selector Tabs */}
      <View style={styles.tabContainer}>
        {(['September', 'October', 'November'] as const).map((month) => {
          const isSelected = selectedMonth === month;
          return (
            <TouchableOpacity
              key={month}
              style={[styles.tabBtn, isSelected && styles.tabBtnActive]}
              onPress={() => setSelectedMonth(month)}
            >
              <Text style={[styles.tabText, isSelected && styles.tabTextActive]}>
                {month}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {currentData.orders.length === 0 ? (
          /* 🚫 Empty State for October / November */
          <View style={styles.emptyContainer}>
            <Ionicons name="document-text-outline" size={64} color="#C4B5FD" />
            <Text style={styles.emptyTitle}>Empty</Text>
            <Text style={styles.emptySub}>No sales records found for this month.</Text>
          </View>
        ) : (
          /* ✅ September Sales Summary */
          <>
            {/* Summary Cards */}
            <View style={styles.summaryGrid}>
              <View style={styles.card}>
                <Ionicons name="cash-outline" size={24} color="#7C3AED" />
                <Text style={styles.cardLabel}>Total Revenue</Text>
                <Text style={styles.cardValue}>฿{currentData.totalAmount.toLocaleString()}</Text>
              </View>

              <View style={styles.card}>
                <Ionicons name="cube-outline" size={24} color="#7C3AED" />
                <Text style={styles.cardLabel}>Total Items Sold</Text>
                <Text style={styles.cardValue}>{currentData.totalItems} pcs</Text>
              </View>
            </View>

            {/* Best Seller Banner */}
            <View style={styles.topSellerCard}>
              <View style={styles.topSellerBadge}>
                <Ionicons name="trophy" size={20} color="#F59E0B" />
                <Text style={styles.topSellerBadgeText}>Best Seller Item</Text>
              </View>
              <Text style={styles.topSellerName}>{currentData.topSeller}</Text>
              <Text style={styles.topSellerSub}>
                {currentData.topSellerQty} units sold in {selectedMonth}
              </Text>
            </View>

            {/* Sales Orders List */}
            <View style={styles.sectionCard}>
              <Text style={styles.sectionTitle}>Monthly Sales Orders</Text>
              {currentData.orders.map((item) => (
                <View key={item.id} style={styles.orderRow}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.orderName}>{item.name}</Text>
                    <Text style={styles.orderDate}>{item.date} • {item.id}</Text>
                  </View>
                  <View style={{ alignItems: 'flex-end' }}>
                    <Text style={styles.orderQty}>x{item.qty} pcs</Text>
                    <Text style={styles.orderPrice}>฿{(item.qty * item.price).toLocaleString()}</Text>
                  </View>
                </View>
              ))}
            </View>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAF5FF' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F3E8FF',
  },
  backBtn: { padding: 4 },
  headerTitle: { fontSize: 16, fontWeight: '800', color: '#4C1D95' },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F3E8FF',
  },
  tabBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: '#FAF5FF',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E9D5FF',
  },
  tabBtnActive: {
    backgroundColor: '#7C3AED',
    borderColor: '#7C3AED',
  },
  tabText: { fontSize: 13, fontWeight: '700', color: '#6B7280' },
  tabTextActive: { color: '#FFFFFF' },
  scrollContent: { padding: 16 },
  emptyContainer: {
    paddingVertical: 80,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#4C1D95',
    marginTop: 12,
  },
  emptySub: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 4,
  },
  summaryGrid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 14,
  },
  card: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#F3E8FF',
  },
  cardLabel: { fontSize: 12, color: '#6B7280', marginTop: 8 },
  cardValue: { fontSize: 18, fontWeight: '800', color: '#3B0764', marginTop: 2 },
  topSellerCard: {
    backgroundColor: '#FEF3C7',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  topSellerBadge: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 6 },
  topSellerBadgeText: { fontSize: 12, fontWeight: '800', color: '#92400E' },
  topSellerName: { fontSize: 18, fontWeight: '800', color: '#78350F' },
  topSellerSub: { fontSize: 12, color: '#A16207', marginTop: 2 },
  sectionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#F3E8FF',
  },
  sectionTitle: { fontSize: 14, fontWeight: '700', color: '#4C1D95', marginBottom: 12 },
  orderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#FAF5FF',
  },
  orderName: { fontSize: 14, fontWeight: '700', color: '#3B0764' },
  orderDate: { fontSize: 11, color: '#9CA3AF', marginTop: 2 },
  orderQty: { fontSize: 12, color: '#6B7280' },
  orderPrice: { fontSize: 14, fontWeight: '700', color: '#7C3AED', marginTop: 2 },
});