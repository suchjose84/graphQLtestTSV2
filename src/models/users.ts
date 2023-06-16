import mongoose, { Schema, Model, Document } from 'mongoose';

export interface UserDocument extends Document {
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  birthDate: string;
  phone: string;
  country: string;
  profileImg: string;
}

const userSchema: Schema<UserDocument> = new Schema<UserDocument>({
  username: {
    type: String
  },
  firstName: {
    type: String
  },
  lastName: {
    type: String
  },
  email: {
    type: String
  },
  password: {
    type: String
  },
  birthDate: {
    type: String
  },
  phone: {
    type: String
  },
  country: {
    type: String
  },
  profileImg: {
    type: String
  }
}, {
  versionKey: false,
  collection: 'users' // Specify the custom collection name here
});

const UserModel: Model<UserDocument> = mongoose.model<UserDocument>('users', userSchema);

export default UserModel;
