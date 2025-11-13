import { assertEquals } from "jsr:@std/assert";

const BASE_URL = "http://localhost:8000";

Deno.test("User validation should reject invalid email", async () => {
  const response = await fetch(`${BASE_URL}/users`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name: "Test", email: "invalid-email" }),
  });

  assertEquals(response.status, 400);
  const data = await response.json();
  assertEquals(data.error, "Validation failed");
});

Deno.test("User validation should sanitize XSS attempts", async () => {
  const response = await fetch(`${BASE_URL}/users`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: "<script>alert('xss')</script>",
      email: "test@example.com",
    }),
  });

  const data = await response.json();
  assertEquals(data.name.includes("<script>"), false);
  assertEquals(data.name.includes("&lt;script&gt;"), true);
});

Deno.test("Security headers should be present", async () => {
  const response = await fetch(`${BASE_URL}/users`);
  assertEquals(response.headers.get("X-Content-Type-Options"), "nosniff");
  assertEquals(response.headers.get("X-Frame-Options"), "DENY");
  assertEquals(response.headers.get("X-XSS-Protection"), "1; mode=block");
});

Deno.test("Valid user should be created", async () => {
  const response = await fetch(`${BASE_URL}/users`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: "John Doe",
      email: "john@example.com",
    }),
  });

  assertEquals(response.status, 201);
  const data = await response.json();
  assertEquals(data.name, "John Doe");
  assertEquals(data.email, "john@example.com");
  assertEquals(typeof data.id, "number");
});

Deno.test("User validation should reject empty name", async () => {
  const response = await fetch(`${BASE_URL}/users`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name: "", email: "test@example.com" }),
  });

  assertEquals(response.status, 400);
  const data = await response.json();
  assertEquals(data.error, "Validation failed");
});

Deno.test("User validation should reject name too short", async () => {
  const response = await fetch(`${BASE_URL}/users`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name: "A", email: "test@example.com" }),
  });

  assertEquals(response.status, 400);
  const data = await response.json();
  assertEquals(data.error, "Validation failed");
});
