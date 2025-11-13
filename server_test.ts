import { assertEquals } from "jsr:@std/assert@1";
import { isValidEmail, validateUser } from "./server.ts";

Deno.test("isValidEmail should reject invalid email", () => {
  assertEquals(isValidEmail("invalid-email"), false);
  assertEquals(isValidEmail("test@"), false);
  assertEquals(isValidEmail("@example.com"), false);
});

Deno.test("isValidEmail should accept valid email", () => {
  assertEquals(isValidEmail("test@example.com"), true);
  assertEquals(isValidEmail("user.name@domain.co.uk"), true);
});

Deno.test("validateUser should reject invalid email", () => {
  const result = validateUser({ name: "Test", email: "invalid-email" });
  assertEquals(result.valid, false);
  assertEquals(result.errors.includes("Email format is invalid"), true);
});
