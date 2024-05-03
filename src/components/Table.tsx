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
        case 'X':
            return '#FF4136';
        case 'm':
            return '#7FDBFF';
        case 'O':
            return '#2ECC40';
        default:
            return '#ffffff';
    }
};

const Cell = styled(TouchableOpacity)<{ cellType: string }>`
    width: 23px;
    height: 23px;
    justify-content: center;
    align-items: center;
    border-radius: 3.5px;
    background-color: ${props => getBackgroundColor(props.cellType)};
    border: 1px solid #ddd;
`;

const Row = styled.View`
    flex-direction: row;
`;

const Container = styled.View`
    flex-direction: column;
    align-items: center;
    justify-content: center;
`;

const Header = styled.View`
    flex-direction: row;
    padding-right: 23px;
`;

const Label = styled(Text)`
    width: 23px;
    height: 23px;
    line-height: 23px;
    text-align: center;
    font-size: 9px;
    font-family: Arial;
`;

const StyledText = styled(Text)`
    color: #333;
    font-size: 13px;
    font-family: Arial;
`;

const Table: React.FC<ITable> = React.memo(({ state, onCellClick }) => {
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

    return (
        <Container>
            <Header>
                <Label> </Label>
                {alphabet.slice(0, state[0].length).map((letter, index) => (
                    <Label key={index}>{letter}</Label>
                ))}
            </Header>
            {state.map((row, rowIndex) => (
                <Row key={rowIndex}>
                    <Label>{rowIndex + 1}</Label>
                    {row.map((cell, cellIndex) => (
                        <Cell
                            cellType={cell}
                            onPress={() => onCellClick && onCellClick({ x: alphabet[cellIndex], y: rowIndex + 1 })}
                            key={cellIndex}>
                            <StyledText>
                                {cell}
                            </StyledText>
                        </Cell>
                    ))}
                    <Label>{rowIndex + 1}</Label>
                </Row>
            ))}
            <Header>
                <Label> </Label>
            </Header>
        </Container>
    );
});

export default Table;