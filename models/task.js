// server/models/task.js
module.exports = (sequelize, DataTypes) => {
  return sequelize.define(
    "Task",
    {
      date: { type: DataTypes.DATEONLY, allowNull: false },
      minutes: { type: DataTypes.INTEGER, allowNull: false },
      description: { type: DataTypes.TEXT, allowNull: true },
    },
    { timestamps: false }
  );
};
