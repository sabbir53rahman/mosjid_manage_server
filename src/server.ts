import app from "./app.js";
import { envVars } from "./config/env.js";
import { Request, Response } from "express";

// For Vercel serverless deployment
export default async function handler(req: Request, res: Response) {
  await app(req, res);
}

// For local development & Render
const bootstrap = async () => {
  try {
    const PORT = envVars.PORT || "10000";
    app.listen(PORT, () => {
      console.log(`Server is running on PORT ${PORT}`);
    });
  } catch (err) {
    console.error("Failed to start server:", err);
  }
};

bootstrap();
