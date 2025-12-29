import React, { useEffect, useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { supabase } from "../../lib/supabase";

export default function GradeStudents() {
  const [groups, setGroups] = useState<Record<string, any[]>>({});

  useEffect(() => {
    // Fetch from submission_details view
    supabase
      .from("submission_details")
      .select("*")
      .order("assignment_title")
      .then(({ data, error }) => {
        if (error) {
          console.error("Fetch error:", error);
          return;
        }
        
        const g: Record<string, any[]> = {};
        (data || []).forEach((s) => {
          if (!g[s.assignment_title]) g[s.assignment_title] = [];
          g[s.assignment_title].push(s);
        });
        setGroups(g);
      });
  }, []);

  async function saveMark(submissionId: string, value: string) {
    const marks = parseInt(value);
    
    // Check if input is empty or invalid
    if (value.trim() === "") return;
    if (isNaN(marks)) {
      Alert.alert("Invalid Input", "Please enter a valid number");
      return;
    }

    const { error } = await supabase
      .from("submissions")
      .update({ marks: marks }) 
      .eq("id", submissionId); // Ensure this matches the PRIMARY KEY of the submissions table

    if (error) {
      console.error("Update error:", error);
      Alert.alert("Error", "Could not save marks: " + error.message);
    } else {
      Alert.alert("Success", "Grade updated successfully!");
    }
  }

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: "#020617" }}
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.header}>Grade Students</Text>

      {Object.entries(groups).map(([title, subs]) => (
        <View key={title} style={styles.section}>
          <Text style={styles.sectionTitle}>{title}</Text>

          {subs.map((s) => (
            <View key={s.id} style={styles.card}>
              <Text style={styles.name}>{s.full_name}</Text>

              <TextInput
  placeholder="Marks"
  placeholderTextColor="#64748B"
  keyboardType="numeric"
  defaultValue={s.marks?.toString()}
  style={styles.input}
  // FIX: onEndEditing provides the 'text' property that TypeScript needs
  onEndEditing={(e) => saveMark(s.id, e.nativeEvent.text)}
/>
            </View>
          ))}
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 40
  },
  header: {
    fontSize: 32,
    color: "#F8FAFC",
    fontWeight: "700",
    marginBottom: 26
  },
  section: { marginBottom: 30 },
  sectionTitle: {
    color: "#38BDF8",
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 12
  },
  card: {
    backgroundColor: "#0F172A",
    borderRadius: 16,
    padding: 16,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#1E293B"
  },
  name: {
    color: "#F8FAFC",
    fontWeight: "600",
    fontSize: 15,
    marginBottom: 10
  },
  input: {
    backgroundColor: "#020617",
    color: "#F8FAFC",
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 14,
    fontSize: 15
  }
});