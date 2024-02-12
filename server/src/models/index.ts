import fs from 'fs';
import path from 'path';
import Sequelize, { Sequelize as SequelizeInstance } from 'sequelize';

const basename = path.basename(__filename);
const env: string = (process.env.NODE_ENV as string) || 'development';
const config = require(__dirname + '/../config/config.json')[env];
const db: any = {}; // Adjust the type based on your Sequelize model types

let sequelize: SequelizeInstance;

if (config.use_env_variable) {
  sequelize = new SequelizeInstance(process.env[config.use_env_variable as string] as string, {
    ...config,
    dialect: 'sqlite',
  });
} else {
  sequelize = new SequelizeInstance({
    ...config,
    dialect: 'sqlite',
  });
}

fs.readdirSync(__dirname)
  .filter(file => {
    return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
  })
  .forEach(file => {
    const modelPath = path.join(__dirname, file);
    const model = require(modelPath).default; // Adjust based on your export
    db[model.name] = model;
  });

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

export default db;
