"use strict";
// const dotenv = require('dotenv');
// dotenv.config();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.url = void 0;
// module.exports = {
//   url: process.env.MONGODB_URI,
// };
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.url = process.env.MONGODB_URI;
