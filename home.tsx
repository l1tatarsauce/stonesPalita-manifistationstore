import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import {
  Alert,
  Image,
  Modal,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useProduct } from '../context/ProductContext';

// 🏷️ รายการหมวดหมู่หินมงคล
const CATEGORIES = [
  { id: 'All', label: 'All', icon: 'sparkles-outline' },
  { id: 'Luck', label: 'Luck & Wealth', icon: 'cash-outline' },
  { id: 'Love', label: 'Love & Passion', icon: 'heart-outline' },
  { id: 'Healing', label: 'Healing & Peace', icon: 'leaf-outline' },
  { id: 'Protection', label: 'Protection', icon: 'shield-checkmark-outline' },
];

export default function HomeScreen() {
  const { userProfile, isAdmin, logout } = useAuth();
  const { products } = useProduct();
  const { cartItems, addToCart } = useCart();

  // จำนวนประเภทสินค้าทั้งหมด
  const totalProductTypes = products ? products.length : 0;

  // จำนวนสินค้าในตะกร้าทั้งหมด
  const cartBadgeCount = cartItems?.reduce((sum: number, item: any) => sum + item.quantity, 0) || 0;

  // Search & Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Modals / Menu States
  const [isNavDrawerOpen, setIsNavDrawerOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isProductSummaryOpen, setIsProductSummaryOpen] = useState(false);

  // 🔍 Filter products (ค้นหาตามชื่อ + หมวดหมู่)
  const filteredProducts = (products || []).filter((item: any) => {
    const itemCategory = item?.category || 'Healing';
    const matchesSearch = item?.name?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || itemCategory === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // 📊 Calculate Inventory Summary (เฉพาะ Admin)
  const totalStockQty = (products || []).reduce(
    (sum: number, item: any) => sum + (item?.stock ?? 1),
    0
  );
  const totalInventoryValue = (products || []).reduce(
    (sum: number, item: any) => sum + (item?.price || 0) * (item?.stock ?? 1),
    0
  );

  // Help Center Handler
  const handleHelpCenter = () => {
    setIsProfileMenuOpen(false);
    if (Platform.OS === 'web') {
      alert('Help Center:\nNeed assistance? Contact us at support@crystalstore.com');
    } else {
      Alert.alert(
        'Help Center',
        'Need assistance? Contact our customer support team at support@crystalstore.com'
      );
    }
  };

  // Logout Handler
  const handleLogout = () => {
    setIsProfileMenuOpen(false);
    if (logout) logout();
    router.replace('/');
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* 🟢 TOP HEADER NAVBAR */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.iconBtn}
          onPress={() => setIsNavDrawerOpen(true)}
          activeOpacity={0.7}
        >
          <Ionicons name="menu-outline" size={28} color="#4C1D95" />
        </TouchableOpacity>

        <Text style={styles.brandTitle}>𝘾𝙖𝙩𝙚𝙧𝙖𝙖 𝙂𝙚𝙢𝙨𝙩𝙤𝙣𝙚 .𝙘𝙤</Text>

        {/* 🛒 กลุ่มปุ่มขวา: ตะกร้าสินค้า + โปรไฟล์ */}
        <View style={styles.headerRightGroup}>
          <TouchableOpacity
            style={styles.cartIconBtn}
            onPress={() => router.push('/cart')}
            activeOpacity={0.7}
          >
            <Ionicons name="cart-outline" size={26} color="#4C1D95" />
            {cartBadgeCount > 0 && (
              <View style={styles.badgeContainer}>
                <Text style={styles.badgeTextCount}>
                  {cartBadgeCount > 99 ? '99+' : cartBadgeCount}
                </Text>
              </View>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.iconBtn}
            onPress={() => setIsProfileMenuOpen(true)}
            activeOpacity={0.7}
          >
            {userProfile?.avatarUri ? (
              <Image source={{ uri: userProfile.avatarUri }} style={styles.avatarImg} />
            ) : (
              <Ionicons name="person-circle-outline" size={32} color="#7C3AED" />
            )}
          </TouchableOpacity>
        </View>
      </View>

      {/* 🟢 MAIN HOME CONTENT */}
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* 🔍 SEARCH BAR */}
        <View style={styles.searchContainer}>
          <Ionicons name="search-outline" size={20} color="#9CA3AF" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search products by name..."
            placeholderTextColor="#9CA3AF"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery ? (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={18} color="#9CA3AF" />
            </TouchableOpacity>
          ) : null}
        </View>

        {/* Hero Banner */}
        <View style={styles.heroBanner}>
          <Text style={styles.heroTag}>EXCLUSIVE COLLECTION</Text>
          <Text style={styles.heroTitle}>𝙋𝙧𝙚𝙢𝙞𝙪𝙢 𝙉𝙖𝙩𝙪𝙧𝙖𝙡 𝘾𝙧𝙮𝙨𝙩𝙖𝙡𝙨</Text>
          <Text style={styles.heroSubtitle}>
            𝐸𝓃𝒽𝒶𝓃𝒸𝑒 𝓎𝑜𝓊𝓇 𝓅𝑜𝓈𝒾𝓉𝒾𝓋𝑒 𝑒𝓃𝑒𝓇𝑔𝓎 𝓌𝒾𝓉𝒽 𝑜𝓊𝓇 𝒽𝒶𝓃𝒹𝒸𝓇𝒶𝒻𝓉𝑒𝒹 𝒸𝓇𝓎𝓈𝓉𝒶𝓁 𝓈𝑒𝓁𝑒𝒸𝓉𝒾𝑜𝓃..
          </Text>
          <TouchableOpacity
            style={styles.shopNowBtn}
            onPress={() => router.push('/products')}
          >
            <Text style={styles.shopNowText}>Explore Collection</Text>
            <Ionicons name="arrow-forward" size={16} color="#7C3AED" />
          </TouchableOpacity>
        </View>

        {/* 🏷️ CATEGORY CATALOG SLIDER */}
        <View style={styles.categorySection}>
          <Text style={styles.categorySectionTitle}>Crystals by Intent</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoryScroll}>
            {CATEGORIES.map((cat) => {
              const isSelected = selectedCategory === cat.id;
              return (
                <TouchableOpacity
                  key={cat.id}
                  style={[styles.categoryChip, isSelected && styles.categoryChipActive]}
                  onPress={() => setSelectedCategory(cat.id)}
                >
                  <Ionicons
                    name={cat.icon as any}
                    size={16}
                    color={isSelected ? '#FFFFFF' : '#9933CC'}
                  />
                  <Text style={[styles.categoryChipText, isSelected && styles.categoryChipTextActive]}>
                    {cat.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* Section Header */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>
            {searchQuery || selectedCategory !== 'All'
              ? `Results (${filteredProducts.length})`
              : 'Featured Products'}
          </Text>
          <TouchableOpacity onPress={() => router.push('/products')}>
            <Text style={styles.seeAllText}>See All</Text>
          </TouchableOpacity>
        </View>

        {/* Products Grid */}
        {filteredProducts.length > 0 ? (
          <View style={styles.productGrid}>
            {filteredProducts.map((item: any) => {
              const itemCategory = item?.category || 'Healing';
              return (
                <View key={item.id} style={styles.productCard}>
                  <View style={styles.imageContainer}>
                    <Image source={{ uri: item.image }} style={styles.productImg} />
                    <View style={styles.categoryTagBadge}>
                      <Text style={styles.categoryTagText}>{itemCategory}</Text>
                    </View>
                  </View>

                  <View style={styles.productInfo}>
                    <Text style={styles.productName} numberOfLines={1}>
                      {item.name}
                    </Text>
                    <Text style={styles.productPrice}>฿{(item.price || 0).toLocaleString()}</Text>
                    <TouchableOpacity
                      style={styles.addCartBtn}
                      onPress={() => addToCart(item)}
                    >
                      <Ionicons name="cart-outline" size={16} color="#FFFFFF" />
                      <Text style={styles.addCartText}>Add to Cart</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              );
            })}
          </View>
        ) : (
          <View style={styles.emptyContainer}>
            <Ionicons name="alert-circle-outline" size={40} color="#9CA3AF" />
            <Text style={styles.emptyText}>No products found for this filter</Text>
          </View>
        )}
      </ScrollView>

      {/* 🟢 NAVIGATION DRAWER MODAL */}
      <Modal
        visible={isNavDrawerOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setIsNavDrawerOpen(false)}
      >
        <TouchableWithoutFeedback onPress={() => setIsNavDrawerOpen(false)}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback>
              <View style={styles.drawerContainer}>
                <View style={styles.drawerHeader}>
                  <Text style={styles.drawerTitle}>𝙉𝙖𝙫𝙞𝙜𝙖𝙩𝙞𝙤𝙣</Text>
                  <TouchableOpacity onPress={() => setIsNavDrawerOpen(false)}>
                    <Ionicons name="close" size={24} color="#4C1D95" />
                  </TouchableOpacity>
                </View>

                <TouchableOpacity
                  style={styles.drawerItem}
                  onPress={() => {
                    setIsNavDrawerOpen(false);
                    router.push('/home');
                  }}
                >
                  <Ionicons name="home-outline" size={22} color="#7C3AED" />
                  <Text style={styles.drawerItemText}>Home</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.drawerItem}
                  onPress={() => {
                    setIsNavDrawerOpen(false);
                    if (isAdmin) {
                      setIsProductSummaryOpen(true);
                    } else {
                      router.push('/products');
                    }
                  }}
                >
                  <Ionicons name="cube-outline" size={22} color="#7C3AED" />
                  <View style={{ flex: 1 }}>
                    <Text style={styles.drawerItemText}>Products</Text>
                    {isAdmin && <Text style={styles.drawerItemSubText}>Summary & Stock</Text>}
                  </View>
                  {isAdmin && (
                    <View style={styles.badge}>
                      <Text style={styles.badgeText}>{totalProductTypes}</Text>
                    </View>
                  )}
                </TouchableOpacity>

                {isAdmin && (
                  <TouchableOpacity
                    style={styles.drawerItem}
                    onPress={() => {
                      setIsNavDrawerOpen(false);
                      router.push('/sales-report');
                    }}
                  >
                    <Ionicons name="trending-up-outline" size={22} color="#7C3AED" />
                    <Text style={styles.drawerItemText}>Weekly Sales</Text>
                  </TouchableOpacity>
                )}

                <TouchableOpacity
                  style={styles.drawerItem}
                  onPress={() => {
                    setIsNavDrawerOpen(false);
                    router.push('/stores');
                  }}
                >
                  <Ionicons name="location-outline" size={22} color="#7C3AED" />
                  <Text style={styles.drawerItemText}>Stores</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.drawerItem}
                  onPress={() => {
                    setIsNavDrawerOpen(false);
                    router.push('/profile');
                  }}
                >
                  <Ionicons name="settings-outline" size={22} color="#7C3AED" />
                  <Text style={styles.drawerItemText}>Settings</Text>
                </TouchableOpacity>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      {/* 🟢 PRODUCT SUMMARY POPUP MODAL (ADMIN ONLY) */}
      {isAdmin && (
        <Modal
          visible={isProductSummaryOpen}
          transparent
          animationType="fade"
          onRequestClose={() => setIsProductSummaryOpen(false)}
        >
          <TouchableWithoutFeedback onPress={() => setIsProductSummaryOpen(false)}>
            <View style={styles.modalOverlayCenter}>
              <TouchableWithoutFeedback>
                <View style={styles.summaryModalCard}>
                  <View style={styles.summaryModalHeader}>
                    <Ionicons name="cube-outline" size={32} color="#7C3AED" />
                    <Text style={styles.summaryModalTitle}>Inventory Summary</Text>
                  </View>

                  <View style={styles.statBox}>
                    <Text style={styles.statLabel}>Total Product Types</Text>
                    <Text style={styles.statValue}>{totalProductTypes} Items</Text>
                  </View>

                  <View style={styles.statBox}>
                    <Text style={styles.statLabel}>Total Stock Quantity</Text>
                    <Text style={styles.statValue}>{totalStockQty} Pieces</Text>
                  </View>

                  <View style={styles.statBox}>
                    <Text style={styles.statLabel}>Total Inventory Value</Text>
                    <Text style={styles.statValue}>฿{totalInventoryValue.toLocaleString()}</Text>
                  </View>

                  <TouchableOpacity
                    style={styles.primaryModalBtn}
                    onPress={() => {
                      setIsProductSummaryOpen(false);
                      router.push('/products');
                    }}
                  >
                    <Text style={styles.primaryModalBtnText}>View All Products</Text>
                    <Ionicons name="arrow-forward" size={16} color="#FFFFFF" />
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.secondaryModalBtn}
                    onPress={() => setIsProductSummaryOpen(false)}
                  >
                    <Text style={styles.secondaryModalBtnText}>Close</Text>
                  </TouchableOpacity>
                </View>
              </TouchableWithoutFeedback>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
      )}

      {/* 🟢 PROFILE MENU MODAL */}
      <Modal
        visible={isProfileMenuOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setIsProfileMenuOpen(false)}
      >
        <TouchableWithoutFeedback onPress={() => setIsProfileMenuOpen(false)}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback>
              <View style={styles.profileMenuContainer}>
                <View style={styles.profileMenuHeader}>
                  <Text style={styles.profileMenuName}>
                    {userProfile?.name || 'Guest User'}
                  </Text>
                  <Text style={styles.profileMenuRole}>
                    {isAdmin ? 'ADMINISTRATOR' : 'CUSTOMER'}
                  </Text>
                </View>

                <TouchableOpacity
                  style={styles.profileMenuItem}
                  onPress={() => {
                    setIsProfileMenuOpen(false);
                    router.push('/profile');
                  }}
                >
                  <Ionicons name="person-outline" size={20} color="#4C1D95" />
                  <Text style={styles.profileMenuItemText}>Profile Settings</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.profileMenuItem}
                  onPress={() => {
                    setIsProfileMenuOpen(false);
                    router.push('/order-history');
                  }}
                >
                  <Ionicons name="receipt-outline" size={20} color="#4C1D95" />
                  <Text style={styles.profileMenuItemText}>Order History</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.profileMenuItem}
                  onPress={handleHelpCenter}
                >
                  <Ionicons name="help-circle-outline" size={20} color="#4C1D95" />
                  <Text style={styles.profileMenuItemText}>Help Center</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.profileMenuItem, { borderTopWidth: 1, borderTopColor: '#F3E8FF', marginTop: 4, paddingTop: 10 }]}
                  onPress={handleLogout}
                >
                  <Ionicons name="log-out-outline" size={20} color="#EF4444" />
                  <Text style={[styles.profileMenuItemText, { color: '#EF4444' }]}>Log Out</Text>
                </TouchableOpacity>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
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
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F3E8FF',
    zIndex: 10,
  },
  brandTitle: { fontSize: 18, fontWeight: '800', color: '#4C1D95' },
  headerRightGroup: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  cartIconBtn: { position: 'relative', padding: 4 },
  badgeContainer: {
    position: 'absolute',
    top: -2,
    right: -4,
    backgroundColor: '#EF4444',
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  badgeTextCount: { color: '#FFFFFF', fontSize: 10, fontWeight: '800' },
  iconBtn: { padding: 4 },
  avatarImg: { width: 32, height: 32, borderRadius: 16, borderWidth: 1, borderColor: '#7C3AED' },
  scrollContent: { padding: 16 },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E9D5FF',
    borderRadius: 14,
    paddingHorizontal: 12,
    height: 46,
    marginBottom: 16,
  },
  searchIcon: { marginRight: 8 },
  searchInput: { flex: 1, fontSize: 14, color: '#3B0764' },
  heroBanner: {
    backgroundColor: '#9933CC',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
  },
  heroTag: { fontSize: 10, fontWeight: '800', color: '#E9D5FF', letterSpacing: 1, marginBottom: 4 },
  heroTitle: { fontSize: 22, fontWeight: '800', color: '#FFFFFF', marginBottom: 6 },
  heroSubtitle: { fontSize: 13, color: '#F3E8FF', lineHeight: 18, marginBottom: 16 },
  shopNowBtn: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  shopNowText: { color: '#9933CC', fontWeight: '700', fontSize: 13 },
  categorySection: { marginBottom: 20 },
  categorySectionTitle: { fontSize: 15, fontWeight: '800', color: '#3B0764', marginBottom: 10 },
  categoryScroll: { gap: 8 },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E9D5FF',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
  },
  categoryChipActive: {
    backgroundColor: '#9933CC',
    borderColor: '#9933CC',
  },
  categoryChipText: { fontSize: 13, fontWeight: '700', color: '#9933CC' },
  categoryChipTextActive: { color: '#FFFFFF' },

  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: { fontSize: 16, fontWeight: '800', color: '#9933CC' },
  seeAllText: { fontSize: 13, fontWeight: '700', color: '#9933CC' },
  productGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  productCard: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#F3E8FF',
    overflow: 'hidden',
  },
  imageContainer: { position: 'relative' },
  productImg: { width: '100%', height: 130, backgroundColor: '#FAF5FF' },
  categoryTagBadge: {
    position: 'absolute',
    bottom: 6,
    left: 6,
    backgroundColor: 'rgba(59, 7, 100, 0.75)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  categoryTagText: { fontSize: 10, fontWeight: '700', color: '#FFFFFF' },
  productInfo: { padding: 10 },
  productName: { fontSize: 14, fontWeight: '700', color: '#9933CC', marginBottom: 2 },
  productPrice: { fontSize: 13, fontWeight: '800', color: '#9933CC', marginBottom: 8 },
  addCartBtn: {
    backgroundColor: '#9933CC',
    paddingVertical: 6,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 4,
  },
  addCartText: { color: '#FFFFFF', fontSize: 11, fontWeight: '700' },
  emptyContainer: { alignItems: 'center', justifyContent: 'center', paddingVertical: 32 },
  emptyText: { fontSize: 13, color: '#6B7280', marginTop: 8 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)' },
  modalOverlayCenter: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  drawerContainer: {
    width: 270,
    height: '100%',
    backgroundColor: '#FFFFFF',
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  drawerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 16,
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3E8FF',
  },
  drawerTitle: { fontSize: 18, fontWeight: '800', color: '#9933CC' },
  drawerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    gap: 12,
  },
  drawerItemText: { fontSize: 15, fontWeight: '700', color: '#9933CC' },
  drawerItemSubText: { fontSize: 11, color: '#6B7280', marginTop: 2, fontWeight: '500' },
  badge: {
    backgroundColor: '#F3E8FF',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E9D5FF',
  },
  badgeText: { fontSize: 11, fontWeight: '800', color: '#9933CC' },
  summaryModalCard: {
    width: '100%',
    maxWidth: 340,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#9933CC',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
  },
  summaryModalHeader: { alignItems: 'center', marginBottom: 16 },
  summaryModalTitle: { fontSize: 18, fontWeight: '800', color: '#9933CC', marginTop: 6 },
  statBox: {
    width: '100%',
    backgroundColor: '#FAF5FF',
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#F3E8FF',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statLabel: { fontSize: 12, fontWeight: '600', color: '#6B7280' },
  statValue: { fontSize: 14, fontWeight: '800', color: '#9933CC' },
  primaryModalBtn: {
    width: '100%',
    backgroundColor: '#9933CC',
    height: 44,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    marginTop: 10,
  },
  primaryModalBtnText: { color: '#FFFFFF', fontWeight: '700', fontSize: 14 },
  secondaryModalBtn: {
    paddingVertical: 10,
    marginTop: 4,
  },
  secondaryModalBtnText: { color: '#6B7280', fontWeight: '600', fontSize: 13 },
  profileMenuContainer: {
    position: 'absolute',
    top: 50,
    right: 16,
    width: 220,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: '#F3E8FF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },
  profileMenuHeader: {
    paddingBottom: 10,
    marginBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F3E8FF',
  },
  profileMenuName: { fontSize: 14, fontWeight: '800', color: '#9933CC' },
  profileMenuRole: { fontSize: 10, fontWeight: '800', color: '#9933CC', marginTop: 2 },
  profileMenuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    gap: 10,
  },
  profileMenuItemText: { fontSize: 13, fontWeight: '600', color: '#4B5563' },
});