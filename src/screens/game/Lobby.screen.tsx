import { useCallback, useEffect, useState } from 'react';
import { createGame, getDetailsOfGame, getUserDetails, listGames } from '../../api';
import { useAuth } from '../../hooks/authContext';
import GameListItem from '../../components/GameListItem';
import { Alert, Text } from 'react-native';
import styled from 'styled-components/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NavigationProp, useFocusEffect, useNavigation } from '@react-navigation/native';
import { GameRouteNames } from '../../router/route-names';

const Container = styled(SafeAreaView)`
    flex: 1;
    position: relative;
`;

const FloatingButtonCreateGame = styled.TouchableOpacity`
    position: absolute;
    right: 20px;
    bottom: 20px;
    background-color: #007bff;
    padding: 15px 20px;
    border-radius: 30px;
    elevation: 2;
    shadow-color: #000;
    shadow-opacity: 0.3;
    shadow-radius: 4px;
    shadow-offset: 0px 2px;
`;

const FloatingButtonUserDetails = styled.TouchableOpacity`
    position: absolute;
    left: 20px;
    bottom: 20px;
    background-color: #007bff;
    padding: 15px 20px;
    border-radius: 30px;
    elevation: 2;
    shadow-color: #000;
    shadow-opacity: 0.3;
    shadow-radius: 4px;
    shadow-offset: 0px 2px;
`;

const GameList = styled.ScrollView`
    border: 1px solid #000;
    border-radius: 5px;
    margin: 10px;
    margin-bottom: 50px;
    padding: 10px;
    height: 100%;
    background-color: #f8f9fa;
    border-color: #adb5bd;
`;

const Header = styled.View`
    flex-direction: row;
    justify-content: space-between;
    padding: 10px;
    margin: 10px;
`;

const HeaderText = styled.Text`
    font-weight: bold;
    color: #333;
`;

const IDHeader = styled(HeaderText)`
    flex: 1;
`;

const StatusHeader = styled(HeaderText)`
    text-align: center;
`;

const LobbyScreen = () => {
    const [games, setGames] = useState<any[]>([])
    const { token } = useAuth();

    const fetchGames = useCallback(async () => {
        try {
            const fetchedGames = await listGames(token);
            setGames(fetchedGames);
        } catch (error) {
            console.error('Failed to fetch games:', error);
            Alert.alert('Error', 'Failed to load games.');
        }
    }, [token]);

    useEffect(() => {
        fetchGames();
    }, [fetchGames]);

    useFocusEffect(
        useCallback(() => {
            fetchGames();
        }, [fetchGames])
    )

    const navigation = useNavigation<any>()

    const handleCreateGame = async () => {
        try {
            await createGame(token);
            await fetchGames();
        } catch (error) {
            console.error('Failed to create game:', error);
            Alert.alert('Error', 'Failed to create game.');
        }
    };

    const goToUserDetails = () => {
        navigation.navigate(GameRouteNames.USER_DETAILS, {token: token}),
        getUserDetails(token)
    }

    return (
        <Container>
            <Header>
                <IDHeader>ID</IDHeader>
                <StatusHeader>Status</StatusHeader>
            </Header>
            <GameList>
                {games.map(game => (
                    <GameListItem status={game.status} 
                    id={game.id} 
                    key={game.id} 
                    onPress={
                        () => {
                            navigation.navigate(GameRouteNames.TABLE, {gameId: game.id}),
                            getDetailsOfGame(token, game.id)
                        }
                    }
                    />
                ))}
            </GameList>
            <FloatingButtonUserDetails onPress={() => goToUserDetails()}>
                <Text style={{ color: 'white', fontSize: 16 }}>User Details</Text>
            </FloatingButtonUserDetails>
            <FloatingButtonCreateGame onPress={() => handleCreateGame()}>
                <Text style={{ color: 'white', fontSize: 16 }}>Create Game</Text>
            </FloatingButtonCreateGame>
        </Container>
    );
}

export default LobbyScreen;