import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  Alert,
  Image,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useOrder } from '../context/OrderContext';

// ตัวเลือกช่องทางการชำระเงิน
const PAYMENT_METHODS = [
  { id: 'PromptPay', label: 'PromptPay / QR Code', icon: 'qr-code-outline' },
  { id: 'CreditCard', label: 'Credit / Debit Card', icon: 'card-outline' },
  { id: 'COD', label: 'Cash on Delivery', icon: 'cash-outline' },
];

export default function CartScreen() {
  const router = useRouter();
  const { cartItems, updateQuantity, removeFromCart, clearCart } = useCart();
  const { addOrder } = useOrder();
  const { userProfile } = useAuth();

  // 📝 ข้อมูลการจัดส่ง (ดึงค่าเริ่มต้นจาก Profile ถ้ามี)
  const [name, setName] = useState(userProfile?.name || '');
  const [phone, setPhone] = useState(userProfile?.phone || '');
  const [address, setAddress] = useState(userProfile?.address || '');

  // 💳 ช่องทางการชำระเงินที่เลือก
  const [paymentMethod, setPaymentMethod] = useState('PromptPay');

  // คำนวณราคารวม
  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const shippingFee = cartItems.length > 0 ? 50 : 0;
  const grandTotal = subtotal + shippingFee;

  // 🛒 ฟังก์ชันทำการสั่งซื้อ (Checkout)
  const handleCheckout = () => {
    if (cartItems.length === 0) return;

    // ตรวจสอบการกรอกข้อมูลจัดส่ง
    if (!name.trim() || !phone.trim() || !address.trim()) {
      const msg = 'กรุณากรอกข้อมูลชื่อ เบอร์โทร และที่อยู่จัดส่งให้ครบถ้วน';
      if (Platform.OS === 'web') alert(msg);
      else Alert.alert('ข้อมูลไม่ครบถ้วน', msg);
      return;
    }

    // สร้าง Object คำสั่งซื้อใหม่
    const newOrder = {
      id: `ORD-${Date.now()}`,
      date: new Date().toLocaleDateString('th-TH', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
      items: [...cartItems],
      totalAmount: grandTotal,
      shippingFee,
      status: 'Pending',
      shippingInfo: {
        name,
        phone,
        address,
      },
      paymentMethod,
    };

    // 1. บันทึกลง OrderContext
    if (addOrder) {
      addOrder(newOrder);
    }

    // 2. เคลียร์ตะกร้าสินค้า
    clearCart();

    // 3. แจ้งเตือนและนำทางไปหน้า Order History
    const successMsg = `การสั่งซื้อสำเร็จ! รหัสคำสั่งซื้อ: ${newOrder.id}`;
    if (Platform.OS === 'web') {
      alert(successMsg);
      router.push('/order-history');
    } else {
      Alert.alert('สั่งซื้อสำเร็จ', successMsg, [
        { text: 'ดูประวัติการสั่งซื้อ', onPress: () => router.push('/order-history') },
      ]);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* 🟢 HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color="#4C1D95" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Shopping Cart</Text>
        <View style={{ width: 32 }} />
      </View>

      {cartItems.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="cart-outline" size={80} color="#D8B4FE" />
          <Text style={styles.emptyTitle}>Your cart is empty</Text>
          <Text style={styles.emptySubtitle}>
            Looks like you haven't added any items to your cart yet.
          </Text>

          <TouchableOpacity
            style={styles.continueShoppingBtn}
            onPress={() => router.push('/home')}
          >
            <Ionicons name="arrow-back-outline" size={18} color="#FFFFFF" />
            <Text style={styles.continueShoppingBtnText}>Continue Shopping</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView style={styles.flex1} contentContainerStyle={styles.scrollContent}>
          {/* 📦 รายการสินค้าในตะกร้า */}
          <Text style={styles.sectionTitle}>Cart Items ({cartItems.length})</Text>
          {cartItems.map((item) => (
            <View key={item.id} style={styles.cartCard}>
              <Image source={{ uri: item.image }} style={styles.itemImage} />
              <View style={styles.itemDetails}>
                <Text style={styles.itemName} numberOfLines={1}>
                  {item.name}
                </Text>
                <Text style={styles.itemPrice}>฿{item.price.toLocaleString()}</Text>

                <View style={styles.qtyContainer}>
                  <TouchableOpacity
                    style={styles.qtyBtn}
                    onPress={() => updateQuantity(item.id, item.quantity - 1)}
                  >
                    <Ionicons name="remove" size={16} color="#7C3AED" />
                  </TouchableOpacity>
                  <Text style={styles.qtyText}>{item.quantity}</Text>
                  <TouchableOpacity
                    style={styles.qtyBtn}
                    onPress={() => updateQuantity(item.id, item.quantity + 1)}
                  >
                    <Ionicons name="add" size={16} color="#7C3AED" />
                  </TouchableOpacity>
                </View>
              </View>

              <TouchableOpacity
                style={styles.deleteBtn}
                onPress={() => removeFromCart(item.id)}
              >
                <Ionicons name="trash-outline" size={20} color="#EF4444" />
              </TouchableOpacity>
            </View>
          ))}

          {/* 🚚 ฟอร์มข้อมูลการจัดส่ง */}
          <View style={styles.formSection}>
            <Text style={styles.sectionTitle}>Shipping Details</Text>

            <Text style={styles.inputLabel}>Receiver Name *</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. John Doe"
              value={name}
              onChangeText={setName}
            />

            <Text style={styles.inputLabel}>Phone Number *</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. 0812345678"
              keyboardType="phone-pad"
              value={phone}
              onChangeText={setPhone}
            />

            <Text style={styles.inputLabel}>Delivery Address *</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="House No., Street, City, Zipcode..."
              multiline
              numberOfLines={3}
              value={address}
              onChangeText={setAddress}
            />
          </View>

          {/* 💳 ช่องทางการชำระเงิน */}
          <View style={styles.paymentSection}>
            <Text style={styles.sectionTitle}>Payment Method</Text>
            {PAYMENT_METHODS.map((method) => {
              const isSelected = paymentMethod === method.id;
              return (
                <TouchableOpacity
                  key={method.id}
                  style={[
                    styles.paymentCard,
                    isSelected && styles.paymentCardSelected,
                  ]}
                  onPress={() => setPaymentMethod(method.id)}
                >
                  <Ionicons
                    name={method.icon as any}
                    size={22}
                    color={isSelected ? '#9933CC' : '#6B7280'}
                  />
                  <Text
                    style={[
                      styles.paymentLabel,
                      isSelected && styles.paymentLabelSelected,
                    ]}
                  >
                    {method.label}
                  </Text>
                  <Ionicons
                    name={
                      isSelected
                        ? 'radio-button-on-outline'
                        : 'radio-button-off-outline'
                    }
                    size={20}
                    color={isSelected ? '#9933CC' : '#9CA3AF'}
                  />
                </TouchableOpacity>
              );
            })}
          </View>

          {/* 📊 สรุปยอดเงิน */}
          <View style={styles.footerContainer}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Subtotal</Text>
              <Text style={styles.summaryValue}>฿{subtotal.toLocaleString()}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Shipping Fee</Text>
              <Text style={styles.summaryValue}>฿{shippingFee.toLocaleString()}</Text>
            </View>
            <View style={[styles.summaryRow, styles.totalRow]}>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.totalValue}>฿{grandTotal.toLocaleString()}</Text>
            </View>

            {/* ปุ่ม ชำระเงิน */}
            <TouchableOpacity style={styles.checkoutBtn} onPress={handleCheckout}>
              <Text style={styles.checkoutBtnText}>Place Order (฿{grandTotal.toLocaleString()})</Text>
              <Ionicons name="checkmark-circle-outline" size={20} color="#FFFFFF" />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.secondaryContinueBtn}
              onPress={() => router.push('/home')}
            >
              <Ionicons name="arrow-back-outline" size={16} color="#7C3AED" />
              <Text style={styles.secondaryContinueText}>Continue Shopping</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAF5FF' },
  flex1: { flex: 1 },
  scrollContent: { padding: 16, paddingBottom: 32 },
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
  emptyTitle: { fontSize: 20, fontWeight: '800', color: '#4C1D95', marginTop: 16 },
  emptySubtitle: { fontSize: 14, color: '#6B7280', textAlign: 'center', marginTop: 8, marginBottom: 24 },
  continueShoppingBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#9933CC',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  continueShoppingBtnText: { color: '#FFFFFF', fontWeight: '700', fontSize: 15 },
  sectionTitle: { fontSize: 16, fontWeight: '800', color: '#4C1D95', marginBottom: 12, marginTop: 8 },
  cartCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#F3E8FF',
    marginBottom: 10,
  },
  itemImage: { width: 64, height: 64, borderRadius: 10, backgroundColor: '#FAF5FF' },
  itemDetails: { flex: 1, marginLeft: 12 },
  itemName: { fontSize: 14, fontWeight: '700', color: '#3B0764' },
  itemPrice: { fontSize: 14, fontWeight: '800', color: '#9933CC', marginTop: 2 },
  qtyContainer: { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 6 },
  qtyBtn: {
    width: 24,
    height: 24,
    borderRadius: 6,
    backgroundColor: '#F3E8FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  qtyText: { fontSize: 13, fontWeight: '700', color: '#3B0764' },
  deleteBtn: { padding: 8 },
  formSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 16,
    marginVertical: 12,
    borderWidth: 1,
    borderColor: '#F3E8FF',
  },
  inputLabel: { fontSize: 12, fontWeight: '700', color: '#6B7280', marginTop: 8, marginBottom: 4 },
  input: {
    backgroundColor: '#FAF5FF',
    borderWidth: 1,
    borderColor: '#E9D5FF',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: '#3B0764',
  },
  textArea: { height: 70, textAlignVertical: 'top' },
  paymentSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#F3E8FF',
  },
  paymentCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FAF5FF',
    borderWidth: 1,
    borderColor: '#E9D5FF',
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
    gap: 12,
  },
  paymentCardSelected: {
    borderColor: '#9933CC',
    backgroundColor: '#F3E8FF',
  },
  paymentLabel: { flex: 1, fontSize: 14, fontWeight: '600', color: '#4B5563' },
  paymentLabelSelected: { color: '#9933CC', fontWeight: '800' },
  footerContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: '#F3E8FF',
  },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  summaryLabel: { fontSize: 14, color: '#6B7280' },
  summaryValue: { fontSize: 14, fontWeight: '700', color: '#3B0764' },
  totalRow: {
    marginTop: 4,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#F3E8FF',
    marginBottom: 16,
  },
  totalLabel: { fontSize: 16, fontWeight: '800', color: '#4C1D95' },
  totalValue: { fontSize: 18, fontWeight: '800', color: '#9933CC' },
  checkoutBtn: {
    backgroundColor: '#9933CC',
    height: 48,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    marginBottom: 10,
  },
  checkoutBtnText: { color: '#FFFFFF', fontSize: 15, fontWeight: '700' },
  secondaryContinueBtn: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 8,
  },
  secondaryContinueText: { color: '#7C3AED', fontSize: 14, fontWeight: '700' },
});