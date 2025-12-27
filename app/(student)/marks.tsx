import { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { supabase } from "../../lib/supabase";

export default function MyMarks() {
  const [marks, setMarks] = useState<any[]>([]);

  useEffect(() => {
    let channel: any;

    async function init() {
      const { data: auth } = await supabase.auth.getUser();
      if (!auth.user) return;

      const studentId = auth.user.id;

      const fetchMarks = async () => {
        const { data } = await supabase
  .from("submission_details")
  .select("assignment_title, marks")
  .eq("student_id", studentId)
  .order("assignment_title")
  .throwOnError();

          
        setMarks(data || []);
      };

      await fetchMarks();

      channel = supabase
  .channel(`marks-${studentId}`)
  .on(
    "postgres_changes",
    {
      event: "UPDATE",
      schema: "public",
      table: "submissions",
      filter: `student_id=eq.${studentId}`
    },
    fetchMarks
  )
  .subscribe();

    }

    init();

    return () => {
      if (channel) supabase.removeChannel(channel);
    };
  }, []);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>My Marks</Text>

      {marks.length === 0 && (
        <Text style={styles.empty}>No grades yet</Text>
      )}

      {marks.map((m, i) => (
        <View key={i} style={styles.card}>
          <Text style={styles.title}>{m.assignment_title}</Text>
          <Text style={styles.mark}>
            {m.marks === null ? "Not graded yet" : `Marks: ${m.marks}`}
          </Text>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#020617", padding: 20 },
  header: {
  fontSize: 28,
  color: "#F8FAFC",
  fontWeight: "700",
  marginBottom: 24,
  marginTop: 50  
},

  empty: {
    color: "#64748B",
    textAlign: "center",
    marginTop: 40,
    fontSize: 16
  },
  card: {
    backgroundColor: "#0F172A",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#1E293B"
  },
  title: {
    color: "#38BDF8",
    fontSize: 16,
    fontWeight: "600"
  },
  mark: {
    color: "#22C55E",
    marginTop: 6,
    fontSize: 15,
    fontWeight: "600"
  }
});
