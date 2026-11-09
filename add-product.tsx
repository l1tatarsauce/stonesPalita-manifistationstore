import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  Alert,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useProduct } from '../context/ProductContext';

// 🏷️ รายการหมวดหมู่ที่ตรงกับหน้า Home (id สำหรับ Filter / label สำหรับแสดงผล)
const CATEGORIES = [
  { id: 'Luck', label: 'Luck & Wealth', icon: 'cash-outline' },
  { id: 'Love', label: 'Love & Passion', icon: 'heart-outline' },
  { id: 'Healing', label: 'Healing & Peace', icon: 'leaf-outline' },
  { id: 'Protection', label: 'Protection', icon: 'shield-checkmark-outline' },
];

export default function AddOrEditProductScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ id?: string }>();
  const { products, addProduct, updateProduct } = useProduct();

  const isEditing = Boolean(params.id);

  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [image, setImage] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Healing');

  // 🛡️ ฟังก์ชันย้อนกลับแบบปลอดภัย ป้องกัน GO_BACK Error
  const safeGoBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/products');
    }
  };

  useEffect(() => {
    if (isEditing && params.id) {
      const existingProduct = products.find((p) => String(p.id) === String(params.id));
      if (existingProduct) {
        setName(existingProduct.name || '');
        setPrice(existingProduct.price ? existingProduct.price.toString() : '');
        setImage(existingProduct.image || '');
        setDescription(existingProduct.description || '');
        setCategory(existingProduct.category || 'Healing');
      }
    }
  }, [params.id, isEditing, products]);

  const handleSave = async () => {
    if (!name.trim() || !price.trim()) {
      const msg = 'กรุณากรอกชื่อสินค้าและราคา';
      if (Platform.OS === 'web') alert(msg);
      else Alert.alert('ข้อมูลไม่ครบถ้วน', msg);
      return;
    }

    const priceNum = parseFloat(price);
    if (isNaN(priceNum)) {
      const msg = 'ระบุราคาเป็นตัวเลขเท่านั้น';
      if (Platform.OS === 'web') alert(msg);
      else Alert.alert('ผิดพลาด', msg);
      return;
    }

    if (isEditing && params.id) {
      await updateProduct({
        id: params.id,
        name: name.trim(),
        price: priceNum,
        category: category,
        image: image.trim() || 'https://picsum.photos/200/200',
        description: description.trim(),
      });
      if (Platform.OS === 'web') alert('แก้ไขสินค้าเรียบร้อยแล้ว!');
    } else {
      await addProduct({
        name: name.trim(),
        price: priceNum,
        category: category,
        image: image.trim() || 'https://picsum.photos/200/200',
        description: description.trim(),
      });
      if (Platform.OS === 'web') alert('เพิ่มสินค้าเรียบร้อยแล้ว!');
    }

    safeGoBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={safeGoBack} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color="#4C1D95" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {isEditing ? 'Edit Product' : 'Add New Product'}
        </Text>
        <View style={{ width: 32 }} />
      </View>

      <ScrollView contentContainerStyle={styles.formContainer}>
        <Text style={styles.label}>Product Name *</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. Amethyst Crystal"
          value={name}
          onChangeText={setName}
        />

        {/* 🏷️ CATEGORY SELECTION */}
        <Text style={styles.label}>Category *</Text>
        <View style={styles.categoryContainer}>
          {CATEGORIES.map((cat) => {
            const isSelected = category === cat.id;
            return (
              <TouchableOpacity
                key={cat.id}
                style={[styles.categoryChip, isSelected && styles.categoryChipActive]}
                onPress={() => setCategory(cat.id)}
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
        </View>

        <Text style={styles.label}>Price (฿) *</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. 590"
          keyboardType="numeric"
          value={price}
          onChangeText={setPrice}
        />

        <Text style={styles.label}>Image URL</Text>
        <TextInput
          style={styles.input}
          placeholder="https://example.com/image.png"
          value={image}
          onChangeText={setImage}
        />

        <Text style={styles.label}>Description</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Enter product description..."
          multiline
          numberOfLines={4}
          value={description}
          onChangeText={setDescription}
        />

        <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
          <Ionicons name="save-outline" size={20} color="#FFFFFF" />
          <Text style={styles.saveBtnText}>
            {isEditing ? 'Update Product' : 'Save Product'}
          </Text>
        </TouchableOpacity>
      </ScrollView>
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
  formContainer: { padding: 20 },
  label: { fontSize: 13, fontWeight: '700', color: '#6B7280', marginTop: 12, marginBottom: 6 },
  input: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E9D5FF',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: '#3B0764',
  },
  categoryContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 4,
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E9D5FF',
  },
  categoryChipActive: {
    backgroundColor: '#9933CC',
    borderColor: '#9933CC',
  },
  categoryChipText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#9933CC',
  },
  categoryChipTextActive: {
    color: '#FFFFFF',
  },
  textArea: { height: 100, textAlignVertical: 'top' },
  saveBtn: {
    backgroundColor: '#9933CC',
    height: 50,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    marginTop: 28,
  },
  saveBtnText: { color: '#FFFFFF', fontSize: 16, fontWeight: '700' },
});