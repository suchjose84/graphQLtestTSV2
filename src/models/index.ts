// const dbConfig = require('../config/db.config.js');
// const mongoose = require('mongoose');

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

import mongoose from 'mongoose';
import { url } from '../config/db.config';
import UserModel from './users';
import InventoryModel from './inventory';

mongoose.Promise = global.Promise;

const db = {
  mongoose,
  url,
  users: UserModel,           // Assign the UserModel directly
  inventory: InventoryModel,  // Assign the InventoryModel directly
};

export default db;



