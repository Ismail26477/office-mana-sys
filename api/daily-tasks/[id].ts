import type { VercelRequest, VercelResponse } from "@vercel/node"
import { connectDB, ObjectId } from "../db"

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const db = await connectDB()
    const { id } = req.query

    if (req.method === "PUT") {
      await db.collection("dailytasks").updateOne({ _id: new ObjectId(String(id)) }, { $set: req.body })
      return res.json({ _id: id, ...req.body })
    }

    if (req.method === "DELETE") {
      await db.collection("dailytasks").deleteOne({ _id: new ObjectId(String(id)) })
      return res.json({ message: "Daily task deleted" })
    }

    res.status(405).json({ error: "Method not allowed" })
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
}
