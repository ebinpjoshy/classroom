import * as DocumentPicker from "expo-document-picker";
import { useLocalSearchParams, useRouter } from "expo-router";

import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { supabase } from "../../lib/supabase";

export default function Submit() {
  const params = useLocalSearchParams();
const id = params?.id as string | undefined;


  const router = useRouter();
  const [file, setFile] = useState<any>(null);

  async function pickFile() {
    const res = await DocumentPicker.getDocumentAsync({
      type: "application/pdf"
    });
    if (!res.canceled) setFile(res.assets[0]);
  }

  async function handleSubmit() {
    // Upload file to Cloudinary using backend
      if (!id) return alert("Invalid assignment link");
  if (!file) return alert("Select a PDF first");
    const body = new FormData();
    body.append("file", {
      uri: file.uri,
      name: file.name,
      type: "application/pdf"
    } as any);

    const res = await fetch("https://classroom-backend-1xmc.onrender.com", {
  method: "POST",
  headers: {
    "Content-Type": "multipart/form-data"
  },
  body
});

    const uploaded = await res.json();
const { data: user } = await supabase.auth.getUser();

console.log("Assignment ID:", id);
console.log("Student ID:", user.user?.id);
console.log("File URL:", uploaded.url);

const { error } = await supabase.from("submissions").upsert(
  {
    assignment_id: id,
    student_id: user.user?.id,
    file_url: uploaded.url,
    submitted_at: new Date().toISOString()
  },
  {
    onConflict: "student_id,assignment_id"
  }
);

if (error) {
  alert(error.message);
}

    router.back();
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Submit Answer</Text>

      <Pressable style={styles.fileBtn} onPress={pickFile}>
        <Text style={styles.fileText}>
          {file ? file.name : "Select PDF"}
        </Text>
      </Pressable>

      <Pressable style={styles.btn} onPress={handleSubmit}>
        <Text style={styles.btnText}>Upload</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#020617", padding: 24 },
  header: { fontSize: 28, color: "#F8FAFC", marginBottom: 30 },
  fileBtn: { backgroundColor: "#0F172A", padding: 16, borderRadius: 12 },
  fileText: { color: "#F8FAFC" },
  btn: { backgroundColor: "#22C55E", padding: 16, borderRadius: 14, marginTop: 20 },
  btnText: { color: "#052E16", textAlign: "center" }
});
