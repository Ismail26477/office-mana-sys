import type { VercelRequest, VercelResponse } from "@vercel/node"
import { connectDB } from "../db"

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const db = await connectDB()

    if (req.method === "GET") {
      const sheets = await db
        .collection("editorsheets")
        .aggregate([
          {
            $lookup: {
              from: "users",
              localField: "employeeId",
              foreignField: "_id",
              as: "employeeInfo",
            },
          },
          {
            $addFields: {
              employeeName: {
                $cond: [
                  { $gt: [{ $size: "$employeeInfo" }, 0] },
                  { $arrayElemAt: ["$employeeInfo.name", 0] },
                  "Unknown",
                ],
              },
            },
          },
          {
            $project: {
              employeeInfo: 0,
            },
          },
        ])
        .toArray()

      return res.json(sheets)
    }

    if (req.method === "POST") {
      const result = await db.collection("editorsheets").insertOne(req.body)
      return res.status(201).json({ _id: result.insertedId, ...req.body })
    }

    res.status(405).json({ error: "Method not allowed" })
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
}
