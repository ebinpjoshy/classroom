import * as Linking from "expo-linking";
import { ExternalLink } from "lucide-react-native";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const { data: assignmentsData } = await supabase.from("assignments").select("*");
        const { data: subsData } = await supabase.from("submission_details").select("*");
        
        setAssignments(assignmentsData || []);
        setSubs(subsData || []);
      } catch (error) {
        console.error("Fetch error:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  // FIXED: Direct linking is more reliable for Cloudinary PDFs than the Google Viewer
  async function openFile(url: string) {
    if (!url) return Alert.alert("Error", "No file URL found");
    
    try {
      // Direct link works better for mobile browsers to trigger their native PDF viewer
      await Linking.openURL(url);
    } catch (error) {
      Alert.alert("Error", "Could not open the PDF viewer.");
    }
  }

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', backgroundColor: "#020617" }]}>
        <ActivityIndicator size="large" color="#38BDF8" />
      </View>
    );
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
                <View style={{ flex: 1 }}>
                  <Text style={styles.studentName}>{s.full_name}</Text>
                  <Text style={styles.time}>
                    {new Date(s.submitted_at).toLocaleString([], { 
                      dateStyle: 'medium', 
                      timeStyle: 'short' 
                    })}
                  </Text>
                </View>

                <Pressable
                  onPress={() => openFile(s.file_url)}
                  style={({ pressed }) => [
                    styles.fileBtn,
                    pressed && styles.pressed
                  ]}
                >
                  <ExternalLink size={20} color="#22C55E" />
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
  container: { paddingTop: 60, paddingHorizontal: 20, paddingBottom: 40, flexGrow: 1 },
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
    borderRadius: 18,
    alignItems: 'center'
  },
  badgeLabel: { color: "#94A3B8", fontSize: 10, textTransform: 'uppercase' },
  badgeValue: { color: "#F8FAFC", fontWeight: "600", fontSize: 14 },
  empty: { color: "#64748B", marginTop: 10, fontStyle: 'italic' },
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
  studentName: { color: "#F8FAFC", fontWeight: "600", fontSize: 16 },
  time: { color: "#94A3B8", fontSize: 12, marginTop: 4 },
  fileBtn: {
    backgroundColor: "#16653420", // Light green background for the button
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#22C55E40"
  },
  pressed: { transform: [{ scale: 0.95 }], opacity: 0.7 }
});