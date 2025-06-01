import React, { useState } from 'react';
import { View, Text, Button, StyleSheet, Alert, ScrollView } from 'react-native';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../context/AuthContext';

// Define ExerciseSet and Exercise types
type ExerciseSet = {
    reps: number;
    weight: number;
};

type Exercise = {
    name: string;
    sets: ExerciseSet[];
};


export default function EditWorkoutScreen({ route, navigation }: { route: any; navigation: any }) {
    const { workout } = route.params;
    const { user } = useAuth();
    const [exercises, setExercises] = useState(workout.exercises || []);

    const handleUpdate = async () => {
        try {
            const workoutRef = doc(db, `users/${user?.uid}/workouts`, workout.id);
            await updateDoc(workoutRef, {
                exercises,
                timestamp: new Date(),
            });
            Alert.alert('Workout updated successfully!');
            navigation.goBack();
        } catch (error: any) {
            console.error('Error updating workout:', error);
            Alert.alert('Error updating workout', error.message);
        }
    };
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
        <ScrollView style={styles.container}>
            <Text style={styles.title}>Edit Workout</Text>
            {exercises.map((exercise: Exercise, index: number) => (
            <View key={index} style={styles.exerciseBlock}>
                <Text style={styles.inputLabel}>Exercise Name</Text>
                <Text style={styles.setNumber}>{exercise.name}</Text>
                {exercise.sets.map((set: ExerciseSet, setIndex: number) => (
                <View key={setIndex} style={styles.setRow}>
                    <Text style={styles.setLabel}>Set {setIndex + 1}</Text>
                    <Text style={styles.setLabel}>Reps: {set.reps}, Weight: {set.weight}kg</Text>
                </View>
                ))}
            </View>
            ))}
            <Button title="Update Workout" onPress={handleUpdate} />
            <Button title="Cancel" onPress={() => navigation.goBack()} color="gray" />
        </ScrollView>
    )
}
