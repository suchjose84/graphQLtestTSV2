import mongoose from 'mongoose';
import { url } from '../config/db.config';
import UserModel from './users';
import InventoryModel from './inventory';

mongoose.Promise = global.Promise;

const db = {
  mongoose,
  url,
  users: UserModel, // Assign the UserModel directly
  inventory: InventoryModel // Assign the InventoryModel directly
};

export default db;
