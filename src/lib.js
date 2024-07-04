const sessionData = {};

export async function getUserData(userId) {
    sessionData.userId = userId;

    const username = await fetchFromApi(`user ${userId}`);
    sessionData.username = username;

    const email = await fetchFromApi(`${userId}@email.test`);
    sessionData.email = email;

    return sessionData;
}

// this function is used to simulate a potential api fetch
// (which returns the result)
async function fetchFromApi(result) {
    const fetchDuration = Math.floor(Math.random() * 500);
    return await new Promise((resolve) => {
        setTimeout(() => {
            resolve(result);
        }, fetchDuration);
    });
}