import React from 'react';
import styled from 'styled-components/native';
import { Text, TouchableOpacity} from 'react-native';

interface ITable {
    state: string[][];
    onCellClick?: (cell: ICell) => void;
}

export interface ICell {
    x: string;
    y: number;
}

const getBackgroundColor = (cell: string) => {
    switch (cell) {
        case 'hit':
            return '#ff6347';
        case 'miss':
            return '#b0c4de';
        case 'ship':
            return '#4682b4';
        default:
            return '#ffffff';
    }
};

const Cell = styled(TouchableOpacity)<{ cellType: string }>`
    width: 30px;
    height: 30px;
    justify-content: center;
    align-items: center;
    border-radius: 5px;
    background-color: ${props => getBackgroundColor(props.cellType)};
    border: 1px solid #ddd;
`;

const Row = styled.View`
    flex-direction: row;
`;

const Container = styled.View`
    flex-direction: column;
    align-items: center;
`;

const Header = styled.View`
    flex-direction: row;
    padding-right: 30px;
`;

const Label = styled(Text)`
    width: 30px;
    height: 30px;
    line-height: 30px;
    text-align: center;
    font-size: 12px;
    font-family: Arial;
`;

const Table: React.FC<ITable> = ({ state, onCellClick }) => {
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

    return (
        <Container>
            <Header>
                <Label><Text> </Text></Label>
                {alphabet.slice(0, state[0].length).map((letter, index) => (
                    <Label key={index}><Text>{letter}</Text></Label>
                ))}
            </Header>
            {state.map((row, rowIndex) => (
                <Row key={rowIndex}>
                    <Label><Text>{rowIndex + 1}</Text></Label>
                    {row.map((cell, cellIndex) => (
                        <Cell
                            cellType={cell}
                            onPress={() => onCellClick && onCellClick({ x: alphabet[cellIndex], y: rowIndex + 1 })}
                            key={cellIndex}
                        >
                            <Text style={{ color: '#333', fontSize: 16, fontFamily: 'Arial' }}>
                                {cell === 'hit' ? '✖' : cell === 'miss' ? '•' : ''}
                            </Text>
                        </Cell>
                    ))}
                    <Label><Text>{rowIndex + 1}</Text></Label>
                </Row>
            ))}
            <Header>
                <Label><Text> </Text></Label>
                {alphabet.slice(0, state[0].length).map((letter, index) => (
                    <Label key={index}><Text>{letter}</Text></Label>
                ))}
            </Header>
        </Container>
    );
}

export default Table;