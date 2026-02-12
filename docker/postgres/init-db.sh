#!/bin/bash
set -e

echo "Initializing databases..."

psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "postgres" <<-EOSQL
    SELECT 'CREATE DATABASE "$POSTGRES_DB"'
    WHERE NOT EXISTS (
        SELECT FROM pg_database WHERE datname = '$POSTGRES_DB'
    )\\gexec

    SELECT 'CREATE DATABASE todo_test'
    WHERE NOT EXISTS (
        SELECT FROM pg_database WHERE datname = 'todo_test'
    )\\gexec
EOSQL

echo "✅ Databases initialized: $POSTGRES_DB, todo_test"
