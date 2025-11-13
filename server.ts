import { Application, Context, Router } from "oak";

interface User {
  id: number;
  name: string;
  email: string;
}

const users: User[] = [];

let nextId = 1;

function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function validateUser(body: unknown): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!body || typeof body !== "object") {
    errors.push("Body must be an object");
    return { valid: false, errors };
  }

  const userBody = body as Record<string, unknown>;

  if (!userBody.name || typeof userBody.name !== "string") {
    errors.push("Name is required and must be a string");
  } else if (userBody.name.trim().length < 2) {
    errors.push("Name must be at least 2 characters");
  } else if (userBody.name.trim().length > 50) {
    errors.push("Name must be less than 50 characters");
  }

  if (!userBody.email || typeof userBody.email !== "string") {
    errors.push("Email is required and must be a string");
  } else if (!isValidEmail(userBody.email)) {
    errors.push("Email format is invalid");
  }

  return { valid: errors.length === 0, errors };
}

const router = new Router();

const securityHeaders = async (ctx: Context, next: () => Promise<unknown>) => {
  const { response } = ctx;
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-XSS-Protection", "1; mode=block");
  response.headers.set("Strict-Transport-Security", "max-age=31536000");

  await next();
};

router.get("/users", (ctx: Context) => {
  const { response } = ctx;
  response.body = users;
});

router.post("/users", async (ctx: Context) => {
  const { request, response } = ctx;
  try {
    const body = await request.body({ type: "json" }).value;

    const validation = validateUser(body);

    if (!validation.valid) {
      response.status = 400;
      response.body = {
        error: "Validation failed",
        details: validation.errors,
      };
      return;
    }

    const sanitize = (str: string): string => {
      return str
        .trim()
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#x27;");
    };

    const userBody = body as { name: string; email: string };
    const user: User = {
      id: nextId++,
      name: sanitize(userBody.name),
      email: userBody.email.trim().toLowerCase(),
    };

    users.push(user);
    response.status = 201;
    response.body = user;
  } catch (error) {
    response.status = 400;
    response.body = { error: "Invalid JSON" };
    console.error("Error processing request:", error);
  }
});

const app = new Application();
app.use(securityHeaders);
app.use(router.routes());
app.use(router.allowedMethods());

console.log("Server running on http://localhost:8000");
await app.listen({ port: 8000 });
