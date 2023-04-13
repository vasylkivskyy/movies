import jwt from "jsonwebtoken";
import { status, code } from "../constants/statuses.js";
import { getErrorResponse } from "../helpers/errorResponse.js";

export function authenticateJWT(req, res, next) {
  const authHeader = req.headers.authorization;

  if (authHeader) {
    const token = authHeader;

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) {
        return res.json({
          status: status.FAILURE,
          error: {
            fields: {
              token: "REQUIRED",
            },
            code: "FORMAT_ERROR",
          },
        });
      }

      req.user = user;
      next();
    });
  } else {
    const errorResponse = getErrorResponse(
      status.FAILURE,
      { token: "REQUIRED" },
      code.formatError
    );
    res.json(errorResponse);
  }
}
