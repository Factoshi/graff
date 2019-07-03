export const testPaginationInput = (offset: number, first: number) => {
    if (offset! < 0 || !Number.isInteger(offset!)) {
        throw new Error('`offset` must be a positive integer.');
    }
    if (first! < 0 || (first !== Infinity && !Number.isInteger(first!))) {
        throw new Error('`first` must be a positive integer.');
    }
};

export const handleBlockError = (error: Error) => {
    if (error.message.endsWith('Block not found (code: -32008)')) {
        return null;
    }
    throw error;
};

export const handleTransactionError = (error: Error) => {
    if (error.message.startsWith('No Transaction with ID')) {
        return null;
    }
    throw error;
};

export const handleEntryError = (error: Error) => {
    if (error.message.endsWith('Receipt creation error (code: -32010)')) {
        return null;
    }
    throw error;
};

export const handleChainHeadError = (error: Error) => {
    if (error.message.endsWith('Missing Chain Head (code: -32009)')) {
        return null;
    }
    throw error;
};
