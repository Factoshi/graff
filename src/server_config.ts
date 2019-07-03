import { Config } from 'apollo-server';
import { GraphQLError } from 'graphql';

export const engine: Config['engine'] = {
    // TODO: remove manual error handling from custom types.
    // TODO: check whether engine applies to non-Apollo Engine servers
    rewriteError(error: GraphQLError) {
        if (error.message.endsWith('Block not found (code: -32008)')) {
            return null;
        }
        // Error thrown for unfound entry.
        if (error.message.endsWith('Receipt creation error (code: -32010)')) {
            return null;
        }
        return error;
    }
};
