import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';
import Sequelize from 'sequelize';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const require = createRequire(import.meta.url);

const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const config = require(path.join(__dirname, '../config/config.json'))[env];
const db = {};

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}

fs
  .readdirSync(__dirname)
  .filter(file => {
    return (
      file.indexOf('.') !== 0 &&
      file !== basename &&
      (file.slice(-3) === '.js' || file.slice(-4) === '.cjs') &&
      file.indexOf('.test.js') === -1 &&
      file !== 'index.js'
    );
  })
  .forEach(file => {
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
  });

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

const {
  User,
  Workout,
  WorkoutExercise,
  Exercise,
  WorkoutLog,
  RefreshToken
} = db;

User.hasMany(Workout, { foreignKey: "user_id" });
Workout.belongsTo(User, { foreignKey: "user_id" });

Workout.hasMany(WorkoutExercise, { foreignKey: "workout_id" });
WorkoutExercise.belongsTo(Workout, { foreignKey: "workout_id" });

Exercise.hasMany(WorkoutExercise, { foreignKey: "exercise_id" });
WorkoutExercise.belongsTo(Exercise, { foreignKey: "exercise_id" });

Workout.hasOne(WorkoutLog, { foreignKey: "workout_id" });
WorkoutLog.belongsTo(Workout, { foreignKey: "workout_id" });

User.hasMany(RefreshToken, { foreignKey: 'userId' });
RefreshToken.belongsTo(User, { foreignKey: 'userId' });

db.sequelize = sequelize;
db.Sequelize = Sequelize;

export default db;
