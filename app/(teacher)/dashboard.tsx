import { useRouter } from "expo-router";
import { ClipboardCheck, FileText, GraduationCap } from "lucide-react-native";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

const COLORS = {
  bg: "#020617",
  card: "#0F172A",
  blue: "#38BDF8",
  green: "#22C55E",
  purple: "#A78BFA",
  text: "#F8FAFC",
  muted: "#94A3B8"
};

export default function TeacherDashboard() {
  const router = useRouter();

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.header}>Teacher's Dashboard</Text>

      {/* Create Assignment */}
      <Pressable
        onPress={() => router.push("/(teacher)/createassignment")}
        style={({ pressed }) => [styles.mainCard, pressed && styles.cardPressed]}
      >
        <View style={styles.cardRow}>
          <View>
            <Text style={styles.cardTitle}>Create Assignment</Text>
            <Text style={styles.cardSub}>Upload questions and set deadlines</Text>
          </View>
          <FileText size={28} color={COLORS.blue} />
        </View>
      </Pressable>

      {/* View Submissions */}
      <Pressable
        onPress={() => router.push("/(teacher)/submissions")}
        style={({ pressed }) => [styles.mainCard, pressed && styles.cardPressed]}
      >
        <View style={styles.cardRow}>
          <View>
            <Text style={styles.cardTitle}>View Submissions</Text>
            <Text style={styles.cardSub}>Evaluate student answers</Text>
          </View>
          <ClipboardCheck size={28} color={COLORS.green} />
        </View>
      </Pressable>

      {/* Grade Students */}
      <Pressable
        onPress={() => router.push("/(teacher)/grade")}
        style={({ pressed }) => [styles.mainCard, pressed && styles.cardPressed]}
      >
        <View style={styles.cardRow}>
          <View>
            <Text style={styles.cardTitle}>Grade Students</Text>
            <Text style={styles.cardSub}>Assign marks and feedback</Text>
          </View>
          <GraduationCap size={28} color={COLORS.purple} />
        </View>
      </Pressable>
    </ScrollView>
  );
}

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
  mainCard: {
    backgroundColor: COLORS.card,
    borderRadius: 22,
    padding: 22,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#1E293B"
  },
  cardPressed: {
    transform: [{ scale: 0.96 }],
    backgroundColor: "#020617"
  },
  cardRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
  cardTitle: {
    fontSize: 19,
    color: COLORS.text,
    fontWeight: "600"
  },
  cardSub: {
    color: COLORS.muted,
    marginTop: 6,
    fontSize: 13
  }
});
