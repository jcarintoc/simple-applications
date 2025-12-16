import type { Request, Response } from "express";

const CSRF_TOKEN_NAME = "XSRF-TOKEN";

export function getCsrfToken(req: Request, res: Response): void {
  const token = req.cookies?.[CSRF_TOKEN_NAME] as string | undefined;

  if (token) {
    res.json({ csrfToken: token });
  } else {
    res.status(500).json({ error: "CSRF token not found" });
  }
}
