import React, { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Alert, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import styled from 'styled-components/native';
import { useRoute } from '@react-navigation/native';
import { GameContext, useGameContext } from '../../hooks/gameContext';
import Table from '../../components/Table';
import { joinGame } from '../../api';
import { useAuth } from '../../hooks/authContext';

const StyledSafeAreaView = styled(SafeAreaView)`
    flex: 1;
    background-color: #f0f8ff;
    align-items: center;
    justify-content: center;
`;

const StyledScrollView = styled(ScrollView)`
    flex: 1;
    width: 100%;
`;

const ContentContainer = styled(View)`
    flex-grow: 1;
    align-items: center;
    justify-content: center;
`;

const Heading = styled(View)`
    align-items: center;
    justify-content: center;
`;

const PlayerText = styled(Text)`
    color: #2e4c6d;
    font-size: 12.5px;
    font-weight: bold;
    text-align: center;
`;

const VsText = styled(Text)`
    color: #a83232;
    font-size: 11.25px;
    font-weight: bold;
    text-align: center;
`;

const JoinButton = styled(TouchableOpacity)`
    background-color: #4CAF50;
    padding: 6.25px 12.5px;
    border-radius: 12.5px;
    elevation: 3;
    margin-top: 12.5px;
`;

const ButtonText = styled(Text)`
    color: #fff;
    font-size: 11.25px;
    font-weight: bold;
`;

const PlayerToMoveContainer = styled(View)`
    padding: 6.25px 12.5px;
    margin-bottom: 12.5px;
    background-color: #4CAF50;
    border-radius: 6.25px;
    align-items: center;
    justify-content: center;
    shadow-opacity: 0.75;
    shadow-radius: 3.125px;
    shadow-color: #000;
    shadow-offset: 0px 1.25px;
`;

const PlayerToMoveText = styled(Text)`
    color: #ffffff;
    font-size: 11.25px;
    font-weight: bold;
    text-align: center;
`;

const ReplayButton = styled(TouchableOpacity)`
    background-color: #4CAF50;
    padding: 6.25px 12.5px;
    border-radius: 12.5px;
    elevation: 3;
    margin-top: 12.5px;
`;


const createEmptyBoard = () => Array.from({ length: 10 }, () => Array(10).fill('')); // A change to one cell will not affect all cells

const TableScreen = () => {
    const route = useRoute<any>();
    const gameContext = useGameContext();
    const auth = useAuth();

    const [playerShips, setPlayerShips] = useState(createEmptyBoard());
    const [opponentShips, setOpponentShips] = useState(createEmptyBoard());
    const [playerShipsReplay, setPlayerShipsReplay] = useState(createEmptyBoard());
    const [opponentShipsReplay, setOpponentShipsReplay] = useState(createEmptyBoard());



    const currentPlayerEmail = gameContext.game?.playerToMoveId === gameContext.game?.player1Id
        ? gameContext.game?.player1?.email
        : gameContext.game?.player2?.email;

    useEffect(() => {
        if (route.params?.gameId) {
            gameContext.getDetailsOfGame(route.params.gameId).then(() => {
                if (gameContext.game && ['ACTIVE', 'FINISHED'].includes(gameContext.game.status) &&
                    (gameContext.game?.player1Id === auth.id || gameContext.game?.player2Id === auth.id)) {
                    getPlayerShips();
                    getOpponentShips();
                }
            });
        }
    }, [route.params?.gameId, gameContext.game?.status, auth.id]);

    const getPlayerShips = () => {
        const newPlayerShips = playerShips.map(row => [...row]); // Deep copy the array
        gameContext.game?.shipsCoord?.forEach(coord => {
            // console.log('Player ID:', coord.playerId, 'Auth ID:', auth.id);
            if (coord.hit){
                // console.log('Updating player ship at:', coord.x, coord.y, coord.hit);
                newPlayerShips[coord.y - 1][coord.x.charCodeAt(0) - 'A'.charCodeAt(0)] = 'X';
            } else{
                // console.log('Updating player ship at:', coord.x, coord.y, coord.hit);
                newPlayerShips[coord.y - 1][coord.x.charCodeAt(0) - 'A'.charCodeAt(0)] = 'O';
            }
        });

        gameContext.game?.moves?.forEach(move => {
            if (move.playerId !== auth.id) {
                // console.log('Updating player ship at:', move.x, move.y, move.result);
                if (move.result === false) {
                    newPlayerShips[move.y - 1][move.x.charCodeAt(0) - 'A'.charCodeAt(0)] = 'm';
                }
            }
        });
        setPlayerShips(newPlayerShips);
        console.log('Player ships state updated');
    };

    const getOpponentShips = () => {
        const newOpponentShips = opponentShips.map(row => [...row]);
        gameContext.game?.moves?.forEach(move => {
            if (move.playerId === auth.id) {
                if (move.result === true) {
                    newOpponentShips[move.y - 1][move.x.charCodeAt(0) - 'A'.charCodeAt(0)] = 'X';
                } else {
                    newOpponentShips[move.y - 1][move.x.charCodeAt(0) - 'A'.charCodeAt(0)] = 'O';
                }
            }
        }
        );
        setOpponentShips(newOpponentShips);
        // console.log('Opponent ships state updated');
    };

    const handleJoinGame = async () => {
        console.log('Joining game...');
        if (gameContext.game) {
            joinGame(auth.token, gameContext.game.id)
                .then(() => {
                    gameContext.getDetailsOfGame(route.params.gameId);
                    console.log('Game joined');
                })
                .catch(error => {
                    console.error(error);
                    // Assuming the error object has a message property
                    Alert.alert("Error Joining Game", error.message, [
                        { text: "OK", onPress: () => console.log("OK Pressed") }
                    ]);
                });
        }
    };

    const getWinnerName = () => {
        const lastMove = gameContext.game?.moves?.slice(-1)[0];
        if (lastMove) {
            return lastMove.playerId === gameContext.game?.player1Id
                ? gameContext.game?.player1?.email
                : gameContext.game?.player2?.email;
        }
        return 'No winner';
    };

    const handleReplay = () => {
        const moves = gameContext.game?.moves;
        if (!moves || moves.length === 0) {
            console.log("No moves to replay.");
            return; // Exit if no moves are available
        }
    
        let moveIndex = 0;
    
        const replayMoves = () => {
            if (moveIndex < moves.length) {
                // Start with a fresh state for each iteration to accumulate from the first move to the current move
                const newPlayerShips = createEmptyBoard();
                const newOpponentShips = createEmptyBoard();
    
                for (let i = 0; i <= moveIndex; i++) {
                    const move = moves[i];
                    const xIndex = move.x.charCodeAt(0) - 'A'.charCodeAt(0);
                    const yIndex = move.y - 1;
    
                    if (move.playerId === gameContext.game?.player1Id) {
                        // Update the opponent's board since player 1's moves affect player 2's board
                        newOpponentShips[yIndex][xIndex] = move.result ? 'X' : 'O';
                    } else {
                        // Update the player's board since player 2's moves affect player 1's board
                        newPlayerShips[yIndex][xIndex] = move.result ? 'X' : 'O';
                    }
                }
    
                setPlayerShipsReplay(newPlayerShips);
                setOpponentShipsReplay(newOpponentShips);
                moveIndex++;
                if (moveIndex < moves.length) {
                    setTimeout(replayMoves, 1000); // Schedule the next move
                }
            }
        };
    
        replayMoves(); // Start the replay
    };
    
    

    return (
        <StyledSafeAreaView>
            <StyledScrollView
                contentContainerStyle={{ alignItems: 'center', justifyContent: 'center' }}>
                <ContentContainer>
                    {
                        gameContext.game?.status === 'FINISHED' && (
                            <PlayerToMoveContainer>
                                <PlayerToMoveText>Winner: {getWinnerName()}</PlayerToMoveText>
                            </PlayerToMoveContainer>
                        )
                    }
                    {gameContext.game?.status === 'ACTIVE' && currentPlayerEmail && (
                        <PlayerToMoveContainer>
                            <PlayerToMoveText>{currentPlayerEmail} to move</PlayerToMoveText>
                        </PlayerToMoveContainer>
                    )}
                    {
                        gameContext.game?.status === 'MAP_CONFIG' &&
                        (
                            <PlayerToMoveContainer>
                                <PlayerToMoveText>Map Configuration</PlayerToMoveText>
                            </PlayerToMoveContainer>
                        )
                    }
                    <Heading>
                        <PlayerText>{gameContext.game?.player1?.email}</PlayerText>
                        <VsText>vs</VsText>
                        <PlayerText>{gameContext.game?.player2 ? gameContext.game.player2.email : 'Waiting for player 2'}</PlayerText>
                    </Heading>
                    {(gameContext.game?.status == 'ACTIVE' || gameContext.game?.status == 'FINISHED') && (auth.id === gameContext.game?.player1Id || auth.id === gameContext.game?.player2Id) ?
                        (
                            // Show both tables
                            <View style={{ flexDirection: 'column' }}>
                                <Table state={playerShips} onCellClick={() => { }} />
                                <Table state={opponentShips} onCellClick={() => { }} />
                            </View>
                        ) : null
                    }
                    {!gameContext.game?.player2 && (
                        <JoinButton onPress={handleJoinGame}>
                            <ButtonText>Join Game</ButtonText>
                        </JoinButton>
                    )}
                    {
                        gameContext.game?.status === 'FINISHED' &&
                        (
                            <ReplayButton onPress={handleReplay}>
                                <ButtonText>Replay</ButtonText>
                            </ReplayButton>
                        )
                    }                    
                    {
                        gameContext.game?.status === 'FINISHED' &&
                        (
                            <View style={{ flexDirection: 'column' }}>
                                <Table state={playerShipsReplay} onCellClick={() => { }} />
                                <Table state={opponentShipsReplay} onCellClick={() => { }} />
                            </View>
                        )
                    }
                </ContentContainer>
            </StyledScrollView>
        </StyledSafeAreaView>
    );
}

export default () => (
    <GameContext>
        <TableScreen />
    </GameContext>
);