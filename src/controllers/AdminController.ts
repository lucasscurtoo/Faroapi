import express, { NextFunction, Request, Response } from "express";
const login = express.Router();
import dotenv from "dotenv";
dotenv.config();
import { decode, encode, TAlgorithm } from "jwt-simple";
import {
  DecodeResult,
  EncodeResult,
  ExpirationStatus,
  Session,
  SessionUsername,
} from "../model/Admin";

const LOGIN_FAILED = "Credentials are incorrect";

export function encodeSession(partialSession: SessionUsername): EncodeResult {
  // Always use HS512 to sign the token
  const algorithm: TAlgorithm = "HS512";
  // Determine when the token should expire
  const issued = Date.now();
  const fifteenMinutesInMs = 60 * 60 * 1000;
  const expires = issued + fifteenMinutesInMs;

  const session: Session = {
    ...partialSession,
    issued,
    expires,
  };

  return {
    token: encode(session, process.env.JWT_SECRET, algorithm),
    issued,
    expires,
  };
}

export function decodeSession(tokenString: string): DecodeResult {
  // Always use HS512 to decode the token
  const algorithm: TAlgorithm = "HS512";

  let result: Session;

  try {
    result = decode(tokenString, process.env.JWT_SECRET, false, algorithm);
  } catch (_e) {
    const e: Error = _e;

    // These error strings can be found here:
    // https://github.com/hokaccha/node-jwt-simple/blob/c58bfe5e5bb049015fcd55be5fc1b2d5c652dbcd/lib/jwt.js
    if (
      e.message === "No token supplied" ||
      e.message === "Not enough or too many segments"
    ) {
      return {
        type: "invalid-token",
      };
    }

    if (
      e.message === "Signature verification failed" ||
      e.message === "Algorithm not supported"
    ) {
      return {
        type: "integrity-error",
      };
    }

    // Handle json parse errors, thrown when the payload is nonsense
    if (e.message.indexOf("Unexpected token") === 0) {
      return {
        type: "invalid-token",
      };
    }

    throw e;
  }

  return {
    type: "valid",
    session: result,
  };
}

export function checkExpiration(token: Session): ExpirationStatus {
  const now = Date.now();

  if (token.expires > now) return "active";

  // Find the timestamp for the end of the token's grace period
  const threeHoursInMs = 3 * 60 * 60 * 1000;
  const threeHoursAfterExpiration = token.expires + threeHoursInMs;

  if (threeHoursAfterExpiration > now) {
    return "grace";
  } else {
    return "expired";
  }
}

export function requireJwtMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const unauthorized = (message: string) =>
    res.status(401).json({
      ok: false,
      status: 401,
      message,
    });

  const requestHeader = "X-JWT-Token";
  //const responseHeader = "X-Renewed-JWT-Token";
  const header = req.header(requestHeader);

  if (!header) {
    unauthorized(`Required ${requestHeader} header not found.`);
    return;
  }

  const decodedSession: DecodeResult = decodeSession(header);

  if (
    decodedSession.type === "integrity-error" ||
    decodedSession.type === "invalid-token"
  ) {
    unauthorized(
      `Failed to decode or validate authorization token. Reason: ${decodedSession.type}.`
    );
    return;
  }

  const expiration: ExpirationStatus = checkExpiration(decodedSession.session);

  if (expiration === "expired") {
    unauthorized(
      `Authorization token has expired. Please create a new authorization token.`
    );
    return;
  }

  /*
  let session: Session;

  
  if (expiration === "grace") {
    // Automatically renew the session and send it back with the response
    const { token, expires, issued } = encodeSession(decodedSession.session);
    session = {
      ...decodedSession.session,
      expires,
      issued,
    };

    res.setHeader(responseHeader, token);
  } else {
    session = decodedSession.session;
  }
*/

  /*
  // Set the session on response.locals object for routes to access
  res.locals = {
    ...res.locals,
    session,
  };*/

  // Request has a valid or renewed session. Call next to continue to the authenticated route handler
  next();
}

login.post("/", (req, res) => {
  let session: SessionUsername;
  if (
    req.body.username === process.env.USER &&
    req.body.password === process.env.PASSWORD
  ) {
    session = {
      username: process.env.USER,
    };
    res.send(encodeSession(session).token);
  } else {
    res.status(401).json({
      ok: false,
      status: 401,
      LOGIN_FAILED,
    });
  }
});

export default login;
