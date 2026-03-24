import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  Pressable,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useState, useEffect } from "react";
import { theme } from "@/theme";
import { useAuthStore } from "@/store/authStore";
import {
  sendMessage,
  getMessages,
  getTrainerSettings,
  getTrainerClients,
} from "@/lib/firebase";
import { db } from "@/lib/firebase";
import {
  collection,
  onSnapshot,
  query,
  where,
  orderBy,
} from "firebase/firestore";
import { Message } from "@/lib/types";

export default function CommunityScreen() {
  const { user } = useAuthStore();
  const isTrainer = user?.role === "trainer";

  const [messages, setMessages] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [messageText, setMessageText] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [chatEnabled, setChatEnabled] = useState(true);
  const [trainerChatEnabled, setTrainerChatEnabled] = useState(true);

  useEffect(() => {
    // Subscribe to realtime messages
    const q = query(
      collection(db, "messages"),
      where("conversationId", "==", "default"),
      orderBy("timestamp", "asc"),
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const messageList = snapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));
        setMessages(messageList);
        setIsLoading(false);
      },
      (error) => {
        console.error("Error fetching messages:", error);
        setIsLoading(false);
      },
    );

    return () => unsubscribe();
  }, []);

  // Load trainer's chat settings (for clients viewing chat)
  useEffect(() => {
    const getTrainerChat = async () => {
      try {
        // If user is trainer, fetch their own settings
        if (isTrainer && user?.id) {
          const settings = await getTrainerSettings(user.id);
          if (settings) {
            setTrainerChatEnabled(
              settings.isChatEnabled !== undefined
                ? settings.isChatEnabled
                : true,
            );
          }
        } else {
          // If user is client, we need to get their trainer's settings
          // For now, we'll assume chat is enabled unless proven otherwise
          setTrainerChatEnabled(true);
        }
      } catch (error) {
        console.error("Error loading trainer chat settings:", error);
        setTrainerChatEnabled(true);
      }
    };

    getTrainerChat();
  }, [isTrainer, user?.id]);

  const handleSendMessage = async () => {
    if (!messageText.trim()) return;

    // Check if chat is disabled by trainer
    if (!trainerChatEnabled) {
      Alert.alert("Chat Disabled", "The trainer has disabled community chat");
      return;
    }

    setIsSending(true);
    try {
      await sendMessage(user?.id || "", user?.name || "Anonymous", messageText);
      setMessageText("");
    } catch (error) {
      console.error("Error sending message:", error);
      Alert.alert("Error", "Failed to send message");
    } finally {
      setIsSending(false);
    }
  };

  const renderMessage = ({ item }: { item: any }) => {
    const isOwn = item.senderId === user?.id;

    return (
      <View
        style={[
          styles.messageRow,
          isOwn ? styles.ownMessageRow : styles.otherMessageRow,
        ]}
      >
        <View
          style={[
            styles.messageBubble,
            isOwn ? styles.ownBubble : styles.otherBubble,
          ]}
        >
          {!isOwn && <Text style={styles.senderName}>{item.senderName}</Text>}
          <Text
            style={[
              styles.messageText,
              isOwn ? styles.ownMessageText : styles.otherMessageText,
            ]}
          >
            {item.content}
          </Text>
          <Text
            style={[
              styles.timestamp,
              isOwn ? styles.ownTimestamp : styles.otherTimestamp,
            ]}
          >
            {new Date(item.timestamp).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </Text>
        </View>
      </View>
    );
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={100}
    >
      {/* Chat Disabled Notice */}
      {!trainerChatEnabled && (
        <View style={styles.disabledNotice}>
          <Text style={styles.disabledText}>
            💬 Community chat is currently disabled by the trainer
          </Text>
        </View>
      )}

      {/* Messages List */}
      <FlatList
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.messagesList}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>
              No messages yet. Start the conversation!
            </Text>
          </View>
        }
      />

      {/* Input Area */}
      <View style={styles.inputArea}>
        <View style={styles.inputRow}>
          <TextInput
            style={styles.input}
            placeholder={
              trainerChatEnabled ? "Type your message..." : "Chat is disabled"
            }
            placeholderTextColor={theme.colors.textSecondary}
            value={messageText}
            onChangeText={setMessageText}
            editable={!isSending && trainerChatEnabled}
            multiline
            numberOfLines={1}
            maxLength={500}
          />
          <Pressable
            style={({ pressed }) => [
              styles.sendButton,
              (!messageText.trim() || isSending || !trainerChatEnabled) &&
                styles.sendButtonDisabled,
              pressed && styles.pressed,
            ]}
            onPress={handleSendMessage}
            disabled={!messageText.trim() || isSending || !trainerChatEnabled}
          >
            {isSending ? (
              <ActivityIndicator size="small" color="white" />
            ) : (
              <Text style={styles.sendButtonText}>Send</Text>
            )}
          </Pressable>
        </View>
        <Text style={styles.charCount}>{messageText.length}/500</Text>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: theme.colors.background,
  },
  disabledNotice: {
    backgroundColor: theme.colors.warning + "20",
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.warning,
  },
  disabledText: {
    fontSize: 14,
    fontWeight: "600",
    color: theme.colors.warning,
    textAlign: "center",
  },
  messagesList: {
    flexGrow: 1,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
  },
  messageRow: {
    marginBottom: theme.spacing.md,
    flexDirection: "row",
  },
  ownMessageRow: {
    justifyContent: "flex-end",
  },
  otherMessageRow: {
    justifyContent: "flex-start",
  },
  messageBubble: {
    maxWidth: "80%",
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    borderRadius: theme.spacing.md,
  },
  ownBubble: {
    backgroundColor: theme.colors.primary,
    borderBottomRightRadius: 4,
  },
  otherBubble: {
    backgroundColor: theme.colors.surface,
    borderBottomLeftRadius: 4,
  },
  senderName: {
    fontSize: 12,
    fontWeight: "600",
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.xs,
  },
  messageText: {
    fontSize: 14,
    lineHeight: 20,
  },
  ownMessageText: {
    color: "white",
    fontWeight: "500",
  },
  otherMessageText: {
    color: theme.colors.text,
  },
  timestamp: {
    fontSize: 11,
    marginTop: theme.spacing.xs,
  },
  ownTimestamp: {
    color: "rgba(255, 255, 255, 0.7)",
  },
  otherTimestamp: {
    color: theme.colors.textSecondary,
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: theme.spacing.lg,
  },
  emptyStateText: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    textAlign: "center",
  },
  inputArea: {
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    backgroundColor: theme.colors.background,
  },
  inputRow: {
    flexDirection: "row",
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.xs,
  },
  input: {
    flex: 1,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.spacing.sm,
    borderWidth: 1,
    borderColor: theme.colors.border,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    fontSize: 14,
    color: theme.colors.text,
    maxHeight: 100,
  },
  sendButton: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.spacing.sm,
    paddingHorizontal: theme.spacing.lg,
    justifyContent: "center",
    alignItems: "center",
    minHeight: 44,
  },
  sendButtonDisabled: {
    opacity: 0.5,
  },
  sendButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "white",
  },
  charCount: {
    fontSize: 11,
    color: theme.colors.textSecondary,
    alignSelf: "flex-end",
  },
  pressed: {
    opacity: 0.8,
  },
});
