import React, { useState } from "react";
import { View, TextInput, Button, StyleSheet, Alert, Text } from "react-native";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../lib/firebase";
import { useAuth } from "../context/AuthContext";

export default function LogWorkoutScreen() {
  const [exercise, setExercise] = useState("");
  const [reps, setReps] = useState("");
  const [weight, setWeight] = useState("");
  const { user } = useAuth();

  const handleLogWorkout = async () => {
    if (!exercise || !reps || !weight) {
      Alert.alert("Missing fields", "Please fill out all fields.");
      return;
    }

    try {
      await addDoc(collection(db, `users/${user?.uid}/workouts`), {
        exercise,
        reps: parseInt(reps),
        weight: parseFloat(weight),
        timestamp: serverTimestamp(),
      });

      Alert.alert("Success", "Workout logged!");
      setExercise("");
      setReps("");
      setWeight("");
    } catch (error: any) {
      Alert.alert("Error", error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Log a Workout</Text>

      <TextInput
        placeholder="Exercise (e.g. Bench Press)"
        style={styles.input}
        value={exercise}
        onChangeText={setExercise}
      />
      <TextInput
        placeholder="Reps"
        style={styles.input}
        value={reps}
        onChangeText={setReps}
        keyboardType="numeric"
      />
      <TextInput
        placeholder="Weight (lbs)"
        style={styles.input}
        value={weight}
        onChangeText={setWeight}
        keyboardType="numeric"
      />
      <Button title="Log Workout" onPress={handleLogWorkout} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 24 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 24, textAlign: "center" },
});
