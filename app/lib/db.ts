import postgres from 'postgres';

// PostgreSQL connection
const sql = postgres(process.env.DATABASE_URL || 'postgres://postgres:postgres@localhost:5432/postgres');

export default sql; 