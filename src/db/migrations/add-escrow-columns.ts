import pool from '@/lib/mysql';

export async function addEscrowColumns() {
  const connection = await pool.getConnection();
  try {
    // First check if columns exist
    const [columns] = await connection.execute(`
      SELECT COLUMN_NAME 
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_NAME = 'products' 
      AND TABLE_SCHEMA = DATABASE()
      AND COLUMN_NAME IN ('escrow_amount', 'escrow_wallet')
    `);

    if (!Array.isArray(columns) || columns.length < 2) {
      // Add missing columns
      await connection.execute(`
        ALTER TABLE products
        ADD COLUMN escrow_amount DECIMAL(65,0) DEFAULT 0,
        ADD COLUMN escrow_wallet VARCHAR(255) NULL
      `);
      console.log('Added escrow columns to products table');
    }
  } catch (error) {
    console.error('Error adding escrow columns:', error);
    throw error;
  } finally {
    connection.release();
  }
}

// Execute migration
addEscrowColumns()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('Migration failed:', error);
    process.exit(1);
  });