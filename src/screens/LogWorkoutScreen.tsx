import React, { useState } from "react";
import { View, TextInput, Button, StyleSheet, Alert, Text, ScrollView } from "react-native";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../lib/firebase";
import { useAuth } from "../context/AuthContext";

export default function LogWorkoutScreen() {
  const { user } = useAuth();

  const [date, setDate] = useState(new Date());
  const [exercises, setExercise] = useState([
    {
      name: "",
      sets: [{
        reps: 0,
        weight: 0,
      }]
    }
  ]);
  
  const updateExerciseName = (i: number, name: string) => {
    const newExercise = [...exercises];
    newExercise[i].name = name;
    setExercise(newExercise);
  }

  // ei = exercise index, si = set index
  const updateSet = (ei: number, si: number, field: "reps" | "weight", value: string) => {
    const newExcercise = [...exercises];
    newExcercise[ei].sets[si][field] = Number(value);
    setExercise(newExcercise);
  }

  const addExercise = () => {
    setExercise([...exercises, { name: "", sets: [{ reps: 0, weight: 0}] }]);
  }

  const addSet = (i: number) => {
    const newExercise = [...exercises];
    newExercise[i].sets.push({ reps: 0, weight: 0});
    setExercise(newExercise);
  };

  const handleSubmit = async () => {
    try {
      await addDoc(collection(db, `users/${user?.uid}/workouts`), {
        date,
        exercises,
        timestamp: serverTimestamp(),
      });
      Alert.alert("Workout logged successfully!");
      setExercise([{ name: "", sets: [{ reps: 0, weight: 0}] }]);
    } catch (error: any) {
      console.error("Error logging workout:", error);
      Alert.alert("Error logging workout", error.message);
    }
  }
  
  const styles = StyleSheet.create({
    container: { padding: 20, paddingBottom: 100 },
    title: { fontSize: 24, fontWeight: "bold", marginBottom: 20, textAlign: "center" },
    input: {
      borderWidth: 1,
      padding: 10,
      borderRadius: 8,
      marginBottom: 10,
    },
    exerciseBlock: {
      marginBottom: 20,
      padding: 10,
      borderColor: "#ccc",
      borderWidth: 1,
      borderRadius: 8,
    },
    setRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginBottom: 8,
    },
    smallInput: {
      flex: 1,
      borderWidth: 1,
      padding: 8,
      marginRight: 8,
      borderRadius: 6,
    },
    inputLabel: {
      fontSize: 16,
      marginBottom: 4,
      color: '#666',
    },
    setLabel: {
      fontSize: 14,
      color: '#666',
      marginBottom: 2,
    },
    setNumber: {
      fontSize: 16,
      fontWeight: 'bold',
      marginBottom: 8,
    },
    inputGroup: {
      marginBottom: 10,
    }
});
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Log Workout</Text>

      {exercises.map((exercise, ei) => (
        <View key={ei} style={styles.exerciseBlock}>
          <Text style={styles.inputLabel}>Exercise Name</Text>
          <TextInput
            style={styles.input}
            placeholder="Exercise Name"
            value={exercise.name}
            onChangeText={(text) => updateExerciseName(ei, text)}
          />
          {exercise.sets.map((set, si) => (
            <View key={si}>
              <Text style={styles.setNumber}>Set {si + 1}</Text>
              <View style={styles.setRow}>
                <View style={styles.inputGroup}>
                  <Text style={styles.setLabel}>Reps</Text>
                  <TextInput
                    style={styles.smallInput}
                    placeholder="0"
                    keyboardType="numeric"
                    value={set.reps.toString()}
                    onChangeText={(text) => updateSet(ei, si, "reps", text)}
                  />
                </View>
                <View style={styles.inputGroup}>
                  <Text style={styles.setLabel}>Weight (kg)</Text>
                  <TextInput
                    style={styles.smallInput}
                    placeholder="0"
                    keyboardType="numeric"
                    value={set.weight.toString()}
                    onChangeText={(text) => updateSet(ei, si, "weight", text)}
                  />
                </View>
              </View>
            </View>
          ))}
          <Button title="Add Set" onPress={() => addSet(ei)} />
        </View>
      ))}
      <Button title="Add Exercise" onPress={addExercise} />
      <Button title="Submit Workout" onPress={handleSubmit} />
    </ScrollView>
  )

  
};
