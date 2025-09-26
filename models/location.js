// server/models/location.js
module.exports = (sequelize, DataTypes) => {
  return sequelize.define(
    "Location",
    {
      name: { type: DataTypes.STRING, allowNull: false },
    },
    { timestamps: false }
  );
};
