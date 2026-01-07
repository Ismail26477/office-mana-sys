import type { VercelRequest, VercelResponse } from "@vercel/node"
import { connectDB } from "./db"

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const db = await connectDB()
    res.json({
      status: "ok",
      message: "Backend server is running and MongoDB is connected",
      database: "office_management",
    })
  } catch (error: any) {
    res.status(503).json({
      status: "error",
      message: "MongoDB is not connected",
      error: error.message,
    })
  }
}
