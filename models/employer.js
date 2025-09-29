// server/models/employer.js
module.exports = (sequelize, DataTypes) => {
  return sequelize.define(
    "Employer",
    {
      name: { type: DataTypes.STRING, allowNull: false },
    },
    { timestamps: false }
  );
};
