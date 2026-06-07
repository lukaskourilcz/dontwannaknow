import { z } from "zod";

export const RELATIONSHIPS = [
  "mother",
  "father",
  "grandmother",
  "grandfather",
  "great-grandmother",
  "great-grandfather",
  "aunt",
  "uncle",
  "other",
] as const;
export type Relationship = (typeof RELATIONSHIPS)[number];

export const LOCATIONS = [
  { value: "cz", label: "Czech Republic" },
  { value: "ua", label: "Ukraine" },
] as const;
export type LocationCode = (typeof LOCATIONS)[number]["value"];

const name = z.string().trim().min(1, "Required").max(40, "Too long");

// Strings from the form, validated then transformed to a whole-number age.
const age = z
  .string()
  .trim()
  .min(1, "Required")
  .refine((s) => !Number.isNaN(Number(s)), "Must be a number")
  .transform((s) => Number(s))
  .refine((n) => Number.isInteger(n), "Use a whole number")
  .refine((n) => n >= 1, "Must be at least 1")
  .refine((n) => n <= 120, "That seems too high");

// Selects start empty (""), so validate membership with a narrowing refine
// (keeps the form input type a plain string while the output type is narrowed).
const relationship = z
  .string()
  .min(1, "Pick one")
  .refine(
    (v): v is Relationship => (RELATIONSHIPS as readonly string[]).includes(v),
    "Pick one",
  );

const location = z
  .string()
  .min(1, "Pick one")
  .refine((v): v is LocationCode => v === "cz" || v === "ua", "Pick one");

export const formSchema = z.object({
  // About you — only to phrase "when your mother was the age you are now…".
  userName: name,
  userAge: age,
  // About the person in question.
  relationship,
  personName: name,
  personAge: age,
  location,
});

export type FormInput = z.input<typeof formSchema>; // all strings (what the form holds)
export type FormValues = z.output<typeof formSchema>; // ages numbers, selects narrowed
