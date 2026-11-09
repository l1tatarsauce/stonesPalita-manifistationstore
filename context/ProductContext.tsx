import React, { createContext, useContext, useEffect, useState } from 'react';
import { Alert } from 'react-native';

const API_BASE_URL = 'http://119.59.102.161:3088/api';

export interface Product {
  id: string;
  name: string;
  price: number;
  stock?: number;
  category?: string;
  description?: string;
  image?: string;
}

interface ProductContextType {
  products: Product[];
  loading: boolean;
  fetchProducts: () => Promise<void>;
  addProduct: (product: Omit<Product, 'id'>) => Promise<void>;
  updateProduct: (product: Product) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export const ProductProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  // 1️⃣ ดึงข้อมูลสินค้าจาก API
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/products`);
      const data = await response.json();
      if (Array.isArray(data)) {
        setProducts(data);
      } else {
        setProducts([]);
      }
    } catch (error) {
      console.error('Fetch products error:', error);
    } finally {
      setLoading(false);
    }
  };

  // 2️⃣ เพิ่มสินค้าใหม่
  const addProduct = async (productData: Omit<Product, 'id'>) => {
    try {
      const response = await fetch(`${API_BASE_URL}/products`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData),
      });
      if (response.ok) {
        await fetchProducts();
      }
    } catch (error) {
      Alert.alert('Error', 'ไม่สามารถเพิ่มสินค้าลงฐานข้อมูลได้');
    }
  };

  // 3️⃣ ✏️ แก้ไขข้อมูลสินค้า (เพิ่มฟังก์ชันนี้)
  const updateProduct = async (productData: Product) => {
    try {
      const response = await fetch(`${API_BASE_URL}/products/${productData.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData),
      });
      if (response.ok) {
        await fetchProducts();
      } else {
        Alert.alert('Error', 'ไม่สามารถแก้ไขข้อมูลสินค้าได้');
      }
    } catch (error) {
      Alert.alert('Error', 'เกิดข้อผิดพลาดในการแก้ไขสินค้า');
    }
  };

  // 4️⃣ ลบสินค้า
  const deleteProduct = async (id: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/products/${id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        setProducts((prev) => prev.filter((item) => String(item.id) !== String(id)));
      } else {
        Alert.alert('Error', 'ไม่สามารถลบสินค้าได้');
      }
    } catch (error) {
      Alert.alert('Error', 'เกิดข้อผิดพลาดในการลบสินค้า');
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <ProductContext.Provider
      value={{
        products,
        loading,
        fetchProducts,
        addProduct,
        updateProduct,
        deleteProduct,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};

export const useProduct = () => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error('useProduct must be used within a ProductProvider');
  }
  return context;
};