import React, { useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text } from 'react-native';
import styled from 'styled-components/native';
import { useRoute } from '@react-navigation/native';
import { GameContext, useGameContext } from '../../hooks/gameContext';
import Table from '../../components/Table';

const StyledSafeAreaView = styled(SafeAreaView)`
    flex: 1;
    background-color: #f0f8ff;
    align-items: center;
    justify-content: center;
`;

const Heading = styled(Text)`
    color: #2e4c6d;
    font-size: 24px;
    font-weight: bold;
    margin-bottom: 20px;
`;

const TableScreen = () => {
    const route = useRoute<any>();
    const game = useGameContext();

    console.log('game: ', game);

    useEffect(() => {
        if (route.params && route.params.gameId) {
            game.getDetailsOfGame(route.params.gameId);
        }
    }, [route.params.gameId]);

    return (
        <StyledSafeAreaView>
            <Heading>Game Table</Heading>
            <Table state={[
                ['','','','','','','','','',''],
                ['','','','','','','','','',''],
                ['','','','','','','','','',''],
                ['','','','','','','','','',''],
                ['','','','','','','','','',''],
                ['','','','','','','','','',''],
                ['','','','','','','','','',''],
                ['','','','','','','','','',''],
                ['','','','','','','','','',''],
                ['','','','','','','','','','']
            ]} onCellClick={() => {}} />
        </StyledSafeAreaView>
    );
}

export default () => (
    <GameContext>
        <TableScreen />
    </GameContext>
);