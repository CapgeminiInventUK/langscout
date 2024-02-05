import { z } from 'zod';

//TODO Add in missing environment variables for Auth
const configSchema = z.object({
  langtraceApiUrl: z.string().url(),
});

type Config = z.infer<typeof configSchema>;

const config: Config = configSchema.parse({
  langtraceApiUrl: process.env.LANGTRACE_API_URL,
});

export default config;
