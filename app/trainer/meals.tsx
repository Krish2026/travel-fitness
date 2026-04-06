import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Pressable,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useState, useEffect } from "react";
import { theme } from "@/theme";
import { useAuthStore } from "@/store/authStore";
import { db } from "@/lib/firebase";
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  query,
  where,
  Timestamp,
} from "firebase/firestore";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { MealCard, Meal } from "@/components/MealCard";
import { CreateMealModal } from "@/components/CreateMealModal";

export default function MealsScreen() {
  const { userId, user } = useAuthStore();
  const [meals, setMeals] = useState<Meal[]>([]);
  const [loading, setLoading] = useState(true);
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [creatingMeal, setCreatingMeal] = useState(false);

  useEffect(() => {
    loadMeals();
  }, [userId]);

  const loadMeals = async () => {
    if (!userId) return;

    try {
      setLoading(true);
      const mealsRef = collection(db, "meals");
      const q = query(mealsRef, where("trainerId", "==", userId));
      const snapshot = await getDocs(q);

      const mealsData: Meal[] = snapshot.docs.map(
        (doc) =>
          ({
            id: doc.id,
            ...doc.data(),
            createdAt:
              doc.data().createdAt?.toMillis?.() || doc.data().createdAt,
          }) as Meal,
      );

      setMeals(mealsData.sort((a, b) => b.createdAt - a.createdAt));
    } catch (error) {
      console.error("Error loading meals:", error);
      Alert.alert("Error", "Failed to load meals");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateMeal = async (mealData: {
    name: string;
    recipe: string;
    image?: string;
    cookingVideoUrl?: string;
    macros?: {
      protein: number;
      carbs: number;
      fat: number;
      calories: number;
    };
    tags?: string[];
  }) => {
    if (!userId) return;

    try {
      setCreatingMeal(true);
      const mealsRef = collection(db, "meals");

      await addDoc(mealsRef, {
        ...mealData,
        trainerId: userId,
        createdAt: Timestamp.now(),
      });

      await loadMeals();
      setCreateModalVisible(false);
      Alert.alert("Success", "Meal created successfully!");
    } catch (error) {
      console.error("Error creating meal:", error);
      throw error;
    } finally {
      setCreatingMeal(false);
    }
  };

  const handleDeleteMeal = async (mealId: string, mealName: string) => {
    Alert.alert(
      "Delete Meal?",
      `Are you sure you want to delete "${mealName}"?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              const mealRef = doc(db, "meals", mealId);
              await deleteDoc(mealRef);
              await loadMeals();
              Alert.alert("Success", "Meal deleted");
            } catch (error) {
              console.error("Error deleting meal:", error);
              Alert.alert("Error", "Failed to delete meal");
            }
          },
        },
      ],
    );
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Meal Plans</Text>
          <Text style={styles.subtitle}>
            {meals.length} {meals.length === 1 ? "meal" : "meals"}
          </Text>
        </View>
        <Pressable
          style={styles.addButton}
          onPress={() => setCreateModalVisible(true)}
        >
          <MaterialIcons name="add" size={24} color="white" />
        </Pressable>
      </View>

      {/* Meals List */}
      {meals.length === 0 ? (
        <View style={[styles.centerContent, styles.emptyState]}>
          <MaterialIcons
            name="restaurant-menu"
            size={48}
            color={theme.colors.textSecondary}
          />
          <Text style={styles.emptyStateText}>No meals yet</Text>
          <Text style={styles.emptyStateSubtext}>
            Create your first meal to share with clients
          </Text>
        </View>
      ) : (
        <FlatList
          data={meals}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <MealCard
              meal={item}
              isTrainerView
              onEdit={() => {
                // TODO: Implement edit functionality
                Alert.alert("Coming Soon", "Edit functionality coming soon");
              }}
              onDelete={() => handleDeleteMeal(item.id, item.name)}
              onPress={() => {
                // TODO: Implement meal detail view
              }}
            />
          )}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}

      {/* Create Meal Modal */}
      <CreateMealModal
        visible={createModalVisible}
        onClose={() => setCreateModalVisible(false)}
        onMealCreate={handleCreateMeal}
        isLoading={creatingMeal}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  centerContent: {
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.md,
    paddingTop: theme.spacing.lg,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: theme.colors.text,
  },
  subtitle: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    marginTop: 2,
  },
  addButton: {
    backgroundColor: theme.colors.primary,
    borderRadius: 24,
    width: 48,
    height: 48,
    justifyContent: "center",
    alignItems: "center",
  },
  listContent: {
    paddingHorizontal: theme.spacing.md,
    paddingBottom: theme.spacing.lg,
  },
  emptyState: {
    flex: 1,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: "700",
    color: theme.colors.text,
    marginTop: theme.spacing.md,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.sm,
    textAlign: "center",
    paddingHorizontal: theme.spacing.lg,
  },
});
