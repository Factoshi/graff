import { GraphQLScalarType } from 'graphql';
import { isValidPublicFctAddress, isValidPublicEcAddress } from 'factom';

/**
 * Higher order function to create string testing functions.
 * @param test Function to test a string type.
 * @param err Error thrown on test failure.
 */
export const createStringTest = (test: (str: string) => boolean, err: Error) => (
    val: string
) => {
    if (typeof val === 'string' && test(val)) {
        return val;
    }
    throw err;
};

// Create Hash scalar
export const hashError = new Error('Hash cannot represent an invalid SHA256 string.');
const sha256Regex = /^[A-Fa-f0-9]{64}$/g;
export const sha256Test = createStringTest(sha256Regex.test.bind(sha256Regex), hashError);

export const Hash = new GraphQLScalarType({
    name: 'Hash',
    description: 'A SHA256 hash.',
    serialize: sha256Test,
    parseValue: sha256Test,
    parseLiteral: (ast: any) => sha256Test(ast.val)
});

// Create PublicFactoidAddress scalar
export const publicFactoidAddressError = new Error(
    'PublicFactoidAddress must be a valid public factoid address.'
);

export const publicFactoidAddressTest = createStringTest(
    isValidPublicFctAddress,
    publicFactoidAddressError
);

export const PublicFactoidAddress = new GraphQLScalarType({
    name: 'PublicFactoidAddress',
    description: 'A valid public factoid address.',
    serialize: publicFactoidAddressTest,
    parseValue: publicFactoidAddressTest,
    parseLiteral: (ast: any) => publicFactoidAddressTest(ast.val)
});

// create PublicEntryCreditAddress scalar
export const publicEntryCreditAddressError = new Error(
    'PublicEntryCreditAddress must be a valid public entry credit address.'
);

export const publicEntryCreditAddressTest = createStringTest(
    isValidPublicEcAddress,
    publicEntryCreditAddressError
);

export const PublicEntryCreditAddress = new GraphQLScalarType({
    name: 'PublicEntryCreditAddress',
    description: 'A valid public entry credit address.',
    serialize: publicEntryCreditAddressTest,
    parseValue: publicEntryCreditAddressTest,
    parseLiteral: (ast: any) => publicEntryCreditAddressTest(ast.val)
});
