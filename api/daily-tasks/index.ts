import type { VercelRequest, VercelResponse } from "@vercel/node"
import { connectDB } from "../db"

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const db = await connectDB()

    if (req.method === "GET") {
      const dailyTasks = await db
        .collection("dailytasks")
        .aggregate([
          {
            $lookup: {
              from: "users",
              localField: "employeeId",
              foreignField: "_id",
              as: "employeeDetails",
            },
          },
          {
            $addFields: {
              employeeName: {
                $cond: [
                  { $gt: [{ $size: "$employeeDetails" }, 0] },
                  { $arrayElemAt: ["$employeeDetails.name", 0] },
                  null,
                ],
              },
            },
          },
          {
            $project: {
              employeeDetails: 0,
            },
          },
        ])
        .toArray()

      return res.json(dailyTasks)
    }

    if (req.method === "POST") {
      const result = await db.collection("dailytasks").insertOne(req.body)
      return res.json({ _id: result.insertedId, ...req.body })
    }

    res.status(405).json({ error: "Method not allowed" })
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
}
