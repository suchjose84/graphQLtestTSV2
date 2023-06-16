import mongoose, { Schema, Model, Document } from 'mongoose';

export interface InventoryDocument extends Document {
  username: string;
  itemName: string;
  price: string;
  classification: string;
  remaining: string;
  unit: string;
}

const inventorySchema: Schema<InventoryDocument> = new mongoose.Schema<InventoryDocument>(
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

const InventoryModel: Model<InventoryDocument> = mongoose.model<InventoryDocument>(
  'inventory',
  inventorySchema
);

export default InventoryModel;
