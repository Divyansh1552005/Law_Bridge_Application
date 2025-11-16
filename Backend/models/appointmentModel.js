import mongoose from "mongoose"

const appointmentSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    lawyerId: { type: String, required: true },
    slotDate: { type: String, required: true },
    slotTime: { type: String, required: true },
    userData: { type: Object, required: true },
    lawyerData: { type: Object, required: true },
    amount: { type: Number, required: true },
    date: { type: Number, required: true },
    cancelled: { type: String, default: "Not Cancelled" },
    payment: { type: Boolean, default: false },
    isCompleted: { type: Boolean, default: false },
    videoCall: {
    callId: { type: String, default: null },           // Unique call ID for Stream
    roomId: { type: String, default: null },           // Stream room/call identifier
    status: { 
      type: String, 
      enum: ['not_started', 'in_progress', 'completed', 'missed'],
      default: 'not_started' 
    },
    startedAt: { type: Date, default: null },          // When call actually started
    endedAt: { type: Date, default: null },            // When call ended
    duration: { type: Number, default: 0 },            // Call duration in minutes
    userJoined: { type: Boolean, default: false },     // Track if user joined
    lawyerJoined: { type: Boolean, default: false }    // Track if lawyer joined
  }
})

const appointmentModel = mongoose.models.appointment || mongoose.model("appointment", appointmentSchema)
export default appointmentModel

