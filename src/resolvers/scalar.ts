import { GraphQLScalarType } from 'graphql';
import { isValidPublicFctAddress, isValidPublicEcAddress } from 'factom';

type Test = (val: any) => boolean;

export const createTest = <T>(test: Test, err: Error) => (val: T) => {
    if (test(val)) {
        return val;
    }
    throw err;
};

//////////////////////////
//      HASH SCALAR     //
//////////////////////////
export const hashError = new TypeError('Hash cannot represent an invalid SHA256 string.');
const sha256Regex = /^[A-Fa-f0-9]{64}$/g;
export const sha256Test = createTest<string>(
    val => typeof val === 'string' && sha256Regex.test(val),
    hashError
);

export const Hash = new GraphQLScalarType({
    name: 'Hash',
    description: 'A SHA256 hash.',
    serialize: sha256Test,
    parseValue: sha256Test,
    parseLiteral: (ast: any) => sha256Test(ast.val)
});

//////////////////////////////////////////
//      PUBLICFACTOIDADDRESS SCALAR     //
/////////////////////////////////////////
export const publicFactoidAddressError = new TypeError(
    'PublicFactoidAddress must be a valid public factoid address.'
);

export const publicFactoidAddressTest = createTest<string>(
    val => typeof val === 'string' && isValidPublicFctAddress(val),
    publicFactoidAddressError
);

export const PublicFactoidAddress = new GraphQLScalarType({
    name: 'PublicFactoidAddress',
    description: 'A valid public factoid address.',
    serialize: publicFactoidAddressTest,
    parseValue: publicFactoidAddressTest,
    parseLiteral: (ast: any) => publicFactoidAddressTest(ast.val)
});

//////////////////////////////////////////////
//      PUBLICENTRYCREDITADDRESS SCALAR     //
/////////////////////////////////////////////
export const publicEntryCreditAddressError = new TypeError(
    'PublicEntryCreditAddress must be a valid public entry credit address.'
);

export const publicEntryCreditAddressTest = createTest<string>(
    (val: string) => typeof val === 'string' && isValidPublicEcAddress(val),
    publicEntryCreditAddressError
);

export const PublicEntryCreditAddress = new GraphQLScalarType({
    name: 'PublicEntryCreditAddress',
    description: 'A valid public entry credit address.',
    serialize: publicEntryCreditAddressTest,
    parseValue: publicEntryCreditAddressTest,
    parseLiteral: (ast: any) => publicEntryCreditAddressTest(ast.val)
});

////////////////////////////
//      HEIGHT SCALAR     //
////////////////////////////
export const heightError = new TypeError('Height must be a positive integer.');

export const heightTest = createTest<number>(
    val => typeof val === 'number' && val >= 0 && Number.isInteger(val),
    heightError
);

export const Height = new GraphQLScalarType({
    name: 'Height',
    description: 'A positive integer.',
    serialize: heightTest,
    parseValue: heightTest,
    parseLiteral: (ast: any) => heightTest(ast.val)
});
