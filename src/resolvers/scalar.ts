import { GraphQLScalarType, Kind } from 'graphql';
import { isValidPublicFctAddress, isValidPublicEcAddress } from 'factom';

export const createTest = <T>(test: (val: T) => boolean, err: Error) => (val: T) => {
    if (test(val)) {
        return val;
    }
    throw err;
};

//////////////////////////
//      HASH SCALAR     //
//////////////////////////
export const hashError = new TypeError('Hash must be a valid SHA256 string.');
export const sha256Test = createTest(
    (val: string) => typeof val === 'string' && /^[A-Fa-f0-9]{64}$/g.test(val),
    hashError
);

export const Hash = new GraphQLScalarType({
    name: 'Hash',
    description: 'A SHA256 hash.',
    serialize: sha256Test,
    parseValue: sha256Test,
    parseLiteral: (ast: any) => {
        if (ast.kind === Kind.STRING) {
            return sha256Test(ast.value);
        }
        throw hashError;
    }
});

//////////////////////////////////////////
//      PUBLICFACTOIDADDRESS SCALAR     //
/////////////////////////////////////////
export const publicFactoidAddressError = new TypeError(
    'PublicFactoidAddress must be a valid public factoid address.'
);

export const publicFactoidAddressTest = createTest(
    (val: string) => typeof val === 'string' && isValidPublicFctAddress(val),
    publicFactoidAddressError
);

export const PublicFactoidAddress = new GraphQLScalarType({
    name: 'PublicFactoidAddress',
    description: 'A valid public factoid address.',
    serialize: publicFactoidAddressTest,
    parseValue: publicFactoidAddressTest,
    parseLiteral: (ast: any) => {
        if (ast.kind === Kind.STRING) {
            return publicFactoidAddressTest(ast.value);
        }
        throw publicEntryCreditAddressError;
    }
});

//////////////////////////////////////////////
//      PUBLICENTRYCREDITADDRESS SCALAR     //
/////////////////////////////////////////////
export const publicEntryCreditAddressError = new TypeError(
    'PublicEntryCreditAddress must be a valid public entry credit address.'
);

export const publicEntryCreditAddressTest = createTest(
    (val: string) => typeof val === 'string' && isValidPublicEcAddress(val),
    publicEntryCreditAddressError
);

export const PublicEntryCreditAddress = new GraphQLScalarType({
    name: 'PublicEntryCreditAddress',
    description: 'A valid public entry credit address.',
    serialize: publicEntryCreditAddressTest,
    parseValue: publicEntryCreditAddressTest,
    parseLiteral: (ast: any) => {
        if (ast.kind === Kind.STRING) {
            return publicEntryCreditAddressTest(ast.value);
        }
        throw publicEntryCreditAddressError;
    }
});

////////////////////////////
//      HEIGHT SCALAR     //
////////////////////////////
export const heightError = new TypeError('Height must be a positive integer.');

export const heightTest = createTest((val: number) => val >= 0, heightError);

export const Height = new GraphQLScalarType({
    name: 'Height',
    description: 'A positive integer.',
    serialize: heightTest,
    parseValue: heightTest,
    parseLiteral: (ast: any) => {
        if (ast.kind === Kind.INT) {
            return heightTest(parseInt(ast.value));
        }
        throw heightError;
    }
});
