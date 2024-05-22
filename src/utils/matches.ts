export const encryptMatch = (id: number): string => {
    return `${process.env.DEFAULT_TOKEN}${id}${process.env.DEFAULT_TOKEN}`;
};

export const desencryptMatch = (match: string) => {
    const matchId = match
        .replace(process.env.DEFAULT_TOKEN as string, '')
        .replace(process.env.DEFAULT_TOKEN?.toUpperCase() as string, '');

    return parseInt(matchId);
};
