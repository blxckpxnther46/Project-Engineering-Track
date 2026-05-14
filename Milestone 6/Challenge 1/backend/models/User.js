import mongoose from 'mongoose'

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
      select: false, // Prevent password from being returned in queries by default
    },
  },
  { timestamps: true }
)

export default mongoose.model('User', userSchema)
