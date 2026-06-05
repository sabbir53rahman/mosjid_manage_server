import app from "../src/app";
import { Request, Response } from "express";

export default async function handler(req: Request, res: Response) {
  try {
    await app(req, res);
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
}
