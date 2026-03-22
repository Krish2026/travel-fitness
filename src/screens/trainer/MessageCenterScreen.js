// Trainer Message Center Screen
// Messages with students

import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useAuthContext } from "../../hooks";

export default function MessageCenterScreen({ navigation }) {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuthContext();

  useEffect(() => {
    // TODO: Fetch conversations from Firebase
    setLoading(false);
  }, [user?.uid]);

  const renderConversation = ({ item }) => (
    <TouchableOpacity style={styles.conversationCard}>
      <View style={styles.avatarContainer}>
        <Ionicons name="person-circle" size={48} color="#3b82f6" />
      </View>
      <View style={styles.conversationContent}>
        <Text style={styles.studentName}>{item.studentName}</Text>
        <Text style={`styles.lastMessage`} numberOfLines={1}>
          {item.lastMessage}
        </Text>
        <Text style={styles.timestamp}>{item.timestamp}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {loading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#3b82f6" />
        </View>
      ) : conversations.length > 0 ? (
        <FlatList
          data={conversations}
          renderItem={renderConversation}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Ionicons name="chatbubble" size={64} color="#d1d5db" />
          <Text style={styles.emptyTitle}>No Messages</Text>
          <Text style={styles.emptyText}>
            Messages from students will appear here
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9fafb",
  },
  listContent: {
    padding: 0,
  },
  conversationCard: {
    flexDirection: "row",
    backgroundColor: "white",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
    gap: 12,
  },
  avatarContainer: {
    position: "relative",
  },
  conversationContent: {
    flex: 1,
    justifyContent: "center",
  },
  studentName: {
    fontSize: 15,
    fontWeight: "600",
    color: "#1f2937",
  },
  lastMessage: {
    fontSize: 13,
    color: "#6b7280",
    marginTop: 4,
  },
  timestamp: {
    fontSize: 11,
    color: "#9ca3af",
    marginTop: 4,
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#6b7280",
    marginTop: 16,
  },
  emptyText: {
    fontSize: 14,
    color: "#9ca3af",
    marginTop: 8,
    textAlign: "center",
  },
});
