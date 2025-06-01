import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "../screens/HomeScreen";
import LogWorkoutScreen from "../screens/LogWorkoutScreen";
import WorkoutHistoryScreen from "../screens/WorkoutHistoryScreen";

const Stack = createNativeStackNavigator();

export default function AppStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
      <Stack.Screen name="LogWorkout" component={LogWorkoutScreen} options={{ title: "Log Workout" }}/>
      <Stack.Screen name="EditWorkout" component={LogWorkoutScreen} options={{ title: "Edit Workout" }} />
      <Stack.Screen name="WorkoutHistory" component={WorkoutHistoryScreen} options={{ title: "Workout History" }} />
    </Stack.Navigator>
  );
}
