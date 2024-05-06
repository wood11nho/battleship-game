import React, { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Alert, ScrollView, Text, TouchableOpacity, View, ViewProps } from 'react-native';
import styled from 'styled-components/native';
import { useFocusEffect, useRoute } from '@react-navigation/native';
import { GameContext, useGameContext } from '../../hooks/gameContext';
import Table, { ICell } from '../../components/Table';
import { joinGame, sendMapConfiguration, sendStrike } from '../../api';
import { useAuth } from '../../hooks/authContext';
import ShipConfig from '../../components/ShipConfig';
import { StyleSheet } from 'react-native';

interface TableHeaderProps extends ViewProps {
    bgColor: string;
}

const StyledSafeAreaView = styled(SafeAreaView)`
    flex: 1;
    background-color: #f0f8ff;
    align-items: center;
    justify-content: flex-start;
    padding-top: 0px;
    padding-bottom: 0px;
`;

const StyledScrollView = styled(ScrollView)`
    flex: 1;
    width: 100%;
    padding-top: 0px;
    padding-bottom: 0px;
`;

const ContentContainer = styled(View)`
    flex-grow: 1;
    align-items: center;
    justify-content: flex-start;
    width: 100%;
    padding-top: 0px;
    padding-bottom: 0px;
`;

const Heading = styled(View)`
    flex-direction: row;
    align-items: center;
    justify-content: center;
    padding: 10px;
`;

const PlayerText = styled(Text)`
    color: #2e4c6d;
    font-size: 12.5px;
    font-weight: bold;
    text-align: center;
    flex: 1;
`;

const VsText = styled(Text)`
    color: #a83232;
    font-size: 11.25px;
    font-weight: bold;
    text-align: center;
    padding: 0px 10px;
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
    margin-top: 12.5px;
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
    background-color: #E91E63;
    padding: 6.25px 12.5px;
    border-radius: 12.5px;
    elevation: 3;
    margin-top: 12.5px;
    margin-bottom: 12.5px;
`;

const TableHeader = styled.View<TableHeaderProps>`
    background-color: ${props => props.bgColor};
    padding: 8px 16px;
    border-radius: 5px;
    margin-bottom: 5px;
`;

const TableHeaderText = styled(Text)`
    color: #fff;
    font-size: 14px;
    font-weight: bold;
    text-align: center;
`;

const ConfigContainer = styled.View`
    width: 100%;
    padding: 10px;
    align-items: center;
`;

const SendMapButton = styled(TouchableOpacity)`
    background-color: #007bff;
    padding: 6.25px 12.5px;
    border-radius: 12.5px;
    elevation: 3;
    margin-top: 12.5px;
`;

const createEmptyBoard = () => Array.from({ length: 10 }, () => Array(10).fill(''));

