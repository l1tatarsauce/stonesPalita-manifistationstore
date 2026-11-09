import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import {
    Image,
    Linking,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

export default function StoresScreen() {
  const router = useRouter();

  const stores = [
    {
      id: '1',
      name: 'Canal Street Branch',
      address: 'Canal Street, Manchester, UK',
      mapUrl: 'https://maps.app.goo.gl/V2X5JPp2rNzFpopDA',
      hours: '10:00 AM - 10:00 PM',
      phone: '+44 161 123 4567',
      image: 'https://i.pinimg.com/1200x/f8/1a/cb/f81acbc1eea7f8dd15ae9df13303809f.jpg',
    },
    {
      id: '2',
      name: 'Oxford Road Branch',
      address: 'Oxford Road, Manchester, UK',
      mapUrl: 'https://maps.app.goo.gl/AKpALDLhgkrbYyRh9',
      hours: '10:00 AM - 10:00 PM',
      phone: '+44 161 234 5678',
      image: 'https://i.pinimg.com/736x/32/56/8d/32568d37eab6a766270f3aa93f341396.jpg',
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      {/* Header Bar */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#4C1D95" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Store Locations</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.sectionTitle}>Our UK Branches</Text>

        {stores.map((store) => (
          <View key={store.id} style={styles.card}>
            <Image source={{ uri: store.image }} style={styles.storeImage} />

            <View style={styles.cardHeader}>
              <Ionicons name="location" size={22} color="#8B5CF6" />
              <Text style={styles.storeName}>{store.name}</Text>
            </View>

            <Text style={styles.infoText}>{store.address}</Text>

            <View style={styles.infoRow}>
              <Ionicons name="time-outline" size={16} color="#6B7280" />
              <Text style={styles.subText}>{store.hours}</Text>
            </View>

            <View style={styles.infoRow}>
              <Ionicons name="call-outline" size={16} color="#6B7280" />
              <Text style={styles.subText}>{store.phone}</Text>
            </View>

            {/* Action Buttons */}
            <View style={styles.buttonGroup}>
              <TouchableOpacity
                style={styles.mapBtn}
                onPress={() => Linking.openURL(store.mapUrl)}
              >
                <Ionicons name="map-outline" size={16} color="#8B5CF6" />
                <Text style={styles.mapBtnText}>View Location</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.callBtn}
                onPress={() => Linking.openURL(`tel:${store.phone}`)}
              >
                <Ionicons name="call" size={16} color="#FFFFFF" />
                <Text style={styles.callBtnText}>Call Store</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
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
  headerTitle: { fontSize: 18, fontWeight: '800', color: '#4C1D95' },
  backBtn: { width: 40, height: 40, justifyContent: 'center', alignItems: 'center' },
  content: { padding: 16 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: '#4C1D95', marginBottom: 16 },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#F3E8FF',
  },
  storeImage: {
    width: '100%',
    height: 180,
    borderRadius: 12,
    marginBottom: 14,
  },
  cardHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 },
  storeName: { fontSize: 16, fontWeight: '700', color: '#3B0764' },
  infoText: { fontSize: 13, color: '#4B5563', marginBottom: 8 },
  infoRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 4 },
  subText: { fontSize: 12, color: '#6B7280' },
  buttonGroup: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 14,
  },
  mapBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#F3E8FF',
    borderWidth: 1,
    borderColor: '#E9D5FF',
    borderRadius: 10,
    paddingVertical: 10,
  },
  mapBtnText: { color: '#8B5CF6', fontSize: 14, fontWeight: '600' },
  callBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#8B5CF6',
    borderRadius: 10,
    paddingVertical: 10,
  },
  callBtnText: { color: '#FFFFFF', fontSize: 14, fontWeight: '600' },
});