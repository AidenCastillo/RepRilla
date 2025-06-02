import { useNavigation, NavigationProp } from '@react-navigation/native';
import React from 'react';
import { View, Text, Button, StyleSheet, Platform } from 'react-native';
import { AdBanner } from '../components/AdBanner';

type RootStackParamList = {
    LogWorkout: undefined;
    WorkoutHistory: undefined;
};

const HomeScreen: React.FC = () => {
    const navigation = useNavigation<NavigationProp<RootStackParamList>>();

    return (
        <View style={styles.container}>
            <View style={styles.content}>
                <Text style={styles.title}>Welcome to Home Screen</Text>
                <View style={styles.buttonContainer}>
                    <Button 
                        title="Go to Log Workout" 
                        onPress={() => navigation.navigate('LogWorkout')} 
                    />
                    <View style={styles.buttonSpacer} />
                    <Button 
                        title="Go to Workout History" 
                        onPress={() => navigation.navigate('WorkoutHistory')} 
                    />
                </View>
            </View>
            <View style={styles.adContainer}>
                {/* <AdBanner /> */}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingBottom: Platform.OS === 'web' ? 0 : 60, // Add padding for ad space on mobile
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 20,
    },
    buttonContainer: {
        width: '100%',
        maxWidth: 300,
        padding: 20,
    },
    buttonSpacer: {
        height: 15,
    },
    adContainer: {
        width: '100%',
        alignItems: 'center',
        padding: 10,
        backgroundColor: '#fff',
        ...Platform.select({
            android: {
                elevation: 4,
            },
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: -2 },
                shadowOpacity: 0.1,
                shadowRadius: 4,
            },
            web: {
                borderTop: '1px solid #eee',
            },
        }),
    },
});

export default HomeScreen;
