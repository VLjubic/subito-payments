// server/models/user.js
module.exports = (sequelize, DataTypes) => {
  return sequelize.define(
    "Payment",
    {
      amount: { type: DataTypes.FLOAT, allowNull: false },
      paidDate: { type: DataTypes.DATE, allowNull: false },
      EntityId: { type: DataTypes.INTEGER, allowNull: true },
    },
    { timestamps: false }
  );
};
