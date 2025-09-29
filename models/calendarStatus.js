// server/models/calendarStatus.js
module.exports = (sequelize, DataTypes) => {
  return sequelize.define(
    "CalendarStatus",
    {
      date: { type: DataTypes.DATEONLY, allowNull: false, unique: true },
      category_id: { type: DataTypes.INTEGER, allowNull: false },
    },
    { timestamps: false }
  );
};
