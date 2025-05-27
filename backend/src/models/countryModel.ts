import mongoose, { Model, Types, Schema } from "mongoose";

export interface ICountry {
  _id: Types.ObjectId;
  name: string;
  capital: string;
  currencies: string;
  flag: string;
}

type CountryModel = Model<ICountry, {}>;

const CountrySchema = new Schema<ICountry, CountryModel>({
  name: {
    type: String,
    required: true,
  },
  capital: {
    type: String,
    required: true,
  },
  currencies: {
    type: String,
    required: true,
  },
  flag: {
    type: String,
    required: true,
  },
});

export default mongoose.model<ICountry, CountryModel>('Country', CountrySchema);