import type { VercelRequest, VercelResponse } from "@vercel/node"
import { connectDB, ObjectId } from "../db"

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const db = await connectDB()
    const { id } = req.query

    if (req.method === "PUT") {
      const result = await db
        .collection("attendancerecords")
        .updateOne({ _id: new ObjectId(String(id)) }, { $set: req.body })
      return res.json(result)
    }

    if (req.method === "DELETE") {
      const result = await db.collection("attendancerecords").deleteOne({ _id: new ObjectId(String(id)) })
      return res.json(result)
    }

    res.status(405).json({ error: "Method not allowed" })
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
}
