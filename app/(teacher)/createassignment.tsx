import * as DocumentPicker from "expo-document-picker";
import { useRouter } from "expo-router";
import { FileText } from "lucide-react-native";
import { useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { supabase } from "../../lib/supabase";

const BACKEND_URL = "https://classroom-backend-1xmc.onrender.com";

type PickedFile = {
  name: string;
  uri: string;
  mimeType?: string;
};

export default function CreateAssignment() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [deadline, setDeadline] = useState("");
  const [file, setFile] = useState<PickedFile | null>(null);

  async function pickFile() {
    const res = await DocumentPicker.getDocumentAsync({ copyToCacheDirectory: true });
    if (!res.canceled && res.assets?.length) {
      const f = res.assets[0];
      setFile({ name: f.name, uri: f.uri, mimeType: f.mimeType });
    }
  }

  async function uploadFile() {
    if (!file) return null;

    const body = new FormData();
    body.append("file", {
      uri: file.uri,
      name: file.name,
      type: file.mimeType || "application/octet-stream"
    } as any);

    const res = await fetch(`${BACKEND_URL}/upload`, {
      method: "POST",
      headers: { },
      body
    });

    if (!res.ok) throw new Error("Upload failed");
    return res.json();
  }

  async function handleCreate() {
    let uploaded = null;
    if (file) uploaded = await uploadFile();

    await supabase.from("assignments").insert({
      title,
      deadline,
      file_url: uploaded?.url || null
    });

    router.back();
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Create Assignment</Text>

      <View style={styles.formCard}>
        <TextInput
          style={styles.input}
          placeholder="Assignment title"
          placeholderTextColor="#94A3B8"
          value={title}
          onChangeText={setTitle}
        />

        <TextInput
          style={styles.input}
          placeholder="Deadline (e.g. 12 Jan 2026)"
          placeholderTextColor="#94A3B8"
          value={deadline}
          onChangeText={setDeadline}
        />

        <Pressable
          onPress={pickFile}
          style={({ pressed }) => [styles.fileCard, pressed && styles.pressed]}
        >
          <FileText size={22} color="#38BDF8" />
          <Text style={styles.fileText}>
            {file ? file.name : "Attach question file"}
          </Text>
        </Pressable>

        <Pressable
          onPress={handleCreate}
          style={({ pressed }) => [styles.createBtn, pressed && styles.pressed]}
        >
          <Text style={styles.createText}>Create Assignment</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#020617",
    paddingHorizontal: 20,
    paddingTop: 60
  },
  header: {
    fontSize: 32,
    color: "#F8FAFC",
    fontWeight: "700",
    marginBottom: 26
  },
  formCard: {
    backgroundColor: "#0F172A",
    borderRadius: 20,
    padding: 22,
    borderWidth: 1,
    borderColor: "#1E293B"
  },
  input: {
    backgroundColor: "#020617",
    color: "#F8FAFC",
    padding: 16,
    borderRadius: 12,
    marginBottom: 18,
    fontSize: 15
  },
  fileCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#020617",
    padding: 16,
    borderRadius: 12,
    marginBottom: 22
  },
  fileText: {
    color: "#F8FAFC",
    marginLeft: 12,
    fontSize: 14
  },
  createBtn: {
    backgroundColor: "#22C55E",
    padding: 16,
    borderRadius: 14
  },
  createText: {
    color: "#052E16",
    fontSize: 18,
    textAlign: "center",
    fontWeight: "600"
  },
  pressed: {
    transform: [{ scale: 0.96 }],
    opacity: 0.85
  }
});
