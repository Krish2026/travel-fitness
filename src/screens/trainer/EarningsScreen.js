// Earnings Screen
// Track earnings and payments

import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, StyleSheet, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useAuthContext } from "../../hooks";

export default function EarningsScreen() {
  const [earnings, setEarnings] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuthContext();

  useEffect(() => {
    // TODO: Fetch earnings data from Firebase
    setLoading(false);
  }, [user?.uid]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3b82f6" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Total Earnings */}
      <View style={styles.earningsCard}>
        <Text style={styles.label}>Total Earnings</Text>
        <Text style={styles.totalEarnings}>$2,450.00</Text>
        <Text style={styles.subtitle}>Lifetime earnings on Travel Fitness</Text>
      </View>

      {/* Earnings Breakdown */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Earnings Breakdown</Text>
        <View style={styles.breakdown}>
          <View style={styles.breakdownItem}>
            <Ionicons name="cash" size={24} color="#10b981" />
            <View style={styles.breakdownContent}>
              <Text style={styles.breakdownLabel}>This Month</Text>
              <Text style={styles.breakdownValue}>$450.00</Text>
            </View>
          </View>
          <View style={styles.breakdownItem}>
            <Ionicons name="trending-up" size={24} color="#3b82f6" />
            <View style={styles.breakdownContent}>
              <Text style={styles.breakdownLabel}>Total Students</Text>
              <Text style={styles.breakdownValue}>156</Text>
            </View>
          </View>
          <View style={styles.breakdownItem}>
            <Ionicons name="bar-chart" size={24} color="#f59e0b" />
            <View style={styles.breakdownContent}>
              <Text style={styles.breakdownLabel}>Avg. Revenue/Course</Text>
              <Text style={styles.breakdownValue}>$612.50</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Payment History */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Payment History</Text>
        {[
          { date: "Mar 15, 2026", amount: "$150.00", status: "Paid" },
          { date: "Mar 1, 2026", amount: "$200.00", status: "Paid" },
          { date: "Feb 15, 2026", amount: "$100.00", status: "Paid" },
        ].map((payment, index) => (
          <View key={index} style={styles.paymentItem}>
            <View style={styles.paymentInfo}>
              <Text style={styles.paymentDate}>{payment.date}</Text>
              <Text style={[styles.paymentStatus, { color: "#10b981" }]}>
                {payment.status}
              </Text>
            </View>
            <Text style={styles.paymentAmount}>{payment.amount}</Text>
          </View>
        ))}
      </View>

      <View style={styles.spacer} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9fafb",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  earningsCard: {
    backgroundColor: "white",
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 20,
    padding: 24,
    borderRadius: 12,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  label: {
    fontSize: 14,
    color: "#6b7280",
    fontWeight: "600",
  },
  totalEarnings: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#10b981",
    marginTop: 8,
  },
  subtitle: {
    fontSize: 12,
    color: "#9ca3af",
    marginTop: 8,
  },
  section: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1f2937",
    marginBottom: 12,
  },
  breakdown: {
    gap: 12,
  },
  breakdownItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    padding: 12,
    borderRadius: 8,
    gap: 12,
  },
  breakdownContent: {
    flex: 1,
  },
  breakdownLabel: {
    fontSize: 12,
    color: "#6b7280",
  },
  breakdownValue: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1f2937",
    marginTop: 4,
  },
  paymentItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "white",
    padding: 12,
    marginBottom: 8,
    borderRadius: 8,
  },
  paymentInfo: {
    flex: 1,
  },
  paymentDate: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1f2937",
  },
  paymentStatus: {
    fontSize: 12,
    marginTop: 4,
    fontWeight: "600",
  },
  paymentAmount: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#10b981",
  },
  spacer: {
    height: 20,
  },
});
