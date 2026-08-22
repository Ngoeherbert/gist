import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  Modal,
  FlatList,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import COLORS from "../../constants/colors";

const COUNTRIES = [
  { name: "Cameroon", code: "CM", dialCode: "+237", flag: "🇨🇲" },
  { name: "Nigeria", code: "NG", dialCode: "+234", flag: "🇳🇬" },
  { name: "Ghana", code: "GH", dialCode: "+233", flag: "🇬🇭" },
  { name: "Kenya", code: "KE", dialCode: "+254", flag: "🇰🇪" },
  { name: "South Africa", code: "ZA", dialCode: "+27", flag: "🇿🇦" },
  { name: "United States", code: "US", dialCode: "+1", flag: "🇺🇸" },
  { name: "Canada", code: "CA", dialCode: "+1", flag: "🇨🇦" },
  { name: "United Kingdom", code: "GB", dialCode: "+44", flag: "🇬🇧" },
  { name: "France", code: "FR", dialCode: "+33", flag: "🇫🇷" },
  { name: "Germany", code: "DE", dialCode: "+49", flag: "🇩🇪" },
  { name: "Spain", code: "ES", dialCode: "+34", flag: "🇪🇸" },
  { name: "Italy", code: "IT", dialCode: "+39", flag: "🇮🇹" },
  { name: "India", code: "IN", dialCode: "+91", flag: "🇮🇳" },
  { name: "United Arab Emirates", code: "AE", dialCode: "+971", flag: "🇦🇪" },
  { name: "Australia", code: "AU", dialCode: "+61", flag: "🇦🇺" },
  { name: "Brazil", code: "BR", dialCode: "+55", flag: "🇧🇷" },
];

export default function PhoneInput({ value, onChangeText, onCountryChange }) {
  const [country, setCountry] = useState(COUNTRIES[0]);
  const [modalVisible, setModalVisible] = useState(false);
  const [search, setSearch] = useState("");

  const selectCountry = (selectedCountry) => {
    setCountry(selectedCountry);
    setModalVisible(false);
    setSearch("");

    onCountryChange?.(selectedCountry);
  };

  const filteredCountries = COUNTRIES.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <>
      <View style={styles.container}>
        <Pressable
          style={styles.countryButton}
          onPress={() => setModalVisible(true)}
        >
          <Text style={styles.flag}>{country.flag}</Text>

          <Text style={styles.dialCode}>{country.dialCode}</Text>

          <Ionicons
            name="chevron-down"
            size={14}
            color={COLORS.textSecondary}
          />
        </Pressable>

        <TextInput
          style={styles.input}
          placeholder="Phone number"
          placeholderTextColor={COLORS.textSecondary}
          value={value}
          onChangeText={(text) => {
            const cleaned = text.replace(/\D/g, "");
            onChangeText(cleaned);
          }}
          keyboardType="phone-pad"
          maxLength={15}
        />
      </View>

      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modal}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select country</Text>

              <Pressable onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={24} color={COLORS.text} />
              </Pressable>
            </View>

            <View style={styles.searchContainer}>
              <Ionicons name="search" size={18} color={COLORS.textSecondary} />

              <TextInput
                style={styles.searchInput}
                placeholder="Search countries..."
                placeholderTextColor={COLORS.textSecondary}
                value={search}
                onChangeText={setSearch}
              />
            </View>

            <FlatList
              data={filteredCountries}
              keyExtractor={(item) => item.code}
              keyboardShouldPersistTaps="handled"
              renderItem={({ item }) => (
                <Pressable
                  style={styles.countryRow}
                  onPress={() => selectCountry(item)}
                >
                  <Text style={styles.countryFlag}>{item.flag}</Text>

                  <View style={styles.countryInfo}>
                    <Text style={styles.countryName}>{item.name}</Text>

                    <Text style={styles.countryCode}>{item.dialCode}</Text>
                  </View>

                  {country.code === item.code && (
                    <Ionicons name="checkmark" size={20} color={COLORS.white} />
                  )}
                </Pressable>
              )}
            />
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 48,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 50,
    marginBottom: 12,
    overflow: "hidden",
  },

  countryButton: {
    height: "100%",
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: 14,
    paddingRight: 10,
    borderRightWidth: 1,
    borderRightColor: COLORS.border,
  },

  flag: {
    fontSize: 18,
    marginRight: 6,
  },

  dialCode: {
    color: COLORS.text,
    fontSize: 13,
    fontWeight: "600",
    marginRight: 5,
  },

  input: {
    flex: 1,
    height: "100%",
    color: COLORS.text,
    fontSize: 14,
    paddingHorizontal: 14,
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.75)",
    justifyContent: "flex-end",
  },

  modal: {
    height: "75%",
    backgroundColor: COLORS.background,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 20,
    paddingHorizontal: 20,
  },

  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 18,
  },

  modalTitle: {
    color: COLORS.text,
    fontSize: 20,
    fontWeight: "700",
  },

  searchContainer: {
    height: 46,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 50,
    paddingHorizontal: 14,
    marginBottom: 12,
  },

  searchInput: {
    flex: 1,
    color: COLORS.text,
    fontSize: 14,
    marginLeft: 8,
  },

  countryRow: {
    minHeight: 58,
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },

  countryFlag: {
    fontSize: 23,
    width: 40,
  },

  countryInfo: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    marginRight: 10,
  },

  countryName: {
    color: COLORS.text,
    fontSize: 14,
  },

  countryCode: {
    color: COLORS.textSecondary,
    fontSize: 14,
  },
});
