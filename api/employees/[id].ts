import type { VercelRequest, VercelResponse } from "@vercel/node"
import { connectDB, ObjectId } from "../db"

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const db = await connectDB()
    const { id } = req.query

    if (req.method === "GET") {
      const employee = await db.collection("users").findOne({ _id: new ObjectId(String(id)) })
      if (!employee) {
        return res.status(404).json({ error: "Employee not found" })
      }
      return res.json(employee)
    }

    if (req.method === "PUT") {
      const result = await db.collection("users").updateOne({ _id: new ObjectId(String(id)) }, { $set: req.body })
      return res.json({ _id: id, ...req.body })
    }

    if (req.method === "DELETE") {
      await db.collection("users").deleteOne({ _id: new ObjectId(String(id)) })
      return res.json({ message: "Employee deleted" })
    }

    res.status(405).json({ error: "Method not allowed" })
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
}
