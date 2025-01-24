import { Model, model, models, ObjectId, Schema } from "mongoose";

interface BaseUserDoc {
  _id?: ObjectId;
  name: string;
  email: string;
  provider: "credentials" | "google" | "github";
  password?: string;
  avatar?: {
    url: string;
    id: string;
  };
  verified: boolean;
}

export interface CredentialUserDoc extends BaseUserDoc {
  provider: "credentials";
  password: string;
}

export interface GoogleUserDoc extends BaseUserDoc {
  provider: "google";
  password: never;
}

export interface GithubUserDoc extends BaseUserDoc {
  provider: "github";
  password: never;
}

export type UserDoc = CredentialUserDoc | GoogleUserDoc | GithubUserDoc;

const schema = new Schema<BaseUserDoc>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, unique: true },
    provider: {
      type: String,
      required: true,
      enum: ["credentials", "google", "github"],
    },
    password: { type: String },
    avatar: {
      type: Object,
      url: { type: String },
      id: { type: String },
    },
    verified: { type: Boolean, required: true, default: false },
  },
  { timestamps: true }
);

const UserModel = models?.User || model("User", schema);

export default UserModel as Model<BaseUserDoc>;
