import app from "./app";
import { envVars } from "./config/env";
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
