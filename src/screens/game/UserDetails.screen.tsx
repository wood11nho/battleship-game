import React, { useEffect, useState } from 'react';
import { Alert, Text, View, ScrollView, ActivityIndicator, StyleSheet } from 'react-native';
import { getUserDetails } from '../../api';
import { useAuth } from '../../hooks/authContext';
import styled from 'styled-components/native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';

interface UserDetails {
    currentlyGamesPlaying: number;
    gamesLost: number;
    gamesPlayed: number;
    gamesWon: number;
    user: {
        email: string;
    };
}

const Container = styled(SafeAreaView)`
    flex: 1;
    justify-content: center;
    align-items: center;
    background-color: #f4f4f8;
`;

const ScrollContainer = styled(ScrollView)`
    width: 100%;
`;

const UserDetailsContainer = styled(LinearGradient)`
    padding: 25px;
    border-radius: 20px;
    margin: 20px;
    align-self: center;
    shadow-color: #000;
    shadow-opacity: 0.1;
    elevation: 10;
    shadow-radius: 15px;
    shadow-offset: 0 8px;
`;

const DetailText = styled.Text`
    font-size: 18px;
    font-weight: bold;
    color: #fff;
    margin-bottom: 15px;
    text-align: center;
`;

const Header = styled.Text`
    font-size: 24px;
    color: #333;
    font-weight: bold;
    margin-bottom: 10px;
    text-align: center;
`;

const UserDetailsScreen = () => {
    const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
    const { token } = useAuth();

    useEffect(() => {
        const fetchUserDetails = async () => {
            try {
                const details = await getUserDetails(token);
                setUserDetails(details);
            } catch (error) {
                console.error('Failed to fetch user details:', error);
                Alert.alert('Error', 'Failed to load user details.');
            }
        };

        fetchUserDetails();
    }, [token]);

    if (!userDetails) {
        return (
            <Container>
                <ActivityIndicator size="large" color="#007bff" />
            </Container>
        );
    }

    return (
        <Container>
            <ScrollContainer contentContainerStyle={styles.scrollContent}>
                <UserDetailsContainer colors={['#6a11cb', '#2575fc']} start={[0, 0.5]} end={[1, 0.5]}>
                    <DetailText>Email: {userDetails.user.email}</DetailText>
                    <DetailText>Games Played: {userDetails.gamesPlayed}</DetailText>
                    <DetailText>Games Won: {userDetails.gamesWon}</DetailText>
                    <DetailText>Games Lost: {userDetails.gamesLost}</DetailText>
                    <DetailText>Currently Playing: {userDetails.currentlyGamesPlaying}</DetailText>
                </UserDetailsContainer>
            </ScrollContainer>
        </Container>
    );
}

const styles = StyleSheet.create({
    scrollContent: {
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
    }
});

export default UserDetailsScreen;
