import { useEffect, useState } from "react";
import {
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View
} from "react-native";
import { supabase } from "../../lib/supabase";

export default function GradeStudents() {
  const [groups, setGroups] = useState<Record<string, any[]>>({});

  useEffect(() => {
    supabase
      .from("submission_details")
      .select("*")
      .order("assignment_title")
      .then(({ data }) => {
        const g: Record<string, any[]> = {};
        (data || []).forEach((s) => {
          if (!g[s.assignment_title]) g[s.assignment_title] = [];
          g[s.assignment_title].push(s);
        });
        setGroups(g);
      });
  }, []);

  async function saveMark(id: string, value: string) {
    const marks = parseInt(value || "0");
    await supabase.from("submissions").update({ marks }).eq("id", id);
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
                onBlur={(e) => saveMark(s.id, e.nativeEvent.text)}
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
