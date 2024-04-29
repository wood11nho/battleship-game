import React from "react";
import styled from "styled-components/native";
import { Text } from "react-native";

const Container = styled.TouchableOpacity<{color: string}>`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    padding: 10px;
    border-bottom-width: 1px solid ${props => props.color};
    border-bottom-color: #000;
    border-radius: 5px;
`;

const StatusBox = styled.View<{ status: string }>`
    width: 115px;
    justify-content: center;
    align-items: center;
    background-color: ${props => getStatusColor(props.status)};
    padding: 5px 10px;
    border-radius: 5px;
`;

const getStatusColor = (status: string) => {
    switch (status) {
        case 'FINISHED':
            return '#A9A9A9'; // Grey
        case 'CREATED':
            return '#ADD8E6'; // Light Blue
        case 'ACTIVE':
            return '#90EE90'; // Light Green
        case 'MAP_CONFIG':
            return '#FFD700'; // Gold
        default:
            return '#FFFFFF'; // Default to white if unknown
    }
};

export interface IGameListItem{
    id: string;
    onPress?: () => void;
    status: string;

}

const GameListItem: React.FC<IGameListItem> = ({id, status, onPress}) => {
    return (
        <Container color="green" onPress={onPress}>
            <Text numberOfLines={1} ellipsizeMode="tail" style={{flex: 1, marginRight: 40}}>{id}</Text>
            <StatusBox status={status}>
                <Text>{status}</Text>
            </StatusBox>
        </Container>
    )
}

export default GameListItem;