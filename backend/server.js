require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');

const app = express();
const port = process.env.PORT || 3088;

app.use(cors());
app.use(express.json());

// 🟢 เชื่อมต่อ MySQL Database (phpMyAdmin)
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'std6730251166',
  password: process.env.DB_PASSWORD || 'M3@zWq7L',
  database: process.env.DB_NAME || 'ip_std6730251166',
  port: process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
});

// 🟢 ทดสอบการเชื่อมต่อ DB
(async function testConnection() {
  try {
    const conn = await pool.getConnection();
    console.log('✅ Connected to MySQL Database:', process.env.DB_NAME);
    conn.release();
  } catch (err) {
    console.error('❌ MySQL Connection Failed:', err.message);
  }
})();

app.get('/api', (req, res) => {
  res.send('API is running');
});

// 1️⃣ [GET] ดึงข้อมูลสินค้าทั้งหมด
app.get('/api/products', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM Inventory ORDER BY id DESC');
    res.json(rows);
  } catch (err) {
    console.error('Products Error:', err.message);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

// 2️⃣ [POST] เพิ่มสินค้าใหม่ (รวม price)
app.post('/api/products', async (req, res) => {
  const { name, price, stock, category, image } = req.body;
  try {
    const [result] = await pool.query(
      `INSERT INTO Inventory (name, price, stock, category, image, lastUpdate) VALUES (?, ?, ?, ?, ?, NOW())`,
      [name, price || 0, stock || 1, category || 'Healing', image || 'https://picsum.photos/200/200']
    );
    res.status(201).json({ success: true, id: result.insertId });
  } catch (err) {
    console.error('Add Product Error:', err.message);
    res.status(500).json({ error: 'Failed to add product' });
  }
});

// 3️⃣ [PUT] แก้ไขสินค้าตาม ID (รวม price)
app.put('/api/products/:id', async (req, res) => {
  const { id } = req.params;
  const { name, price, stock, category, image } = req.body;
  try {
    await pool.query(
      `UPDATE Inventory SET name = ?, price = ?, stock = ?, category = ?, image = ?, lastUpdate = NOW() WHERE id = ?`,
      [name, price || 0, stock || 1, category || 'Healing', image, id]
    );
    res.json({ success: true });
  } catch (err) {
    console.error('Update Error:', err.message);
    res.status(500).json({ error: 'Failed to update product' });
  }
});

// 4️⃣ [DELETE] ลบสินค้า
app.delete('/api/products/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM Inventory WHERE id = ?', [id]);
    res.json({ success: true });
  } catch (err) {
    console.error('Delete Error:', err.message);
    res.status(500).json({ error: 'Failed to delete product' });
  }
});

app.listen(port, '0.0.0.0', () => {
  console.log(`🚀 API running on port ${port}`);
});