import { View, Text, Pressable, TextInput } from "react-native";
import { useState } from "react";
import { Search, X, Filter } from "lucide-react-native";
import { SessionType } from "../../types";
import { SessionFilters as SessionFiltersType } from "../../hooks/useSessions";

const SESSION_TYPES: { value: SessionType | "all"; label: string }[] = [
  { value: "all", label: "All" },
  { value: "gi", label: "Gi" },
  { value: "no-gi", label: "No-Gi" },
  { value: "open-mat", label: "Open Mat" },
  { value: "private", label: "Private" },
  { value: "competition-training", label: "Comp" },
  { value: "seminar", label: "Seminar" },
];

interface Props {
  filters: SessionFiltersType;
  onFiltersChange: (filters: SessionFiltersType) => void;
}

export function SessionFilters({ filters, onFiltersChange }: Props) {
  const [showFilters, setShowFilters] = useState(false);
  const [searchText, setSearchText] = useState(filters.searchText || "");

  const handleTypeChange = (type: SessionType | "all") => {
    onFiltersChange({
      ...filters,
      type: type === "all" ? undefined : type,
    });
  };

  const handleSearchSubmit = () => {
    onFiltersChange({
      ...filters,
      searchText: searchText || undefined,
    });
  };

  const clearSearch = () => {
    setSearchText("");
    onFiltersChange({
      ...filters,
      searchText: undefined,
    });
  };

  const hasActiveFilters = filters.type || filters.searchText;

  return (
    <View className="px-4 pt-4 pb-2">
      {/* Search Bar */}
      <View className="flex-row items-center gap-2 mb-3">
        <View className="flex-1 flex-row items-center bg-white border border-gray-200 rounded-xl px-3 py-2">
          <Search color="#9ca3af" size={20} />
          <TextInput
            value={searchText}
            onChangeText={setSearchText}
            onSubmitEditing={handleSearchSubmit}
            placeholder="Search sessions..."
            placeholderTextColor="#9ca3af"
            className="flex-1 ml-2 text-gray-900"
            returnKeyType="search"
          />
          {searchText.length > 0 && (
            <Pressable onPress={clearSearch}>
              <X color="#9ca3af" size={18} />
            </Pressable>
          )}
        </View>
        <Pressable
          onPress={() => setShowFilters(!showFilters)}
          className={`p-3 rounded-xl ${showFilters || hasActiveFilters ? "bg-primary-600" : "bg-white border border-gray-200"}`}
        >
          <Filter color={showFilters || hasActiveFilters ? "#ffffff" : "#6b7280"} size={20} />
        </Pressable>
      </View>

      {/* Filter Pills */}
      {showFilters && (
        <View className="flex-row flex-wrap gap-2">
          {SESSION_TYPES.map((item) => {
            const isActive = item.value === "all" ? !filters.type : filters.type === item.value;
            return (
              <Pressable
                key={item.value}
                onPress={() => handleTypeChange(item.value)}
                className={`px-3 py-1.5 rounded-full ${
                  isActive ? "bg-primary-600" : "bg-white border border-gray-200"
                }`}
              >
                <Text className={`text-sm font-medium ${isActive ? "text-white" : "text-gray-700"}`}>
                  {item.label}
                </Text>
              </Pressable>
            );
          })}
        </View>
      )}

      {/* Active Filter Indicator */}
      {hasActiveFilters && !showFilters && (
        <View className="flex-row items-center">
          <Text className="text-xs text-primary-600">
            Filters active: {filters.type || ""} {filters.searchText ? `"${filters.searchText}"` : ""}
          </Text>
          <Pressable
            onPress={() => onFiltersChange({})}
            className="ml-2"
          >
            <Text className="text-xs text-gray-500 underline">Clear</Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}
