"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const db_config_1 = require("../config/db.config");
const users_1 = __importDefault(require("./users"));
const inventory_1 = __importDefault(require("./inventory"));
mongoose_1.default.Promise = global.Promise;
const db = {
    mongoose: mongoose_1.default,
    url: db_config_1.url,
    users: users_1.default,
    inventory: inventory_1.default // Assign the InventoryModel directly
};
exports.default = db;
