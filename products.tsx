import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  Alert,
  FlatList,
  Image,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import { Product, useProduct } from '../context/ProductContext';

export default function ProductsScreen() {
  const router = useRouter();
  const { products, loading, deleteProduct } = useProduct();
  const authContext = useAuth();
  
  // 👑 เช็คสิทธิ์ Admin (หากไม่มีใน AuthContext ให้เปิดเป็น true ไว้ก่อน)
  const isAdmin = authContext?.isAdmin ?? authContext?.user?.role === 'admin' ?? true;

  const [searchQuery, setSearchQuery] = useState('');

  // 🛡️ ฟังก์ชันย้อนกลับแบบปลอดภัย ป้องกัน GO_BACK Error
  const safeGoBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/');
    }
  };

  // 🗑️ ฟังก์ชันยืนยันการลบสินค้า
  const handleDelete = (id: string, name: string) => {
    const confirmMessage = `คุณต้องการลบ "${name}" ออกจากระบบใช่หรือไม่?`;
    if (Platform.OS === 'web') {
      if (confirm(confirmMessage)) {
        deleteProduct(id);
      }
    } else {
      Alert.alert('ยืนยันการลบ', confirmMessage, [
        { text: 'ยกเลิก', style: 'cancel' },
        { text: 'ลบข้อมูล', style: 'destructive', onPress: () => deleteProduct(id) },
      ]);
    }
  };

  // 🔍 กรองสินค้าตามช่องค้นหา
  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderProductItem = ({ item }: { item: Product }) => (
    <View style={styles.card}>
      <Image
        source={{ uri: item.image || 'https://picsum.photos/200/200' }}
        style={styles.cardImage}
      />
      <View style={styles.cardInfo}>
        <Text style={styles.cardTitle} numberOfLines={1}>{item.name}</Text>
        <Text style={styles.cardCategory}>{item.category || 'Healing'}</Text>
        <Text style={styles.cardPrice}>฿{item.price || 0}</Text>
      </View>

      {/* 👑 ปุ่มสำหรับ Admin เท่านั้น (Edit / Delete) */}
      {isAdmin && (
        <View style={styles.adminActions}>
          <TouchableOpacity
            style={[styles.actionBtn, styles.editBtn]}
            onPress={() => router.push({ pathname: '/add-product', params: { id: item.id } })}
          >
            <Ionicons name="pencil" size={18} color="#FFFFFF" />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionBtn, styles.deleteBtn]}
            onPress={() => handleDelete(String(item.id), item.name)}
          >
            <Ionicons name="trash" size={18} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={safeGoBack} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color="#4C1D95" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {isAdmin ? 'Manage Products (Admin)' : 'Products'}
        </Text>
        <View style={{ width: 32 }} />
      </View>

      {/* SEARCH BAR */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#9CA3AF" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search products..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* PRODUCT LIST */}
      <FlatList
        data={filteredProducts}
        keyExtractor={(item) => String(item.id)}
        renderItem={renderProductItem}
        contentContainerStyle={styles.listContainer}
        refreshing={loading}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>ไม่พบรายการสินค้า</Text>
          </View>
        }
      />

      {/* ➕ ปุ่มเพิ่มสินค้าใหม่สำหรับ Admin (Floating Button) */}
      {isAdmin && (
        <TouchableOpacity
          style={styles.fab}
          onPress={() => router.push('/add-product')}
        >
          <Ionicons name="add" size={30} color="#FFFFFF" />
        </TouchableOpacity>
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
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginTop: 12,
    borderRadius: 12,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#E9D5FF',
  },
  searchIcon: { marginRight: 8 },
  searchInput: { flex: 1, height: 44, fontSize: 15, color: '#3B0764' },
  listContainer: { padding: 16, paddingBottom: 80 },
  card: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 12,
    marginBottom: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#F3E8FF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  cardImage: { width: 70, height: 70, borderRadius: 12, backgroundColor: '#F3E8FF' },
  cardInfo: { flex: 1, marginLeft: 12 },
  cardTitle: { fontSize: 16, fontWeight: '700', color: '#3B0764' },
  cardCategory: { fontSize: 12, color: '#9933CC', marginTop: 2, fontWeight: '600' },
  cardPrice: { fontSize: 16, fontWeight: '800', color: '#4C1D95', marginTop: 4 },
  adminActions: { flexDirection: 'row', gap: 8, marginLeft: 8 },
  actionBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  editBtn: { backgroundColor: '#9933CC' },
  deleteBtn: { backgroundColor: '#EF4444' },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 24,
    backgroundColor: '#9933CC',
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
  },
  emptyContainer: { alignItems: 'center', marginTop: 40 },
  emptyText: { fontSize: 15, color: '#9CA3AF' },
});