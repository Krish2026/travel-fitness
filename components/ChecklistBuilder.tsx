import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Pressable,
  TextInput,
  Alert,
} from "react-native";
import { useState } from "react";
import { theme } from "@/theme";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { ChecklistItem } from "@/lib/types";

interface ChecklistBuilderProps {
  initialItems?: ChecklistItem[];
  onItemsChange: (items: ChecklistItem[]) => void;
  maxItems?: number;
}

export function ChecklistBuilder({
  initialItems = [],
  onItemsChange,
  maxItems = 20,
}: ChecklistBuilderProps) {
  const [items, setItems] = useState<ChecklistItem[]>(initialItems);
  const [newItemText, setNewItemText] = useState("");

  const addItem = () => {
    if (!newItemText.trim()) {
      Alert.alert("Empty Item", "Please enter a checklist item");
      return;
    }

    if (items.length >= maxItems) {
      Alert.alert(
        "Maximum Items",
        `You can only add up to ${maxItems} checklist items`,
      );
      return;
    }

    const newItem: ChecklistItem = {
      id: Date.now().toString(),
      text: newItemText.trim(),
      completed: false,
      order: items.length + 1,
    };

    const updatedItems = [...items, newItem];
    setItems(updatedItems);
    onItemsChange(updatedItems);
    setNewItemText("");
  };

  const deleteItem = (id: string) => {
    const updatedItems = items
      .filter((item) => item.id !== id)
      .map((item, idx) => ({
        ...item,
        order: idx + 1,
      }));
    setItems(updatedItems);
    onItemsChange(updatedItems);
  };

  const moveItem = (index: number, direction: "up" | "down") => {
    if (direction === "up" && index === 0) return;
    if (direction === "down" && index === items.length - 1) return;

    const newIndex = direction === "up" ? index - 1 : index + 1;
    const updatedItems = [...items];
    [updatedItems[index], updatedItems[newIndex]] = [
      updatedItems[newIndex],
      updatedItems[index],
    ];

    // Update order numbers
    updatedItems.forEach((item, idx) => {
      item.order = idx + 1;
    });

    setItems(updatedItems);
    onItemsChange(updatedItems);
  };

  const updateItemText = (id: string, newText: string) => {
    const updatedItems = items.map((item) =>
      item.id === id ? { ...item, text: newText } : item,
    );
    setItems(updatedItems);
    onItemsChange(updatedItems);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Lesson Checklist</Text>
        <Text style={styles.itemCount}>
          {items.length}/{maxItems}
        </Text>
      </View>

      {/* Input for new items */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Add a checklist item..."
          placeholderTextColor={theme.colors.textSecondary}
          value={newItemText}
          onChangeText={setNewItemText}
          onSubmitEditing={addItem}
          editable={items.length < maxItems}
        />
        <Pressable
          style={[
            styles.addButton,
            items.length >= maxItems && styles.addButtonDisabled,
          ]}
          onPress={addItem}
          disabled={items.length >= maxItems}
        >
          <MaterialIcons name="add" size={20} color="white" />
        </Pressable>
      </View>

      {/* Checklist items */}
      {items.length === 0 ? (
        <View style={styles.emptyState}>
          <MaterialIcons
            name="checklist"
            size={40}
            color={theme.colors.textSecondary}
          />
          <Text style={styles.emptyStateText}>
            No checklist items yet. Add one to get started!
          </Text>
        </View>
      ) : (
        <FlatList
          data={items}
          keyExtractor={(item) => item.id}
          scrollEnabled={false}
          renderItem={({ item, index }) => (
            <View style={styles.itemContainer}>
              <View style={styles.itemNumber}>
                <Text style={styles.itemNumberText}>{item.order}</Text>
              </View>

              <TextInput
                style={styles.itemText}
                placeholder="Checklist item"
                placeholderTextColor={theme.colors.textSecondary}
                value={item.text}
                onChangeText={(text) => updateItemText(item.id, text)}
              />

              <View style={styles.itemActions}>
                <Pressable
                  style={[
                    styles.actionButton,
                    index === 0 && styles.actionButtonDisabled,
                  ]}
                  onPress={() => moveItem(index, "up")}
                  disabled={index === 0}
                >
                  <MaterialIcons
                    name="arrow-upward"
                    size={16}
                    color={
                      index === 0
                        ? theme.colors.textSecondary
                        : theme.colors.primary
                    }
                  />
                </Pressable>

                <Pressable
                  style={[
                    styles.actionButton,
                    index === items.length - 1 && styles.actionButtonDisabled,
                  ]}
                  onPress={() => moveItem(index, "down")}
                  disabled={index === items.length - 1}
                >
                  <MaterialIcons
                    name="arrow-downward"
                    size={16}
                    color={
                      index === items.length - 1
                        ? theme.colors.textSecondary
                        : theme.colors.primary
                    }
                  />
                </Pressable>

                <Pressable
                  style={styles.deleteButton}
                  onPress={() => deleteItem(item.id)}
                >
                  <MaterialIcons name="delete" size={16} color="#FF5722" />
                </Pressable>
              </View>
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.spacing.md,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: theme.spacing.md,
  },
  title: {
    fontSize: 16,
    fontWeight: "700",
    color: theme.colors.text,
  },
  itemCount: {
    fontSize: 12,
    fontWeight: "600",
    color: theme.colors.textSecondary,
    backgroundColor: theme.colors.background,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: 2,
    borderRadius: theme.spacing.sm,
  },
  inputContainer: {
    flexDirection: "row",
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.md,
  },
  input: {
    flex: 1,
    backgroundColor: theme.colors.background,
    borderRadius: theme.spacing.md,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    fontSize: 14,
    color: theme.colors.text,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  addButton: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.spacing.md,
    padding: theme.spacing.sm,
    justifyContent: "center",
    alignItems: "center",
  },
  addButtonDisabled: {
    opacity: 0.5,
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: theme.spacing.lg,
  },
  emptyStateText: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.md,
    textAlign: "center",
  },
  itemContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.colors.background,
    borderRadius: theme.spacing.md,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
    gap: theme.spacing.md,
  },
  itemNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: theme.colors.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  itemNumberText: {
    fontSize: 12,
    fontWeight: "700",
    color: "white",
  },
  itemText: {
    flex: 1,
    fontSize: 14,
    color: theme.colors.text,
    padding: theme.spacing.sm,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.spacing.sm,
    paddingVertical: theme.spacing.sm,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  itemActions: {
    flexDirection: "row",
    gap: theme.spacing.xs,
  },
  actionButton: {
    padding: theme.spacing.sm,
    borderRadius: theme.spacing.md,
    backgroundColor: theme.colors.primary + "10",
  },
  actionButtonDisabled: {
    opacity: 0.3,
  },
  deleteButton: {
    padding: theme.spacing.sm,
    borderRadius: theme.spacing.md,
    backgroundColor: "#FF5722" + "10",
  },
});
