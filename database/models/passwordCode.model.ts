import { Model, model, models, ObjectId, Schema } from "mongoose";

interface BasePasswordCodeDoc {
  _id?: ObjectId;
  userId: string;
  hashedCode: string;
  createdAt?: string;
  updateAt?: string;
}

const schema = new Schema<BasePasswordCodeDoc>(
  {
    userId: { type: String, required: true, unique: true },
    hashedCode: { type: String, required: true },
  },
  { timestamps: true }
);

const PasswordCodeModel = models?.PasswordCode || model("PasswordCode", schema);

export default PasswordCodeModel as Model<BasePasswordCodeDoc>;
