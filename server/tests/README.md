# API Tests

This directory contains tests for the Oddballs API server.

## Running the Tests

1. Make sure the server is running:
   ```
   cd server
   node index.js
   ```

2. In a separate terminal, run the tests:
   ```
   cd server
   npm test
   ```

## Test Coverage

The tests cover the following API endpoints:

- GET `/api/oddballs` - Retrieves a list of contacts
- GET `/api/oddballs?offset=X` - Retrieves a paginated list of contacts
- GET `/api/search?q=X` - Searches for contacts by name
- PUT `/api/oddballs/:id` - Updates a contact

## Notes

- The tests assume the server is running on `http://localhost:3001`
- The tests use real data from the database, so they may fail if the database is empty
- The tests are designed to be non-destructive (they don't delete any data)