import { validateEnv } from '@/lib/utils/validate-env';

export async function register() {
  validateEnv();
}
