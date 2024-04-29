import { useEffect, useState } from 'react';
import { createGame, getDetailsOfGame, listGames } from '../../api';
import { useAuth } from '../../hooks/authContext';
import GameListItem from '../../components/GameListItem';
import { Text } from 'react-native';
import styled from 'styled-components/native';

const Container = styled.View`
    flex: 1;
    position: relative;
`;

const FloatingButton = styled.TouchableOpacity`
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

const GameList = styled.ScrollView`
    border: 1px solid #000;
    border-radius: 5px;
    margin: 10px;
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

const TableScreen = () => {
    const auth = useAuth()
    const [games, setGames] = useState<any[]>([])

    useEffect(() => {
        listGames(auth.token).then(setGames)
    }, [])

    const handleCreateGame = async () => {
        await createGame(auth.token);
        await listGames(auth.token).then(setGames);
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
                        () => getDetailsOfGame(auth.token, game.id)
                    }
                    />
                ))}
            </GameList>
            <FloatingButton onPress={() => handleCreateGame()}>
                <Text style={{ color: 'white', fontSize: 16 }}>Create Game</Text>
            </FloatingButton>
        </Container>
    );
}

export default TableScreen