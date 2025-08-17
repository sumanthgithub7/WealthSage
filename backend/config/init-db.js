const { pool } = require('../config/database');

async function initializeDatabase() {
  try {
    // Create users table if not exists
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS users (
        uid VARCHAR(128) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        role VARCHAR(50) DEFAULT 'user',
        photo_url TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        last_login TIMESTAMP,
        INDEX idx_email (email),
        INDEX idx_role (role)
      );
    `);

    console.log('✅ Database tables initialized successfully');
  } catch (error) {
    console.error('❌ Error initializing database tables:', error);
    process.exit(1);
  }
}

module.exports = { initializeDatabase };
