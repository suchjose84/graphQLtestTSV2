'use strict';
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
const mongoose_1 = __importDefault(require('mongoose'));
const inventorySchema = new mongoose_1.default.Schema(
  {
    username: {
      type: String
    },
    itemName: {
      type: String
    },
    price: {
      type: String
    },
    classification: {
      type: String
    },
    remaining: {
      type: String
    },
    unit: {
      type: String
    }
  },
  {
    versionKey: false,
    collection: 'inventory' // Specify the custom collection name here
  }
);
const InventoryModel = mongoose_1.default.model('inventory', inventorySchema);
exports.default = InventoryModel;
