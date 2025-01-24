import { Model, model, models, ObjectId, Schema } from "mongoose";

interface BaseVerificationCodeDoc {
  _id?: ObjectId;
  userId: string;
  hashedCode: string;
  createdAt?: string;
  updateAt?: string;
}

const schema = new Schema<BaseVerificationCodeDoc>(
  {
    userId: { type: String, required: true, unique: true },
    hashedCode: { type: String, required: true },
  },
  { timestamps: true }
);

const verificationCodeModel =
  models?.verificationCode || model("verificationCode", schema);

export default verificationCodeModel as Model<BaseVerificationCodeDoc>;
