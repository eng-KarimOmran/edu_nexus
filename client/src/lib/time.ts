let offset = 0;

export const setServerTime = (serverTime: number) => {
    offset = serverTime - Date.now();
};

export const now = () => {
    return new Date(Date.now() + offset);
};