// server/models/jobType.js
module.exports = (sequelize, DataTypes) => {
  return sequelize.define(
    "JobType",
    {
      name: { type: DataTypes.STRING, allowNull: false },
    },
    { timestamps: false }
  );
};
