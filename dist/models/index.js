'use strict';
// const dbConfig = require('../config/db.config.js');
// const mongoose = require('mongoose');
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
// mongoose.Promise = global.Promise;
// const db = {};
// db.mongoose = mongoose;
// db.url = dbConfig.url;
// db.user = require('./users.js')(mongoose);
// db.inventory = require('./inventory.js')(mongoose);
// module.exports = db;
// import {url} from '../config/db.config.js';
// import mongoose from 'mongoose';
// mongoose.Promise = global.Promise;
// const db = {};
// db.mongoose = mongoose;
// db.url = dbConfig.url;
// import mongoose from 'mongoose';
// import { url } from '../config/db.config';
// import UserModel from './users';
// import inventoryModel from './inventory';
// import InventoryModel from './inventory';
// mongoose.Promise = global.Promise;
// const db = {
//   mongoose,
//   url: url,
//   users: UserModel(mongoose),     // Invoke the function here
//   inventory: InventoryModel(mongoose), // Invoke the function here
// };
// export default db;
const mongoose_1 = __importDefault(require('mongoose'));
const db_config_1 = require('../config/db.config');
const users_1 = __importDefault(require('./users'));
const inventory_1 = __importDefault(require('./inventory'));
mongoose_1.default.Promise = global.Promise;
const db = {
  mongoose: mongoose_1.default,
  url: db_config_1.url,
  users: users_1.default,
  inventory: inventory_1.default // Assign the InventoryModel directly
};
exports.default = db;
