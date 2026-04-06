import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, Modal, ScrollView, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { COLORS, FONTS, SPACING, RADIUS } from '../constants/theme';
import { getDateKey } from '../utils/progress';

const PHOTOS_DIR = FileSystem.documentDirectory + 'progress_photos/';

export default function PhotoProgress() {
  const [photos, setPhotos] = useState([]);
  const [showCompare, setShowCompare] = useState(false);

  useEffect(() => {
    ensureDir();
    loadPhotos();
  }, []);

  const ensureDir = async () => {
    try {
      const info = await FileSystem.getInfoAsync(PHOTOS_DIR);
      if (!info.exists) {
        await FileSystem.makeDirectoryAsync(PHOTOS_DIR, { intermediates: true });
      }
    } catch {}
  };

  const loadPhotos = async () => {
    try {
      const stored = await AsyncStorage.getItem('progress_photos');
      if (stored) setPhotos(JSON.parse(stored));
    } catch {}
  };

  const takePhoto = async () => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission needed', 'Camera access is required to take progress photos.');
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        quality: 0.7,
        allowsEditing: true,
        aspect: [3, 4],
      });

      if (!result.canceled && result.assets[0]) {
        await savePhoto(result.assets[0].uri);
      }
    } catch (e) {
      // Try gallery instead
      pickFromGallery();
    }
  };

  const pickFromGallery = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission needed', 'Gallery access is required to pick photos.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        quality: 0.7,
        allowsEditing: true,
        aspect: [3, 4],
      });

      if (!result.canceled && result.assets[0]) {
        await savePhoto(result.assets[0].uri);
      }
    } catch {}
  };

  const savePhoto = async (uri) => {
    try {
      const filename = `photo_${Date.now()}.jpg`;
      const dest = PHOTOS_DIR + filename;
      await FileSystem.copyAsync({ from: uri, to: dest });

      const entry = {
        uri: dest,
        date: getDateKey(),
        timestamp: Date.now(),
      };

      const updated = [...photos, entry];
      setPhotos(updated);
      await AsyncStorage.setItem('progress_photos', JSON.stringify(updated));
    } catch (e) {
      console.warn('savePhoto error:', e);
    }
  };

  return (
    <View style={{
      backgroundColor: COLORS.surface,
      borderRadius: 20,
      borderWidth: 1,
      borderColor: COLORS.border,
      padding: 18,
      marginTop: SPACING.md,
    }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Ionicons name="camera-outline" size={20} color={COLORS.primary} />
          <Text style={{ color: COLORS.text, fontSize: 16, ...FONTS.bold, marginLeft: 8 }}>
            Progress Photos
          </Text>
        </View>
        <Text style={{ color: COLORS.textMuted, fontSize: 13, ...FONTS.medium }}>
          {photos.length} photo{photos.length !== 1 ? 's' : ''}
        </Text>
      </View>

      {/* Photo thumbnails */}
      {photos.length > 0 && (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 14 }}>
          {photos.slice(-6).map((photo, i) => (
            <View key={i} style={{ marginRight: 8 }}>
              <Image
                source={{ uri: photo.uri }}
                style={{ width: 72, height: 96, borderRadius: 10, backgroundColor: COLORS.surface2 }}
              />
              <Text style={{ color: COLORS.textFaint, fontSize: 9, ...FONTS.regular, textAlign: 'center', marginTop: 4 }}>
                {photo.date ? photo.date.slice(5) : ''}
              </Text>
            </View>
          ))}
        </ScrollView>
      )}

      {/* Buttons */}
      <View style={{ flexDirection: 'row', gap: 10 }}>
        <TouchableOpacity
          onPress={takePhoto}
          activeOpacity={0.7}
          style={{
            flex: 1,
            height: 42,
            borderRadius: 12,
            backgroundColor: COLORS.primary + '15',
            borderWidth: 1,
            borderColor: COLORS.primary + '30',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'row',
          }}
        >
          <Ionicons name="camera" size={16} color={COLORS.primary} />
          <Text style={{ color: COLORS.primary, fontSize: 13, ...FONTS.medium, marginLeft: 6 }}>
            Take Photo
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={pickFromGallery}
          activeOpacity={0.7}
          style={{
            flex: 1,
            height: 42,
            borderRadius: 12,
            backgroundColor: COLORS.surface2,
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'row',
          }}
        >
          <Ionicons name="images-outline" size={16} color={COLORS.textMuted} />
          <Text style={{ color: COLORS.textMuted, fontSize: 13, ...FONTS.medium, marginLeft: 6 }}>
            Gallery
          </Text>
        </TouchableOpacity>
      </View>

      {/* Compare button */}
      {photos.length >= 2 && (
        <TouchableOpacity
          onPress={() => setShowCompare(true)}
          activeOpacity={0.7}
          style={{
            marginTop: 10,
            height: 40,
            borderRadius: 10,
            backgroundColor: COLORS.surface2,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Text style={{ color: COLORS.textMuted, fontSize: 13, ...FONTS.medium }}>
            Compare First & Latest
          </Text>
        </TouchableOpacity>
      )}

      {/* Compare Modal */}
      {photos.length >= 2 && (
        <Modal visible={showCompare} transparent animationType="fade">
          <View style={{
            flex: 1,
            backgroundColor: 'rgba(0,0,0,0.9)',
            justifyContent: 'center',
            padding: SPACING.lg,
          }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: SPACING.md }}>
              <Text style={{ color: COLORS.text, fontSize: 20, ...FONTS.bold }}>Before & After</Text>
              <TouchableOpacity onPress={() => setShowCompare(false)}>
                <Ionicons name="close-circle" size={28} color={COLORS.textFaint} />
              </TouchableOpacity>
            </View>
            <View style={{ flexDirection: 'row', gap: 10 }}>
              <View style={{ flex: 1, alignItems: 'center' }}>
                <Image
                  source={{ uri: photos[0].uri }}
                  style={{ width: '100%', height: 320, borderRadius: 16, backgroundColor: COLORS.surface2 }}
                  resizeMode="cover"
                />
                <Text style={{ color: COLORS.textMuted, fontSize: 12, ...FONTS.medium, marginTop: 8 }}>
                  {photos[0].date}
                </Text>
              </View>
              <View style={{ flex: 1, alignItems: 'center' }}>
                <Image
                  source={{ uri: photos[photos.length - 1].uri }}
                  style={{ width: '100%', height: 320, borderRadius: 16, backgroundColor: COLORS.surface2 }}
                  resizeMode="cover"
                />
                <Text style={{ color: COLORS.textMuted, fontSize: 12, ...FONTS.medium, marginTop: 8 }}>
                  {photos[photos.length - 1].date}
                </Text>
              </View>
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
}
