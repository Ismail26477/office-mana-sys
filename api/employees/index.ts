import type { VercelRequest, VercelResponse } from "@vercel/node"
import { connectDB } from "../db"
import bcrypt from "bcryptjs"

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const db = await connectDB()

    if (req.method === "GET") {
      const employees = await db.collection("users").find({}).toArray()
      return res.json(employees)
    }

    if (req.method === "POST") {
      const employeeData = {
        ...req.body,
        password: await bcrypt.hash(req.body.password, 10),
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      const result = await db.collection("users").insertOne(employeeData)
      return res.json({ _id: result.insertedId, ...employeeData })
    }

    res.status(405).json({ error: "Method not allowed" })
  } catch (error: any) {
    console.error("Error:", error)
    res.status(500).json({ error: error.message })
  }
}
