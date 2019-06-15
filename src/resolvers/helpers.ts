export const handleBlockApiError = (error: Error) => {
    if (error.message.endsWith('Block not found (code: -32008)')) {
        return null;
    } else {
        throw error;
    }
};
