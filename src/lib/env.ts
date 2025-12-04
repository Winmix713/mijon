import { z } from 'zod';

const envSchema = z.object({
  VITE_SUPABASE_URL: z.string().url('Invalid Supabase URL'),
  VITE_SUPABASE_ANON_KEY: z.string().min(1, 'Supabase anon key is required'),
  VITE_ENV: z.enum(['development', 'staging', 'production']).default('development'),
  VITE_FEATURE_PHASE5: z
    .enum(['true', 'false'])
    .optional()
    .transform((val) => val === 'true'),
  VITE_FEATURE_PHASE6: z
    .enum(['true', 'false'])
    .optional()
    .transform((val) => val === 'true'),
  VITE_FEATURE_PHASE7: z
    .enum(['true', 'false'])
    .optional()
    .transform((val) => val === 'true'),
  VITE_FEATURE_PHASE8: z
    .enum(['true', 'false'])
    .optional()
    .transform((val) => val === 'true'),
  VITE_FEATURE_PHASE9: z
    .enum(['true', 'false'])
    .optional()
    .transform((val) => val === 'true'),
});

export type Env = z.infer<typeof envSchema>;

function validateEnv(): Env {
  try {
    return envSchema.parse(import.meta.env);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const missingVars = error.errors.map((err) => `${err.path.join('.')}: ${err.message}`);
      throw new Error(
        `Environment validation failed:\n${missingVars.join('\n')}\n\n` +
          `Please check your .env file and ensure all required variables are set.`
      );
    }
    throw error;
  }
}

export const env = validateEnv();

export const featureFlags = {
  phase5: env.VITE_FEATURE_PHASE5 || false,
  phase6: env.VITE_FEATURE_PHASE6 || false,
  phase7: env.VITE_FEATURE_PHASE7 || false,
  phase8: env.VITE_FEATURE_PHASE8 || false,
  phase9: env.VITE_FEATURE_PHASE9 || false,
};
