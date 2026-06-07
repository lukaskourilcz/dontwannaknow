import type { ReactNode } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { m, useReducedMotion, type Variants } from "motion/react";
import {
  formSchema,
  RELATIONSHIPS,
  LOCATIONS,
  type FormInput,
  type FormValues,
} from "../lib/schema";

type FormProps = {
  onSubmit: (values: FormValues) => void;
};

const control =
  "w-full border-b-[1.5px] bg-transparent pt-2 pb-1 text-text outline-none transition-colors focus-visible:[outline:2px_solid_var(--color-accent)] focus-visible:[outline-offset:3px]";
const borderState = (hasError: boolean) =>
  hasError ? "border-error" : "border-border focus:border-accent";

const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

export default function Form({ onSubmit }: FormProps) {
  const reduced = useReducedMotion();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormInput, unknown, FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      userName: "",
      userAge: "",
      relationship: "",
      personName: "",
      personAge: "",
      location: "",
    },
  });

  const container: Variants = {
    hidden: {},
    show: { transition: reduced ? {} : { staggerChildren: 0.06, delayChildren: 0.08 } },
  };
  const item: Variants = {
    hidden: reduced ? { opacity: 0 } : { opacity: 0, y: 8 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
  };

  const Field = ({
    label,
    error,
    children,
  }: {
    label: string;
    error?: string;
    children: ReactNode;
  }) => (
    <label className="group flex flex-col gap-1.5">
      <span className="font-ui text-[0.8125rem] uppercase tracking-[0.08em] text-muted transition-colors group-focus-within:text-text">
        {label}
      </span>
      {children}
      <span role="alert" className="min-h-[1.1rem] font-ui text-[0.8125rem] leading-tight text-error">
        {error}
      </span>
    </label>
  );

  return (
    <m.form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      variants={container}
      initial="hidden"
      animate="show"
    >
      {/* About you */}
      <m.fieldset variants={item} className="m-0 min-w-0 border-0 p-0">
        <legend className="mb-4 font-ui text-[0.8125rem] font-semibold uppercase tracking-[0.08em] text-muted">
          About you
        </legend>
        <div className="grid gap-x-4 gap-y-4 min-[480px]:grid-cols-2">
          <Field label="Your name" error={errors.userName?.message}>
            <input
              type="text"
              autoComplete="off"
              className={`${control} font-display text-xl ${borderState(Boolean(errors.userName))}`}
              {...register("userName")}
            />
          </Field>
          <Field label="Your age" error={errors.userAge?.message}>
            <input
              type="number"
              inputMode="numeric"
              className={`${control} font-display text-xl ${borderState(Boolean(errors.userAge))}`}
              {...register("userAge")}
            />
          </Field>
        </div>
      </m.fieldset>

      {/* About them */}
      <m.fieldset variants={item} className="m-0 mt-8 min-w-0 border-0 border-t border-border p-0 pt-8">
        <legend className="mb-4 font-ui text-[0.8125rem] font-semibold uppercase tracking-[0.08em] text-muted">
          About them
        </legend>
        <div className="grid gap-x-4 gap-y-4 min-[480px]:grid-cols-2">
          <Field label="Who are they to you?" error={errors.relationship?.message}>
            <select
              defaultValue=""
              className={`${control} font-body text-lg ${borderState(Boolean(errors.relationship))}`}
              {...register("relationship")}
            >
              <option value="" disabled>
                Choose…
              </option>
              {RELATIONSHIPS.map((r) => (
                <option key={r} value={r}>
                  {cap(r)}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Their name" error={errors.personName?.message}>
            <input
              type="text"
              autoComplete="off"
              className={`${control} font-display text-xl ${borderState(Boolean(errors.personName))}`}
              {...register("personName")}
            />
          </Field>
          <Field label="Their age" error={errors.personAge?.message}>
            <input
              type="number"
              inputMode="numeric"
              className={`${control} font-display text-xl ${borderState(Boolean(errors.personAge))}`}
              {...register("personAge")}
            />
          </Field>
          <Field label="Where they've lived" error={errors.location?.message}>
            <select
              defaultValue=""
              className={`${control} font-body text-lg ${borderState(Boolean(errors.location))}`}
              {...register("location")}
            >
              <option value="" disabled>
                Choose…
              </option>
              {LOCATIONS.map((l) => (
                <option key={l.value} value={l.value}>
                  {l.label}
                </option>
              ))}
            </select>
          </Field>
        </div>
      </m.fieldset>

      <m.div variants={item} className="mt-8 flex min-[480px]:justify-end">
        <m.button
          type="submit"
          disabled={isSubmitting}
          whileHover={reduced ? undefined : { y: -1 }}
          whileTap={reduced ? undefined : { y: 0 }}
          transition={{ duration: 0.15, ease: "easeOut" }}
          className="w-full rounded-full bg-accent px-7 py-3 font-ui text-[0.9375rem] font-semibold text-accent-text shadow-[0_1px_2px_rgba(42,38,34,0.12)] transition-colors hover:bg-accent-hover disabled:opacity-55 min-[480px]:w-auto"
        >
          See their world
        </m.button>
      </m.div>
    </m.form>
  );
}
