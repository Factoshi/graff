# Graff

Graff is a GraphQL wrapper for the factomd RPC API - it allows a client to query factomd using GraphQL.

## Requirements

-   Either Docker or Node.js 12 or higher.
-   A running factomd instance.

## Installation

### Docker (recommended)

Simple installation (can be configured with environment variables, see below). Replace `FACTOMD_HOST` environment variable with the URI of your factomd instance.

```
docker run -d --name graff -p 8032:8032 -e FACTOMD_HOST=factomd factoshi/graff:latest
```

And that's it!

### Node

Clone this repo and cd into the project.

```
git clone https://github.com/Factoshi/graff.git
cd graff
```

Install and compile.

```
npm install --production
npm run build
```

Run it using default configuration (see below for config options).

```
NODE_ENV=production node build/index.js
```

## Configuration

Graff comes with extensive configuration options that are all delivered using environment variables. Note: defaults are for production environments (i.e. where NODE_ENV=production), and may vary for non-production environments.

### Factomd

| Variable         | Description                                       | Default   |
| ---------------- | ------------------------------------------------- | --------- |
| FACTOMD_HOST     | Host of the factomd instance.                     | localhost |
| FACTOMD_PORT     | Port of the factomd API.                          | 8088      |
| FACTOMD_PATH     | Path to the factomd v2 API.                       | /v2       |
| FACTOMD_PROTOCOL | Protocol to connect to API. Can be http or https. | http      |
| FACTOMD_USER     | User for RPC authentication.                      |           |
| FACTOMD_PASSWORD | Password for RPC authentication.                  |           |

### Redis

Graff uses an in-memory LRU cache to speed up requests and reduce load on factomd. If you are using multiple Graff instances, they are able to share the same Redis cache to save memory.

| Variable       | Description                        | Default   |
| -------------- | ---------------------------------- | --------- |
| REDIS_HOST     | Host of the redis instance.        | localhost |
| REDIS_PORT     | Port of the redis instance.        | 6379      |
| REDIS_PASSWORD | Password for Redis authentication. |           |
| REDIS_FAMILY   | IP version to use. Can be 4 or 6.  | 4         |
| REDIS_DB       | Database to connect to.            | 0         |

### GraphQL Server

| Variable       | Description                          | Default |
| -------------- | ------------------------------------ | ------- |
| GQL_PLAYGROUND | Boolean to enable GQL playground.    | false   |
| GQL_INTROSPEC  | Boolean to enable introspection.     | false   |
| GQL_PORT       | Port where the server should listen. | 8032    |

### DoS protection

GraphQL is vulnerable to DoS attacks via malicious queries. These variables let you configure the DoS protection settings.

| Variable        | Description                                                                                                                 | Default |
| --------------- | --------------------------------------------------------------------------------------------------------------------------- | ------- |
| MAX_PAGE_LENGTH | Maximum page length for paginated types.                                                                                    | 150     |
| MAX_QUERY_DEPTH | Maximum query depth (i.e. limit of nested queries).                                                                         | 7       |
| MAX_COMPLEXITY  | Maximum query complexity. See [this repo](https://github.com/4Catalyzer/graphql-validation-complexity) for more information | 1500    |
