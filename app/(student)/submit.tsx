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
  if (!id) return alert("Invalid assignment");
  if (!file) return alert("Select PDF first");

  const formData = new FormData();
  formData.append("file", {
    uri: file.uri,
    type: "application/pdf",
    name: file.name
  } as any);

  formData.append("upload_preset", "classroom_upload");

  const res = await fetch("https://api.cloudinary.com/v1_1/dynib391i/auto/upload", {
    method: "POST",
    body: formData
  });

  const uploaded = await res.json();

  const { data: user } = await supabase.auth.getUser();

  await supabase.from("submissions").upsert({
    assignment_id: id,
    student_id: user.user?.id,
    file_url: uploaded.secure_url,
    submitted_at: new Date().toISOString()
  }, {
    onConflict: "student_id,assignment_id"
  });

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
