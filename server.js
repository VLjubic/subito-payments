// --- Backend: Node.js with Express and Sequelize ---
// Assumes: express, sequelize, pg or mysql2, body-parser, cors

const express = require('express');
const { Sequelize, DataTypes } = require('sequelize');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = 3001;

app.use(cors());
app.use(bodyParser.json());

const sequelize = new Sequelize(
  'subitohr_subito_payments',           // database name
  'subitohr_subito_admin',              // database user
  'subitoAdmin2025',                    // database password
  {
    host: 'localhost',                  // remote server hostname
    dialect: 'mysql',
    port:  3306,
    dialectOptions: {
      charset: 'utf8mb4',               // optional: good for Croatian characters
    },
    logging: console.log                // optional: enable SQL query logging
  }
);

const Entity = sequelize.define('Entity', {
  name: { type: DataTypes.STRING, allowNull: false }
});

const Payment = sequelize.define('Payment', {
  amount: { type: DataTypes.FLOAT, allowNull: false },
  paid_date: { type: DataTypes.DATEONLY, allowNull: false }
});

Entity.hasMany(Payment);
Payment.belongsTo(Entity);

app.get('/api/entities', async (req, res) => {
  const entities = await Entity.findAll();
  res.json(entities);
});

app.post('/api/payments', async (req, res) => {
  const { entity, amount, paid_date } = req.body;
  const payment = await Payment.create({ EntityId: entity, amount, paid_date });
  res.json(payment);
});

app.get('/api/payments/overview', async (req, res) => {
  try {
    // Get all unique (year, month) combinations from Payment.paid_date
    const payments = await Payment.findAll({
      attributes: [
        [Sequelize.fn('YEAR', Sequelize.col('paid_date')), 'year'],
        [Sequelize.fn('MONTH', Sequelize.col('paid_date')), 'month'],
      ],
      group: ['year', 'month'],
      order: [
        [Sequelize.fn('YEAR', Sequelize.col('paid_date')), 'ASC'],
        [Sequelize.fn('MONTH', Sequelize.col('paid_date')), 'ASC']
      ],
      raw: true
    });

    const entities = await Entity.findAll();
    const data = [];

    for (let entry of payments) {
      const { year, month } = entry;

      for (let entity of entities) {
        const payment = await Payment.findOne({
          where: Sequelize.and(
            Sequelize.where(Sequelize.fn('MONTH', Sequelize.col('paid_date')), month),
            Sequelize.where(Sequelize.fn('YEAR', Sequelize.col('paid_date')), year),
            { EntityId: entity.id }
          )
        });

        data.push({
          month: `${year}-${String(month).padStart(2, '0')}`,
          entity: entity.name,
          amount: payment?.amount ?? null,
          paid_date: payment?.paid_date ?? null,
        });
      }
    }

    res.json(data);
  } catch (error) {
    console.error('Error in /api/payments/overview:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


sequelize.sync({ force: false }).then(async () => {
  const count = await Entity.count();
  if (count === 0) {
    await Entity.bulkCreate([
      { name: 'VAT' },
      { name: 'Healthcare' },
      { name: 'City Tax' },
      { name: 'Pension' },
      { name: 'Other' },
    ]);
  }
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});
