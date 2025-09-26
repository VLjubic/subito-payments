module.exports = (sequelize, DataTypes) => {
  return sequelize.define(
    "CalendarStatusCategory",
    {
      name: { type: DataTypes.STRING, allowNull: false },
      displayName: { type: DataTypes.STRING, allowNull: false },
    },
    { timestamps: false }
  );
};
