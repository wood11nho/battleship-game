import styled from "styled-components/native";
import { Picker } from "@react-native-picker/picker";
import React, { useEffect } from "react";
import { Text } from "react-native";

const ShipPosition = styled.View<{ length: number }>`
    width: 100%;
    height: 150px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
    border: 1px solid #ccc;
    border-radius: 5px;
    padding: 10px;
    background-color: #f0f0f0;
    overflow: hidden;
`;

const ShipDropdownXY = styled(Picker)`
    width: 25%;
    padding: 0px;
`;

const ShipDropdownDirection = styled(Picker)`
    width: 46%;
    padding: 0px;
`;

const ShipConfig: React.FC<{shipId: number, size: number, onConfigChange: any}> = ({shipId, size, onConfigChange}) => {
    const [x, setX] = React.useState<string>("A");
    const [y, setY] = React.useState<number>(1);
    const [direction, setDirection] = React.useState<string>("HORIZONTAL");

    const sendConfig = () => {
        const config = {
            shipId,
            x,
            y,
            size,
            direction
        }
        onConfigChange(config);
    }

    useEffect(() => {
        sendConfig();
    }, [x, y, direction]);

    async function onValueChangeX(value: string) {
        setX(value);
    }

    async function onValueChangeY(value: number) {
        setY(value);
    }

    async function onValueChangeDirection(value: string) {
        setDirection(value);
    }

    return (
        <ShipPosition length={size}>
            <Text>Size: {size}</Text>
            <ShipDropdownXY selectedValue={x} onValueChange={(itemValue: any) => {
                setX(itemValue);
            }
            }>
                <Picker.Item label="A" value="A" />
                <Picker.Item label="B" value="B" />
                <Picker.Item label="C" value="C" />
                <Picker.Item label="D" value="D" />
                <Picker.Item label="E" value="E" />
                <Picker.Item label="F" value="F" />
                <Picker.Item label="G" value="G" />
                <Picker.Item label="H" value="H" />
                <Picker.Item label="I" value="I" />
                <Picker.Item label="J" value="J" />
            </ShipDropdownXY>
            <ShipDropdownXY selectedValue={y} onValueChange={(itemValue: any) => {
                setY(itemValue);
            }
            }>
                <Picker.Item label="1" value={1} />
                <Picker.Item label="2" value={2} />
                <Picker.Item label="3" value={3} />
                <Picker.Item label="4" value={4} />
                <Picker.Item label="5" value={5} />
                <Picker.Item label="6" value={6} />
                <Picker.Item label="7" value={7} />
                <Picker.Item label="8" value={8} />
                <Picker.Item label="9" value={9} />
                <Picker.Item label="10" value={10} />
            </ShipDropdownXY>
            <ShipDropdownDirection selectedValue={direction} onValueChange={(itemValue: any) => {
                setDirection(itemValue);
            }
            }>
                <Picker.Item label="Vertical" value="VERTICAL" />
                <Picker.Item label="Horizontal" value="HORIZONTAL" />
            </ShipDropdownDirection>
        </ShipPosition>
    );
}

export default ShipConfig;