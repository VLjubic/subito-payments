// server/models/user.js
module.exports = (sequelize, DataTypes) => {
  return sequelize.define(
    "EntityCategory",
    {
      name: { type: DataTypes.STRING, allowNull: false },
    },
    { timestamps: false }
  );
};
