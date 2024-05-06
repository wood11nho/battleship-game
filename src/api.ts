const baseUrl = 'http://163.172.177.98:8081'
const baseHeaders = {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
}

export const login = async (email: string, password: string): Promise<string> => {
    const result = await fetch(`${baseUrl}/auth/login`, {
        method: 'POST',
        headers: {
            ...baseHeaders
        },
        body: JSON.stringify({ email, password })
    })

    const data = await result.json();
    return data.accessToken;
};

export const register = async (email: string, password: string) => {
    const result = await fetch(`${baseUrl}/auth/register`, {
        method: 'POST',
        headers: {
            ...baseHeaders
        },
        body: JSON.stringify({ email, password })
    })

    const data = await result.json();
    return data.accessToken;
};

export const listGames = async (token: string) => {
    const result = await fetch(`${baseUrl}/game`, {
        method: 'GET',
        headers: {
            ...baseHeaders,
            'Authorization': `Bearer ${token}`
        }
    });

    if (!result.ok) {
        throw new Error('Failed to fetch games');
    }

    const data = await result.json();
    // console.log(data);
    return data["games"];
};


export const createGame = async (token: string) => {
    const result = await fetch(`${baseUrl}/game`, {
        method: 'POST',
        headers: {
            ...baseHeaders,
            'Authorization': `Bearer ${token}`
        }
    })

    const data = await result.json();
    // console.log(data);
    return data;
}

export const getDetailsOfGame = async (token: string, gameId: string) => {
    const result = await fetch(`${baseUrl}/game/${gameId}`, {
        method: 'GET',
        headers: {
            ...baseHeaders,
            'Authorization': `Bearer ${token}`
        }
    })

    const data = await result.json();
    console.log(data);
    return data;
}

export const joinGame = async (token: string, gameId: string) => {
    const result = await fetch(`${baseUrl}/game/join/${gameId}`, {
        method: 'POST',
        headers: {
            ...baseHeaders,
            'Authorization': `Bearer ${token}`
        }
    });

    if (!result.ok) {
        const errorData = await result.json();
        throw new Error(errorData.message || "Failed to join the game.");
    }

    const data = await result.json();
    // console.log(data);
    return data;
}

export const getUserDetails = async (token: string) => {
    const result = await fetch(`${baseUrl}/user/details/me`, {
        method: 'GET',
        headers: {
            ...baseHeaders,
            'Authorization': `Bearer ${token}`
        }
    })

    const data = await result.json();
    // console.log(data);
    return data;
}

export const sendMapConfiguration = async (token: string, gameId: string, mapConfiguration: any) => {
    const ships = mapConfiguration.map((ship: any) => {
        return {
            x: ship.x,
            y: ship.y,
            size: ship.size,
            direction: ship.direction
        }
    });

    const result = await fetch(`${baseUrl}/game/${gameId}`, {
        method: 'PATCH',
        headers: {
            ...baseHeaders,
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ ships })
    });

    const data = await result.json();
    // console.log(data);
    return data;
}

export const sendStrike = async (token: string, gameId: string, x: string, y: number) => {
    const result = await fetch(`${baseUrl}/game/strike/${gameId}`, {
        method: 'POST',
        headers: {
            ...baseHeaders,
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ x, y })
    });

    const data = await result.json();
    if (result.ok) {
        console.log(data);
        return data;
    } else {
        throw new Error(data.message);
    }
}