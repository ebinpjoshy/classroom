import * as Linking from "expo-linking";
import { useRouter } from "expo-router";
import { Award } from "lucide-react-native";
import { useEffect, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { supabase } from "../../lib/supabase";

export default function StudentDashboard() {
  const router = useRouter();
  const [assignments, setAssignments] = useState<any[]>([]);
  const [submitted, setSubmitted] = useState<string[]>([]);

  useEffect(() => {
  supabase
    .from("assignments")
    .select("*")
    .then((res) => setAssignments(res.data || []));

  supabase.auth.getUser().then(({ data }) => {
    if (!data.user) return;

    supabase
      .from("submissions")
      .select("assignment_id")
      .eq("student_id", data.user.id)
      .then((res) =>
        setSubmitted(res.data?.map(x => x.assignment_id) || [])
      );
  });
}, []);


  return (
  <ScrollView 
  
  style={{ backgroundColor: COLORS.bg }}
  contentContainerStyle={styles.container}
  showsVerticalScrollIndicator={false}
>

    <Text style={styles.header}>My Assignments</Text>
<Pressable
  style={styles.marksBtn}
  onPress={() => router.push("/(student)/marks")}
>
  <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center", gap: 8 }}>
    <Award size={18} color="#5EEAD4" />
    <Text style={styles.marksText}>View My Marks</Text>
  </View>
</Pressable>


    {assignments.map((a) => (
      <View key={a.id} style={styles.card}>
        <Text style={styles.title}>{a.title}</Text>
        <Text style={styles.deadline}>Deadline: {a.deadline}</Text>

        {a.file_url && (
          <Text
            style={styles.file}
            onPress={() => Linking.openURL(a.file_url)}
          >
            📎 Open File
          </Text>
        )}

        {submitted.includes(a.id) ? (
  <Pressable
    style={[styles.submitBtn, { backgroundColor: "#334155" }]}
    onPress={() => router.push(`/(student)/submit?id=${a.id}`)}
  >
    <Text style={styles.submitText}>Resubmit Answer</Text>
  </Pressable>
) : (
  <Pressable
    style={styles.submitBtn}
    onPress={() => router.push(`/(student)/submit?id=${a.id}`)}
  >
    <Text style={styles.submitText}>Submit Answer</Text>
  </Pressable>
)}

      </View>
    ))}
  </ScrollView>
);

}
const COLORS = {
  bg: "#020617",
  card: "#0F172A",
  text: "#F8FAFC",
  muted: "#94A3B8",
  accent: "#22C55E",
  link: "#38BDF8"
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.bg,
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 30,
    flexGrow: 1
  },

  header: {
    fontSize: 32,
    color: COLORS.text,
    fontWeight: "700",
    marginBottom: 26
  },

  marksBtn: {
    backgroundColor: "#134E4A",
    paddingVertical: 14,
    borderRadius: 16,
    marginBottom: 24
  },

  marksText: {
    color: "#5EEAD4",
    textAlign: "center",
    fontWeight: "600",
    fontSize: 15
  },

  card: {
    backgroundColor: COLORS.card,
    borderRadius: 22,
    padding: 22,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: "#1E293B"
  },

  title: {
    fontSize: 19,
    color: COLORS.text,
    fontWeight: "600"
  },

  deadline: {
    color: COLORS.muted,
    marginTop: 6,
    fontSize: 13
  },

  file: {
    color: COLORS.link,
    marginTop: 8,
    fontSize: 14,
    fontWeight: "500"
  },

  submitBtn: {
    backgroundColor: "#1E293B",
    paddingVertical: 10,
    borderRadius: 14,
    marginTop: 12
  },

  submitText: {
    color: COLORS.accent,
    textAlign: "center",
    fontWeight: "600",
    fontSize: 14
  },

  done: {
    color: COLORS.accent,
    marginTop: 12,
    fontWeight: "600",
    fontSize: 14
  }
});
