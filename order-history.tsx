import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import {
  FlatList,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useOrder } from '../context/OrderContext'; // 👈 แก้ชื่อ Hook

export default function OrderHistoryScreen() {
  const router = useRouter();
  const { orders } = useOrder();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color="#4C1D95" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Order History</Text>
        <View style={{ width: 32 }} />
      </View>

      {orders.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="receipt-outline" size={70} color="#D8B4FE" />
          <Text style={styles.emptyTitle}>No Order History</Text>
          <Text style={styles.emptySubtitle}>You haven't placed any orders yet.</Text>
          <TouchableOpacity
            style={styles.shopBtn}
            onPress={() => router.push('/home')}
          >
            <Text style={styles.shopBtnText}>Start Shopping</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={orders}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => (
            <View style={styles.orderCard}>
              <View style={styles.orderHeader}>
                <View>
                  <Text style={styles.orderId}>{item.id}</Text>
                  <Text style={styles.orderDate}>{item.date}</Text>
                </View>
                <View style={styles.statusBadge}>
                  <Text style={styles.statusText}>{item.status}</Text>
                </View>
              </View>

              <View style={styles.divider} />

              {item.items.map((prod, idx) => (
                <View key={idx} style={styles.itemRow}>
                  {prod.image && (
                    <Image source={{ uri: prod.image }} style={styles.itemImg} />
                  )}
                  <View style={{ flex: 1, marginLeft: prod.image ? 10 : 0 }}>
                    <Text style={styles.itemName} numberOfLines={1}>
                      {prod.name}
                    </Text>
                    <Text style={styles.itemSub}>
                      ฿{prod.price.toLocaleString()} x {prod.quantity}
                    </Text>
                  </View>
                </View>
              ))}

              <View style={styles.divider} />

              <View style={styles.orderFooter}>
                <Text style={styles.paymentMethodText}>
                  Payment: {item.paymentMethod}
                </Text>
                <Text style={styles.totalText}>
                  Total: ฿{item.totalAmount.toLocaleString()}
                </Text>
              </View>
            </View>
          )}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAF5FF' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F3E8FF',
  },
  backBtn: { padding: 4 },
  headerTitle: { fontSize: 18, fontWeight: '800', color: '#4C1D95' },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
  emptyTitle: { fontSize: 18, fontWeight: '800', color: '#4C1D95', marginTop: 16 },
  emptySubtitle: { fontSize: 13, color: '#6B7280', marginTop: 6, marginBottom: 20 },
  shopBtn: {
    backgroundColor: '#9933CC',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
  },
  shopBtnText: { color: '#FFFFFF', fontWeight: '700', fontSize: 14 },
  listContent: { padding: 16, gap: 12 },
  orderCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: '#F3E8FF',
  },
  orderHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  orderId: { fontSize: 14, fontWeight: '800', color: '#3B0764' },
  orderDate: { fontSize: 11, color: '#6B7280', marginTop: 2 },
  statusBadge: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusText: { fontSize: 11, fontWeight: '700', color: '#D97706' },
  divider: { height: 1, backgroundColor: '#F3E8FF', marginVertical: 10 },
  itemRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  itemImg: { width: 40, height: 40, borderRadius: 8, backgroundColor: '#FAF5FF' },
  itemName: { fontSize: 13, fontWeight: '700', color: '#3B0764' },
  itemSub: { fontSize: 12, color: '#7C3AED', marginTop: 2 },
  orderFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  paymentMethodText: { fontSize: 12, color: '#6B7280' },
  totalText: { fontSize: 15, fontWeight: '800', color: '#9933CC' },
});