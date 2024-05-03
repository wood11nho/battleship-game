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
        // If the server responded with a non-2xx status, handle it as an error
        const errorData = await result.json(); // Assuming the server sends back a JSON with error details
        throw new Error(errorData.message || "Failed to join the game.");
    }

    const data = await result.json();
    console.log(data);
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