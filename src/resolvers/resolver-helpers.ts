export const handleBlockApiError = (error: Error) => {
    if (error.message.endsWith('Block not found (code: -32008)')) {
        return null;
    } else {
        throw error;
    }
};

export const testPaginationInput = (offset: number, first: number) => {
    if (offset! < 0 || !Number.isInteger(offset!)) {
        throw new Error('`offset` must be a positive integer.');
    }
    if (first! < 0 || (first !== Infinity && !Number.isInteger(first!))) {
        throw new Error('`first` must be a positive integer.');
    }
};
