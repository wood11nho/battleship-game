import { createContext, useContext, useState } from "react";
import { getDetailsOfGame } from "../api";
import { useAuth } from "./authContext";

enum GameStatus{
    CREATED = "CREATED",
    MAP_CONFIG = "MAP_CONFIG",
    ACTIVE = "ACTIVE",
    FINISHED = "FINISHED"
}

interface Move{
    gameId: string;
    id: string;
    playerId: string;
    result: boolean;
    x: string;
    y: number;
}

interface ShipCoord{
    gameId: string;
    hit: boolean;
    id: string;
    playerId: string;
    x: string;
    y: number;
}

interface User{
    id: string;
    email: string;
}

interface Game{
    id: string;
    status: GameStatus;
    player1Id: string;
    player2Id: string;
    player1: User;
    player2: User;
    playerToMoveId: string;
    moves: Move[];
    shipsCoord?: ShipCoord[];
}

interface IGameContext{
    game: Game | null;
    getDetailsOfGame: (id: string) => Promise<void>;
}

const Context = createContext<IGameContext>(
    {
        getDetailsOfGame: () => Promise.resolve(),
        game: null
    }
)

export const GameContext: React.FC<{children: React.ReactNode}> = ({children}) => {
    const [game, setGame] = useState<Game | null>(null);
    const auth = useAuth();

    const handleGetDetailsOfGame = async (id: string) => {
        try {
            const game = await getDetailsOfGame(auth.token, id);
            setGame(game);
        } catch (error) {
            console.log(error);
        }
    }
    
    return (
        <Context.Provider value = {{getDetailsOfGame: handleGetDetailsOfGame, game}}>
            {children}
        </Context.Provider>
    )
}

export const useGameContext = () => useContext(Context);