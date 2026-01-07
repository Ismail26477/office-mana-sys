import type { VercelRequest, VercelResponse } from "@vercel/node"
import { connectDB, ObjectId } from "../db"

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const db = await connectDB()
    const { id } = req.query

    if (req.method === "PUT") {
      const objectId = new ObjectId(String(id))
      const updateData: any = {}

      if (req.body.status) updateData.status = req.body.status
      if (req.body.title) updateData.title = req.body.title
      if (req.body.description !== undefined) updateData.description = req.body.description
      if (req.body.priority) updateData.priority = req.body.priority
      if (req.body.assignee) updateData.assignee = req.body.assignee
      if (req.body.dueDate) updateData.dueDate = req.body.dueDate
      if (req.body.tags) updateData.tags = req.body.tags

      updateData.updatedAt = new Date()

      const result = await db.collection("tasks").updateOne({ _id: objectId }, { $set: updateData })

      if (result.matchedCount === 0) {
        return res.status(404).json({ error: "Task not found" })
      }

      return res.json({ _id: id, ...updateData })
    }

    if (req.method === "DELETE") {
      await db.collection("tasks").deleteOne({ _id: new ObjectId(String(id)) })
      return res.json({ message: "Task deleted" })
    }

    res.status(405).json({ error: "Method not allowed" })
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
}
