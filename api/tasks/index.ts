import type { VercelRequest, VercelResponse } from "@vercel/node"
import { connectDB } from "../db"

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const db = await connectDB()

    if (req.method === "GET") {
      const tasks = await db.collection("tasks").find({}).toArray()
      return res.json(tasks)
    }

    if (req.method === "POST") {
      const result = await db.collection("tasks").insertOne(req.body)
      return res.json({ _id: result.insertedId, ...req.body })
    }

    res.status(405).json({ error: "Method not allowed" })
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
}