const TableScreen = () => {
    const route = useRoute<any>();
    const gameContext = useGameContext();
    const auth = useAuth();

    const [playerShips, setPlayerShips] = useState(createEmptyBoard());
    const [opponentShips, setOpponentShips] = useState(createEmptyBoard());
    const [playerShipsReplay, setPlayerShipsReplay] = useState(createEmptyBoard());
    const [opponentShipsReplay, setOpponentShipsReplay] = useState(createEmptyBoard());
    const [isReplaying, setIsReplaying] = useState(false);
    const [hasConfigured, setHasConfigured] = useState(false);

    const currentPlayerEmail = gameContext.game?.playerToMoveId === gameContext.game?.player1Id
        ? gameContext.game?.player1?.email
        : gameContext.game?.player2?.email;

    useEffect(() => {
        if (route.params?.gameId) {
            gameContext.getDetailsOfGame(route.params.gameId).then(() => {
                if (gameContext.game && ['ACTIVE', 'FINISHED'].includes(gameContext.game.status) &&
                    (gameContext.game?.player1Id === auth.id || gameContext.game?.player2Id === auth.id)) {
                    getPlayerShips();
                    // getOpponentShips();
                }
                if (gameContext.game && gameContext.game.status === 'MAP_CONFIG' && 
                (gameContext.game.player1Id === auth.id || gameContext.game.player2Id === auth.id) && 
                (gameContext.game.shipsCoord?.length ?? 0) > 0) {
                if (gameContext.game.shipsCoord?.some(coord => coord.playerId === auth.id)) {
                    setHasConfigured(true);
                }
            }
            });
        }
    }, [route.params?.gameId, gameContext.game?.status, auth.id]);
    
    useEffect(() => {
        console.log('Game moves updated, refreshing player ships...');
        getOpponentShips();
    }, [gameContext.game?.moves]);

    const getPlayerShips = () => {
        const newPlayerShips = playerShips.map(row => [...row]);
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
        gameContext.game?.moves?.forEach(move => {
            if (move.playerId === auth.id) {
                setOpponentShips(prevShips => {
                    const newShips = [...prevShips];
                    const xIndex = move.x.charCodeAt(0) - 'A'.charCodeAt(0);
                    const yIndex = move.y - 1;
                    newShips[yIndex][xIndex] = move.result ? 'X' : 'O';
                    return newShips;
                });
            }
        });
        console.log('Opponent ships state should be updated now');
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
            return;
        }
    
        setIsReplaying(true);
        let moveIndex = 0;
    
        const replayMoves = () => {
            if (moveIndex < moves.length) {
                const newPlayerShips = createEmptyBoard();
                const newOpponentShips = createEmptyBoard();
    
                for (let i = 0; i <= moveIndex; i++) {
                    const move = moves[i];
                    const xIndex = move.x.charCodeAt(0) - 'A'.charCodeAt(0);
                    const yIndex = move.y - 1;
    
                    if (move.playerId === gameContext.game?.player1Id) {
                        newOpponentShips[yIndex][xIndex] = move.result ? 'X' : 'O';
                    } else {
                        newPlayerShips[yIndex][xIndex] = move.result ? 'X' : 'O';
                    }
                }
    
                setPlayerShipsReplay(newPlayerShips);
                setOpponentShipsReplay(newOpponentShips);
                moveIndex++;
                if (moveIndex < moves.length) {
                    setTimeout(replayMoves, 1000);
                } else {
                    setIsReplaying(false);
                }
            } else {
                setIsReplaying(false);
            }
        };
    
        replayMoves();
    };

    const [shipConfigs, setShipConfigs] = useState<any[]>(
        [
            { shipId: 0, x: "A", y: 1, size: 2, direction: "HORIZONTAL" },
            { shipId: 1, x: "A", y: 2, size: 2, direction: "HORIZONTAL" },
            { shipId: 2, x: "A", y: 3, size: 2, direction: "HORIZONTAL" },
            { shipId: 3, x: "A", y: 4, size: 2, direction: "HORIZONTAL" },
            { shipId: 4, x: "A", y: 5, size: 2, direction: "HORIZONTAL" },
            { shipId: 5, x: "A", y: 6, size: 2, direction: "HORIZONTAL" },
            { shipId: 6, x: "A", y: 7, size: 2, direction: "HORIZONTAL" },
            { shipId: 7, x: "A", y: 8, size: 2, direction: "HORIZONTAL" },
            { shipId: 8, x: "A", y: 9, size: 2, direction: "HORIZONTAL" },
            { shipId: 9, x: "A", y: 10, size: 2, direction: "HORIZONTAL" }
        ]
    )

    const handleShipConfig = (configuration: any) => {
        if (validateShipPlacement(configuration, shipConfigs)) {
            const newShipConfig = shipConfigs.map(ship => ship.shipId === configuration.shipId ? configuration : ship);
            setShipConfigs(newShipConfig);
            console.log('Ship configuration updated:', newShipConfig);
        } else {
            console.log('Invalid ship placement');
        }
    };
    

    const getShipPositions = (x: string, y: number, size: number, direction: string) => {
        let positions = [];
        const startX = x.charCodeAt(0) - 'A'.charCodeAt(0);
        const startY = y - 1;
    
        if (direction === "HORIZONTAL") {
            for (let i = 0; i < size; i++) {
                positions.push({ x: startX + i, y: startY });
            }
        } else { // VERTICAL
            for (let i = 0; i < size; i++) {
                positions.push({ x: startX, y: startY + i });
            }
        }
        return positions;
    };

    const validateShipPlacement = (newShipConfig: any, allShipsConfig: any[]) => {
        const newPositions = getShipPositions(newShipConfig.x, newShipConfig.y, newShipConfig.size, newShipConfig.direction);
        for (let pos of newPositions) {
            if (pos.x >= 10 || pos.y >= 10) {
                return false;
            }
            for (let config of allShipsConfig) {
                if (newShipConfig.shipId !== config.shipId) {
                    let existingPositions = getShipPositions(config.x, config.y, config.size, config.direction);
                    for (let existingPos of existingPositions) {
                        if (existingPos.x === pos.x && existingPos.y === pos.y) {
                            return false;
                        }
                    }
                }
            }
        }
        return true;
    };

    const renderMapGrid = () => {
        let grid = Array(10).fill(null).map(() => Array(10).fill(' '));
    
        shipConfigs.forEach(ship => {
            getShipPositions(ship.x, ship.y, ship.size, ship.direction).forEach(pos => {
                if (pos.x < 10 && pos.y < 10) {
                    grid[pos.y][pos.x] = '🚢';
                }
            });
        });
    
        return (
            <View style={styles.grid}>
                {grid.map((row, rowIndex) => (
                    <View key={rowIndex} style={styles.row}>
                        {row.map((cell, cellIndex) => (
                            <View key={cellIndex} style={[styles.cell, cell === '🚢' ? styles.ship : null]}>
                                <Text>
                                    {cell}
                                </Text>
                            </View>
                        ))}
                    </View>
                ))}
            </View>
        );
    };
    
    
    const styles = StyleSheet.create({
        grid: {
            flexDirection: 'column',
            backgroundColor: '#fff',
            borderColor: '#000',
            borderWidth: 1,
            width: 300,
            height: 300,
        },
        row: {
            flexDirection: 'row',
            flex: 1,
        },
        cell: {
            flex: 1,
            height: 30,
            borderWidth: 0.5,
            borderColor: '#ddd',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'transparent'
        },
        ship: {
            backgroundColor: '#b0c4de'
        }
    });

    const handleSendMapConfig = () => {
        if (gameContext.game) {
            sendMapConfiguration(auth.token, gameContext.game.id, shipConfigs)
            .then(() => {
                gameContext.getDetailsOfGame(route.params.gameId);
                setHasConfigured(true);
                Alert.alert("Configuration Sent", "Your configuration has been sent. Waiting for opponent.", [
                    { text: "OK" }
                ]);
            })
            .catch(error => {
                console.error("Error when sending map configuration:", error);
                Alert.alert("Error Sending Map Configuration", error.message, [
                    { text: "OK" }
                ]);
            });
        }
    };

    const handleStrike = (cell: ICell) => {
        if (gameContext.game && gameContext.game.status === 'ACTIVE' && gameContext.game.playerToMoveId === auth.id) {
            const cellSymbol = opponentShips[cell.y - 1][cell.x.charCodeAt(0) - 'A'.charCodeAt(0)];
            if (cellSymbol === 'X' || cellSymbol === 'O') {
                console.log('Cell already hit');
                return;
            }
    
            sendStrike(auth.token, gameContext.game.id, cell.x, cell.y)
                .then(() => {
                    console.log('Strike sent, updating game details...');
                    return gameContext.getDetailsOfGame(route.params.gameId);
                })
                .then(() => {
                    console.log('Game details updated, refreshing opponent ships...');
                    getOpponentShips();
                })
                .catch(error => {
                    console.error('Error sending strike:', error);
                });
        }
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
                            <View style={{ flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                                <TableHeader bgColor='#4CAF50'>
                                    <TableHeaderText>YOU</TableHeaderText>
                                </TableHeader>
                                <Table state={playerShips} />
                                <TableHeader bgColor='#FF4136'>
                                    <TableHeaderText>OPP</TableHeaderText>
                                </TableHeader>
                                <Table state={opponentShips} onCellClick={handleStrike} />
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
                            <ReplayButton onPress={handleReplay} disabled={isReplaying} style={{ opacity: isReplaying ? 0.5 : 1 }}>
                                <ButtonText>Replay</ButtonText>
                            </ReplayButton>
                        )
                    }               
                         
                    {
                        gameContext.game?.status === 'FINISHED' &&
                        (
                            <View style={{ flexDirection: 'column' }}>
                                <TableHeader bgColor='#4CAF50'>
                                    <TableHeaderText>P1</TableHeaderText>
                                </TableHeader>
                                <Table state={playerShipsReplay} />
                                <TableHeader bgColor='#FF4136'>
                                    <TableHeaderText>P2</TableHeaderText>
                                </TableHeader>
                                <Table state={opponentShipsReplay} />
                            </View>
                        )
                    }
                    {
                        (gameContext.game?.status === 'MAP_CONFIG') && hasConfigured &&
                        (
                            <PlayerToMoveContainer>
                                <PlayerToMoveText>Waiting for opponent to configure map</PlayerToMoveText>
                            </PlayerToMoveContainer>
                        )
                    }
                    {
                        (gameContext.game?.status === 'MAP_CONFIG') && (auth.id === gameContext.game?.player1Id || auth.id === gameContext.game?.player2Id) && (!hasConfigured) &&
                        (
                            <ConfigContainer>
                                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
                                    {renderMapGrid()}
                                </View>
                                <ShipConfig shipId={0} size={2} onConfigChange={handleShipConfig} />
                                <ShipConfig shipId={1} size={2} onConfigChange={handleShipConfig} />
                                <ShipConfig shipId={2} size={2} onConfigChange={handleShipConfig} />
                                <ShipConfig shipId={3} size={2} onConfigChange={handleShipConfig} />
                                <ShipConfig shipId={4} size={3} onConfigChange={handleShipConfig} />
                                <ShipConfig shipId={5} size={3} onConfigChange={handleShipConfig} />
                                <ShipConfig shipId={6} size={3} onConfigChange={handleShipConfig} />
                                <ShipConfig shipId={7} size={4} onConfigChange={handleShipConfig} />
                                <ShipConfig shipId={8} size={4} onConfigChange={handleShipConfig} />
                                <ShipConfig shipId={9} size={6} onConfigChange={handleShipConfig} />
                                <SendMapButton onPress={handleSendMapConfig}>
                                    <ButtonText>Send Configuration</ButtonText>
                                </SendMapButton>
                            </ConfigContainer>
                        )
                    }
                </ContentContainer>
            </StyledScrollView>
        </StyledSafeAreaView>
    );
}

export default () => (
    <GameContext>
        <TableScreen/>
    </GameContext>
);