const express = require('express');
const ExcelJS = require('exceljs');
const router = express.Router();

/**
 * User schema for MySQL:
 * CREATE TABLE users (
 *   uid VARCHAR(128) PRIMARY KEY,
 *   name VARCHAR(255) NOT NULL,
 *   email VARCHAR(255) UNIQUE NOT NULL,
 *   role VARCHAR(50) DEFAULT 'user',
 *   photo_url TEXT,
 *   created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
 *   last_login TIMESTAMP
 * );
 */

// Store user data in SQL database
router.post('/users', async (req, res) => {
  try {
    const { uid, name, email, role, photoURL, createdAt } = req.body;
    const connection = req.app.get('db');

    // Check if user exists
    const [existing] = await connection.execute(
      'SELECT uid FROM users WHERE uid = ?',
      [uid]
    );

    if (existing.length === 0) {
      // Insert new user
      await connection.execute(
        `INSERT INTO users (uid, name, email, role, photo_url, created_at) 
         VALUES (?, ?, ?, ?, ?, ?)`,
        [uid, name, email, role || 'user', photoURL, new Date(createdAt)]
      );
      res.status(201).json({ message: 'User created successfully' });
    } else {
      res.status(200).json({ message: 'User already exists' });
    }
  } catch (error) {
    console.error('Error processing user:', error);
    res.status(500).json({ error: 'Failed to process user data' });
  }
});

// Export users to Excel
router.get('/export-users', async (req, res) => {
  try {
    const connection = req.app.get('db');
    
    // Fetch all users
    const [users] = await connection.execute('SELECT * FROM users');

    // Create Excel workbook
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Users');

    // Add headers
    worksheet.columns = [
      { header: 'UID', key: 'uid', width: 40 },
      { header: 'Name', key: 'name', width: 30 },
      { header: 'Email', key: 'email', width: 30 },
      { header: 'Role', key: 'role', width: 15 },
      { header: 'Created At', key: 'created_at', width: 20 },
      { header: 'Last Login', key: 'last_login', width: 20 }
    ];

    // Add rows
    worksheet.addRows(users);

    // Set filename with current date
    const filename = `wealthsage_users_${new Date().toISOString().split('T')[0]}.xlsx`;
    
    // Set response headers
    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    );
    res.setHeader('Content-Disposition', `attachment; filename=${filename}`);

    // Write to response
    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    console.error('Error exporting users:', error);
    res.status(500).json({ error: 'Failed to export users' });
  }
});

module.exports = router;
