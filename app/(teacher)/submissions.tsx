import * as Linking from "expo-linking";
import { FileText } from "lucide-react-native";
import { useEffect, useState } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View
} from "react-native";
import { supabase } from "../../lib/supabase";

export default function Submissions() {
  const [assignments, setAssignments] = useState<any[]>([]);
  const [subs, setSubs] = useState<any[]>([]);

  useEffect(() => {
    supabase.from("assignments").select("*").then(r => setAssignments(r.data || []));
    supabase.from("submission_details").select("*").then(r => setSubs(r.data || []));
  }, []);

  async function openFile(url: string) {
    const viewer = `https://docs.google.com/gview?embedded=true&url=${encodeURIComponent(url)}`;
    await Linking.openURL(viewer);
  }

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: "#020617" }}
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.header}>Student Submissions</Text>

      {assignments.map(a => {
        const list = subs.filter(s => s.assignment_id === a.id);

        return (
          <View key={a.id} style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>{a.title}</Text>

              <View style={styles.badge}>
                <Text style={styles.badgeLabel}>Total</Text>
                <Text style={styles.badgeValue}>{list.length}</Text>
              </View>
            </View>

            {list.length === 0 && (
              <Text style={styles.empty}>No submissions yet</Text>
            )}

            {list.map(s => (
              <View key={s.id} style={styles.card}>
                <View>
                  <Text style={styles.studentName}>{s.full_name}</Text>
                  <Text style={styles.time}>
                    {new Date(s.submitted_at + "Z").toLocaleString()}
                  </Text>
                </View>

                <Pressable
                  onPress={() => openFile(s.file_url)}
                  style={({ pressed }) => [
                    styles.fileBtn,
                    pressed && styles.pressed
                  ]}
                >
                  <FileText size={20} color="#22C55E" />
                </Pressable>
              </View>
            ))}
          </View>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { paddingTop: 60, paddingHorizontal: 20, paddingBottom: 40 },
  header: { fontSize: 32, color: "#F8FAFC", fontWeight: "700", marginBottom: 26 },
  section: { marginBottom: 30 },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 14
  },
  sectionTitle: { fontSize: 20, color: "#38BDF8", fontWeight: "600" },
  badge: {
    backgroundColor: "#1E293B",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 18
  },
  badgeLabel: { color: "#94A3B8", fontSize: 10 },
  badgeValue: { color: "#F8FAFC", fontWeight: "600", fontSize: 14 },
  empty: { color: "#64748B", marginTop: 10 },
  card: {
    backgroundColor: "#0F172A",
    borderRadius: 16,
    padding: 16,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#1E293B",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
  studentName: { color: "#F8FAFC", fontWeight: "600", fontSize: 15 },
  time: { color: "#E5E7EB", fontSize: 14, fontWeight: "600", marginTop: 6 },
  fileBtn: {
    backgroundColor: "#020617",
    width: 42,
    height: 42,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center"
  },
  pressed: { transform: [{ scale: 0.92 }], opacity: 0.85 }
});
