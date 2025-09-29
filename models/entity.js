// server/models/user.js
module.exports = (sequelize, DataTypes) => {
  return sequelize.define(
    "Entity",
    {
      name: { type: DataTypes.STRING, allowNull: false },
      categoryID: { type: DataTypes.INTEGER, allowNull: false },
    },
    { timestamps: false }
  );
};
