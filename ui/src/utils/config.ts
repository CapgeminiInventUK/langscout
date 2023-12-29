import { z } from 'zod';

const configSchema = z.object({
  langMonitorApiUrl: z.string().url(),
});

type Config = z.infer<typeof configSchema>;

const config: Config = configSchema.parse({
  langMonitorApiUrl: process.env.LANGMONITOR_API_URL,
});

export default config;
