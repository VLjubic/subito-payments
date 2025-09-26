// server/models/subtask.js
module.exports = (sequelize, DataTypes) => {
  return sequelize.define(
    "Subtask",
    {
      name: { type: DataTypes.STRING, allowNull: false },
      employer_id: { type: DataTypes.INTEGER, allowNull: true },
    },
    { timestamps: false }
  );
};
