export const booleanConverter = (value: string) => {
    switch (value) {
        case 'true':
        case '1':
            return true;
        case 'false':
        case '0':
            return false;
    }
};
