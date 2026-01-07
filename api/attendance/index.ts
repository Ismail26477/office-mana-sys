import { connectDB, ObjectId } from "../db.js"

export default async function handler(req: any, res: any) {
  try {
    const db = await connectDB()
    const { id } = req.query

    if (req.method === "GET") {
      if (id) {
        const record = await db.collection("attendancerecords").findOne({ _id: new ObjectId(String(id)) })
        if (!record) {
          return res.status(404).json({ error: "Attendance record not found" })
        }
        return res.json(record)
      }
      const attendanceRecords = await db.collection("attendancerecords").find({}).toArray()
      return res.json(attendanceRecords)
    }

    if (req.method === "POST") {
      const result = await db.collection("attendancerecords").insertOne(req.body)
      return res.json({ _id: result.insertedId, ...req.body })
    }

    if (req.method === "PUT" && id) {
      const result = await db
        .collection("attendancerecords")
        .updateOne({ _id: new ObjectId(String(id)) }, { $set: req.body })
      return res.json({ _id: id, ...req.body })
    }

    if (req.method === "DELETE" && id) {
      await db.collection("attendancerecords").deleteOne({ _id: new ObjectId(String(id)) })
      return res.json({ message: "Attendance record deleted" })
    }

    res.status(405).json({ error: "Method not allowed" })
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
}
