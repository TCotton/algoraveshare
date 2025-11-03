# run this single command to create all tables fresh:
docker exec algoraveshare-db psql -U postgres -d testDB -c "DROP SCHEMA public CASCADE; CREATE SCHEMA public;"

# Then run npm run db:push and type y when prompted. This will give Drizzle a clean slate to create all tables properly.

# Start the database
cd apps/database && docker-compose up -d

# Check database connection
npm run db:check

# Push schema changes
npm run db:push

# Seed the database
npm run db:seed

# Stop the database
docker-compose down

# View database in Adminer
# Open http://localhost:8080 in your browser

Adminer Access:
You can access the database through Adminer at http://localhost:8080 with these credentials:

Server: db
Username: postgres
Password: postgres
Database: testDB