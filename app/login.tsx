import { useRouter } from "expo-router";
import { useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { supabase } from "../lib/supabase";

const COLORS = {
  bg: "#020617",
  card: "#0F172A",
  primary: "#38BDF8",
  accent: "#22C55E",
  text: "#F8FAFC",
  muted: "#94A3B8"
};

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const [fullName, setFullName] = useState("");

  async function handleLogin() {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return alert(error.message);

    const { data: profile } = await supabase.from("profiles").select("role").eq("id", data.user.id).single();
    if (profile?.role === "teacher") router.push("/(teacher)/dashboard");
    else router.push("/(student)/dashboard");
  }

  async function handleRegister(role: "teacher" | "student") {
    if (!fullName) return alert("Enter your full name");
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) return alert(error.message);

    await supabase.from("profiles").insert({
      id: data.user?.id,
      role,
      full_name: fullName
    });

    alert("Account created. Now login.");
  }

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <Text style={styles.header}>Classroom Login</Text>
        <Text style={styles.sub}>Welcome back</Text>

        <TextInput
          style={styles.input}
          placeholder="Full Name"
          placeholderTextColor={COLORS.muted}
          value={fullName}
          onChangeText={setFullName}
        />

        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor={COLORS.muted}
          value={email}
          onChangeText={setEmail}
        />

        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor={COLORS.muted}
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        <Pressable
          style={({ pressed }) => [
            styles.btn,
            pressed && { transform: [{ scale: 0.97 }], backgroundColor: "#16A34A" }
          ]}
          onPress={handleLogin}
        >
          <Text style={styles.btnText}>Login</Text>
        </Pressable>

        <Pressable style={styles.link} onPress={() => handleRegister("teacher")}>
          <Text style={styles.linkText}>Register as Teacher</Text>
        </Pressable>

        <Pressable style={styles.link} onPress={() => handleRegister("student")}>
          <Text style={styles.linkText}>Register as Student</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.bg },
  container: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: COLORS.bg,
    padding: 28
  },
  header: {
    fontSize: 34,
    color: COLORS.text,
    fontWeight: "700",
    marginBottom: 4
  },
  sub: {
    color: COLORS.muted,
    marginBottom: 28
  },
  input: {
    backgroundColor: COLORS.card,
    color: COLORS.text,
    borderRadius: 14,
    padding: 16,
    marginBottom: 16
  },
  btn: {
    backgroundColor: COLORS.accent,
    padding: 16,
    borderRadius: 14,
    marginTop: 6
  },
  btnText: {
    color: "#052E16",
    textAlign: "center",
    fontSize: 16,
    fontWeight: "700"
  },
  link: { marginTop: 18 },
  linkText: {
    color: COLORS.primary,
    textAlign: "center",
    fontWeight: "600"
  }
});
