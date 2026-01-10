import { connectDB, ObjectId } from "../db.js"
import bcrypt from "bcryptjs"

export default async function handler(req: any, res: any) {
  try {
    const db = await connectDB()
    const { id } = req.query

    if (!id) {
      return res.status(400).json({ error: "Employee ID is required" })
    }

    // Handle GET for single employee
    if (req.method === "GET") {
      const employee = await db.collection("users").findOne({ _id: new ObjectId(String(id)) })
      if (!employee) {
        return res.status(404).json({ error: "Employee not found" })
      }
      return res.json(employee)
    }

    // Handle PUT to update employee (including password change)
    if (req.method === "PUT") {
      const updateData = { ...req.body }

      if (updateData.password) {
        updateData.password = await bcrypt.hash(updateData.password, 10)
      }

      updateData.updatedAt = new Date()
      const result = await db.collection("users").updateOne({ _id: new ObjectId(String(id)) }, { $set: updateData })

      if (result.matchedCount === 0) {
        return res.status(404).json({ error: "Employee not found" })
      }

      return res.json({ _id: id, message: "Employee updated successfully" })
    }

    // Handle DELETE to remove employee
    if (req.method === "DELETE") {
      const result = await db.collection("users").deleteOne({ _id: new ObjectId(String(id)) })
      if (result.deletedCount === 0) {
        return res.status(404).json({ error: "Employee not found" })
      }
      return res.json({ message: "Employee deleted successfully" })
    }

    res.status(405).json({ error: "Method not allowed" })
  } catch (error: any) {
    console.error("Error:", error)
    res.status(500).json({ error: error.message })
  }
}
