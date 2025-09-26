const { Sequelize, DataTypes, Op } = require("sequelize");
require("dotenv").config();

const DB_NAME = process.env.DB_NAME;
const DB_USER = process.env.DB_USER;
const DB_PASS = process.env.DB_PASS;
const DB_HOST = process.env.DB_HOST;
const DB_PORT = process.env.DB_PORT;

const db = {};

const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASS, {
  host: DB_HOST,
  dialect: "mysql",
  port: DB_PORT || 3306,
});

// Define models
db.User = require("./user")(sequelize, DataTypes);
db.Employer = require("./employer")(sequelize, DataTypes);
db.JobType = require("./jobType")(sequelize, DataTypes);
db.Location = require("./location")(sequelize, DataTypes);
db.Subtask = require("./subtask")(sequelize, DataTypes);
db.Task = require("./task")(sequelize, DataTypes);
db.CalendarStatus = require("./calendarStatus")(sequelize, DataTypes);
db.Payment = require("./payment")(sequelize, DataTypes);
db.Entity = require("./entity")(sequelize, DataTypes);
db.entityCategory = require("./entityCategory")(sequelize, DataTypes);
db.CalendarStatusCategory = require("./calendarStatusCategory")(
  sequelize,
  DataTypes
);

// Associations
db.Entity.hasMany(db.Payment, { foreignKey: "EntityId" });
db.Payment.belongsTo(db.Entity, { foreignKey: "EntityId" });

db.Employer.hasMany(db.Subtask, { foreignKey: "employer_id" });
db.Subtask.belongsTo(db.Employer, { foreignKey: "employer_id" });

db.Employer.hasMany(db.Task, { foreignKey: "employer_id" });
db.Task.belongsTo(db.Employer, { foreignKey: "employer_id" });

db.Subtask.hasMany(db.Task, { foreignKey: "subtask_id" });
db.Task.belongsTo(db.Subtask, { foreignKey: "subtask_id" });

db.JobType.hasMany(db.Task, { foreignKey: "job_type_id" });
db.Task.belongsTo(db.JobType, { foreignKey: "job_type_id" });

db.Location.hasMany(db.Task, { foreignKey: "location_id" });
db.Task.belongsTo(db.Location, { foreignKey: "location_id" });

db.User.hasMany(db.Task, { foreignKey: "user_id" });
db.Task.belongsTo(db.User, { foreignKey: "user_id" });

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
