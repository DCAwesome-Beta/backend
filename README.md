# API Reference

This document provides detailed information about the available DCAwesome API endpoints and their usage for Circle SDK based Developer Controlled Wallets.

## Table of Contents
- [Authentication](#authentication)
- [Users](#users)
- [Wallets](#wallets)
- [Transactions](#transactions)
- [Tokens](#tokens)
- [Faucet](#faucet)

## Authentication

Some endpoints require authentication. These endpoints are prefixed with `auth` in their router configurations. Include your authentication token in the request header.

## Users

### Sign Up
```http
POST /users/signup
```

Create a new user account.

**Request Body:**
- `email` (string, required): Valid email address
- `password` (string, required): User password

### Sign In
```http
POST /users/signin
```

Authenticate a user and receive an access token.

**Request Body:**
- `email` (string, required): User's email address
- `password` (string, required): User's password

### Set DCA In
```http
POST /users/setDCAin
```
Requires authentication.

Configure DCA (Dollar Cost Average) input settings.

**Request Body:**
- `inTokens` (array of strings, required): Array of input token addresses for DCAin
- `inMaxTokenCap` (array of numbers, required): Array of maximum token caps which can be used by the strategy.
- `triggerToken` (string, required): Token identifier for triggering DCA Strategy.

### Set DCA Out
```http
POST /users/setDCAout
```
Requires authentication.

Configure DCA output settings.

**Request Body:**
- `outToken` (string, required): Output token address
- `outChain` (string, required): Output blockchain's chainId

## Wallets

### List Wallets
```http
GET /wallets
```
Requires authentication.

**Query Parameters:**
- `address` (string, optional): Filter by wallet address
- `blockchain` (string, optional): Filter by blockchain
- `walletSetId` (string, optional): Filter by wallet set ID
- `refId` (string, optional): Filter by reference ID
- `from` (date, optional): Start date for filtering
- `to` (date, optional): End date for filtering
- `pageBefore` (string, optional): Pagination cursor for previous page
- `pageAfter` (string, optional): Pagination cursor for next page
- `pageSize` (number, optional): Number of items per page

### Get Wallet
```http
GET /wallets/:id
```

Retrieve details for a specific wallet.

**Path Parameters:**
- `id` (string, required): Wallet identifier

### Create Wallet
```http
POST /wallets
```
Requires authentication.

**Request Body:**
- `blockchain` (string, required): Target blockchain for the new wallet

### Create Wallet Set
```http
POST /wallets/set
```
Requires authentication.

**Request Body:**
- `name` (string, required): Name for the wallet set

### Get Wallet Token Balance
```http
GET /wallets/:id/balances
```

**Path Parameters:**
- `id` (string, required): Wallet identifier

**Query Parameters:**
- `includeAll` (boolean, optional): Include all tokens
- `name` (string, optional): Filter by token name
- `tokenAddresses` (array of strings, optional): Filter by token addresses
- `standard` (string, optional): Filter by token standard
- `from` (date, optional): Start date
- `to` (date, optional): End date
- `pageBefore` (string, optional): Pagination cursor for previous page
- `pageAfter` (string, optional): Pagination cursor for next page
- `pageSize` (number, optional): Number of items per page

## Transactions

### List Transactions
```http
GET /transactions
```
Requires authentication.

**Query Parameters:**
- `blockchain` (string, optional): Filter by blockchain
- `custodyType` (string, optional): Filter by custody type
- `destinationAddress` (string, optional): Filter by destination address
- `includeAll` (boolean, optional): Include all transactions
- `operation` (string, optional): Filter by operation type
- `state` (string, optional): Filter by transaction state
- `txHash` (string, optional): Filter by transaction hash
- `txType` (string, optional): Filter by transaction type
- `walletIds` (array of strings, optional): Filter by wallet IDs
- `from` (date, optional): Start date
- `to` (date, optional): End date
- `pageBefore` (string, optional): Pagination cursor for previous page
- `pageAfter` (string, optional): Pagination cursor for next page
- `pageSize` (number, optional): Number of items per page

### Get Transaction
```http
GET /transactions/:id
```
Requires authentication.

**Path Parameters:**
- `id` (string, required): Transaction identifier

**Query Parameters:**
- `txType` (string, optional): Filter by transaction type

### Transfer Tokens
```http
POST /transactions/transfer
```
Requires authentication.

**Request Body:**
- `idempotencyKey` (string, optional): UUID v4 for ensuring exactly-once execution
- `amount` (string, required): Transfer amount
- `destinationAddress` (string, required): Destination address
- `feeLevel` (string, optional): Fee level (LOW, MEDIUM, or HIGH)
- `gasLimit` (string, optional): Gas limit
- `gasPrice` (string, optional): Gas price
- `maxFee` (string, optional): Maximum fee
- `priorityFee` (string, optional): Priority fee
- `nftTokenIds` (array of strings, optional): NFT token IDs for transfer
- `refId` (string, optional): Reference identifier
- `tokenId` (string, required): Token identifier
- `walletId` (string, required): Source wallet identifier

### Estimate Transfer Fee
```http
POST /transactions/transfer/estimateFee
```
Requires authentication.

**Request Body:**
- `amount` (array of strings, required): Transfer amounts
- `destinationAddress` (string, required): Destination address
- `nftTokenIds` (array of strings, optional): NFT token IDs
- `sourceAddress` (string, optional): Source address
- `tokenId` (string, required): Token identifier
- `walletId` (string, optional): Wallet identifier

### Execute Contract
```http
POST /transactions/contract
```
Requires authentication.

**Request Body:**
- `amount` (string, optional): Amount to send
- `contractAddress` (string, required): Contract address
- `feeLevel` (string, optional): Fee level
- `gasLimit` (string, optional): Gas limit
- `gasPrice` (string, optional): Gas price
- `maxFee` (string, optional): Maximum fee
- `priorityFee` (string, optional): Priority fee
- `walletId` (string, required): Wallet identifier
- `abiFunctionSignature` (string, required): Function signature
- `abiParameters` (array, optional): Function parameters

### Estimate Contract Execution Fee
```http
POST /transactions/contract/estimateFee
```
Requires authentication.

**Request Body:**
- `contractAddress` (string, required): Contract address
- `abiFunctionSignature` (string, required): Function signature
- `abiParameters` (array, optional): Function parameters
- `walletId` (string, required): Wallet identifier

### Validate Address
```http
POST /transactions/validateAddress
```

**Request Body:**
- `address` (string, required): Address to validate
- `blockchain` (string, required): Blockchain network

## Tokens

### Get Token Details
```http
GET /tokens/:id
```

Retrieve details for a specific token.

**Path Parameters:**
- `id` (string, required): Token identifier

## Faucet

### Request Testnet Tokens
```http
POST /faucet/drips
```

Request testnet tokens for testing purposes.

**Request Body:**
- `address` (string, required): Destination wallet address
- `blockchain` (string, required): Target blockchain network

## Response Formats

All successful responses will return data in JSON format. For detailed response schemas, please refer to the Circle W3S API documentation at https://developers.circle.com/w3s/reference for most of the routes.

## Error Handling

The API uses standard HTTP status codes and returns error messages in JSON format. All endpoints validate request parameters using Yup schemas and will return appropriate validation errors if the request does not meet the specified criteria.