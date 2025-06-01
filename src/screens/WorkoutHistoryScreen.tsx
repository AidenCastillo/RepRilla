import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useEffect } from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from "react-native";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "../lib/firebase";
type Exercise = {
    name: string;
    sets: any[]; // You can replace 'any' with a more specific type if you have one
};

type Workout = { id: string; [key: string]: any };

type RootStackParamList = {
    EditWorkout: { workout: Workout };
    LogWorkout: undefined;
    // add other routes here as needed
};

export default function WorkoutHistoryScreen() {
    const [workouts, setWorkouts] = useState<Workout[]>([]);
    const { user } = useAuth();
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

    useEffect(() => {
        loadWorkouts();
    }, []);

    const loadWorkouts = async () => {
        if (!user) return;

        try {
            const workoutsRef = collection(db, `users/${user.uid}/workouts`);
            const workoutsQuery = query(workoutsRef, orderBy("timestamp", "desc"));
            const querySnapshot = await getDocs(workoutsQuery);
            const workoutsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setWorkouts(workoutsData);
        } catch (error) {
            console.error("Error fetching workouts:", error);
        }
    }
    const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    listContainer: {
        paddingBottom: 20,
    },
    workoutCard: {
        padding: 15,
        backgroundColor: 'white',
        borderRadius: 8,
        marginBottom: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    dateText: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    exerciseText: {
        fontSize: 14,
        color: '#666',
        marginBottom: 4,
    },
    });

    const renderWorkout = ({ item }: { item: Workout }) => (
        <TouchableOpacity 
          style={styles.workoutCard}
          onPress={() => navigation.navigate('EditWorkout', { workout: item })}
        >
          <Text style={styles.dateText}>
        {new Date((item.date as { seconds: number }).seconds * 1000).toLocaleDateString()}
          </Text>
          {(item.exercises as Exercise[]).map((exercise: Exercise, index: number) => (
        <Text key={index} style={styles.exerciseText}>
          {exercise.name} - {exercise.sets.length} sets
        </Text>
          ))}
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Workout History</Text>
            <FlatList
                data={workouts}
                renderItem={renderWorkout}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.listContainer}
            />
        </View>
    )
}
