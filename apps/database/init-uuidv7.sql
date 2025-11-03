-- Initialize UUIDv7 extension for PostgreSQL
-- This script is automatically run when the container starts

-- Create the pg_uuidv7 extension
CREATE EXTENSION IF NOT EXISTS pg_uuidv7;

-- Test that the extension is working
DO $$
BEGIN
    -- Test the uuid_generate_v7 function
    PERFORM uuid_generate_v7();
    RAISE NOTICE 'UUIDv7 extension successfully loaded and tested';
EXCEPTION
    WHEN OTHERS THEN
        RAISE WARNING 'Failed to load UUIDv7 extension: %', SQLERRM;
END
$$;