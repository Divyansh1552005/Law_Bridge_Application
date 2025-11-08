import mongoose from "mongoose";

const lawyerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    image: { type: String, required: true },
    speciality: { type: String, required: true },
    degree: { type: String, required: true },
    experience: { type: String, required: true },
    about: { type: String, required: true },
    // aage availablity ko change karke aise kardena ki ek object ho jisme date wise and time wise available slots ho
    available: { type: Boolean, default: true },
    fees: { type: Number, required: true },
    slots_booked: { type: Object, default: {} },
    address: {
      Location: { type: String, default: "" },
      City: { type: String, default: "" },
      State: { type: String, default: "" },
    },
    date: { type: Number, required: true },
  },
  { minimize: false }
);

// Create a model using the schema, also || statement is for ki if model already exists use that
const lawyerModel =
  mongoose.models.lawyer || mongoose.model("lawyer", lawyerSchema);
export default lawyerModel;
