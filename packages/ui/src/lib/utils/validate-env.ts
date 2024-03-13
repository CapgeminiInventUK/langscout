type EnvConfig = {
  key: string;
  required: boolean;
  type: 'string' | 'boolean' | 'url';
  conditional?: boolean; // If the variable's requirement is conditional on another variable
  dependsOn?: string; // The key of the variable this one depends on
  requiredIf?: boolean; // The required state of the depended variable
  isAuthProvider?: boolean; // New property to identify authentication providers

};

const configs: EnvConfig[] = [
  {
    key: 'LANGTRACE_API_URL',
    required: true,
    type: 'url'
  },
  /*
  --------------
  Authentication
  --------------
  */
  {
    key: 'NEXTAUTH_ENABLE',
    required: true,
    type: 'boolean'
  },
  {
    key: 'NEXTAUTH_URL',
    required: false,
    type: 'url',
    conditional: true,
    dependsOn: 'NEXTAUTH_ENABLE',
    requiredIf: true
  },
  {
    key: 'NEXTAUTH_SECRET',
    required: false,
    type: 'string',
    conditional: true,
    dependsOn: 'NEXTAUTH_ENABLE',
    requiredIf: true
  },
  /*
  GitHub Authentication
  */
  {
    key: 'NEXTAUTH_GITHUB',
    required: false,
    type: 'boolean',
    conditional: true,
    dependsOn: 'NEXTAUTH_ENABLE',
    requiredIf: true,
    isAuthProvider: true
  },
  {
    key: 'NEXTAUTH_GITHUB_ID',
    required: false,
    type: 'string',
    conditional: true,
    dependsOn: 'NEXTAUTH_GITHUB',
    requiredIf: true
  },
  {
    key: 'NEXTAUTH_GITHUB_SECRET',
    required: false,
    type: 'string',
    conditional: true,
    dependsOn: 'NEXTAUTH_GITHUB',
    requiredIf: true
  },
  {
    key: 'NEXTAUTH_GITHUB_ORGANISATION',
    required: false,
    type: 'string'
  },
  /*
   Azure AD Authentication
   */
  {
    key: 'NEXTAUTH_AZURE_AD',
    required: true,
    type: 'boolean',
    conditional: true,
    dependsOn: 'NEXTAUTH_ENABLE',
    requiredIf: true,
    isAuthProvider: true
  },
  {
    key: 'NEXTAUTH_AZURE_AD_CLIENT_ID',
    required: false,
    type: 'string',
    conditional: true,
    dependsOn: 'NEXTAUTH_AZURE_AD',
    requiredIf: true
  },
  {
    key: 'NEXTAUTH_AZURE_AD_CLIENT_SECRET',
    required: false,
    type: 'string',
    conditional: true,
    dependsOn: 'NEXTAUTH_AZURE_AD',
    requiredIf: true
  },
  {
    key: 'NEXTAUTH_AZURE_AD_TENANT_ID',
    required: false,
    type: 'string',
    conditional: true,
    dependsOn: 'NEXTAUTH_AZURE_AD',
    requiredIf: true
  },
];

function validateEnvVar(config: EnvConfig): void {
  const value = process.env[config.key];
  if (config.conditional) {
    const dependsOnValue = config.dependsOn ? process.env[config.dependsOn] : undefined;
    if (config.dependsOn && dependsOnValue !== undefined) {
      const conditionMet = (dependsOnValue === 'true') === config.requiredIf;
      if (!conditionMet) {
        return;
      }
      if (conditionMet && value === undefined) {
        throw new Error(
          `Environment variable ${config.key} is required if ${config.dependsOn} is ${
            config.requiredIf ? 'true' : 'false'
          }.`);
      }

    }
  }

  if (config.required && value === undefined) {
    throw new Error(`Environment variable ${config.key} is required but was not provided.`);
  }

  if (value !== undefined) {
    switch (config.type) {
      case 'boolean':
        if (value !== 'true' && value !== 'false') {
          throw new Error(`Environment variable ${config.key} must be either "true" or "false".`);
        }
        break;
      case 'url':
        try {
          new URL(value);
        } catch (_) {
          throw new Error(`Environment variable ${config.key} must be a valid URL.`);
        }
        break;
      case 'string':
        // No specific validation for strings
        break;
    }
  }
}

function validateAuthProviders(): void {
  if (process.env['NEXTAUTH_ENABLE'] === 'true') {
    const authProvidersEnabled =
      configs.filter(config => config.isAuthProvider)
        .some(config => process.env[config.key] === 'true');
    if (!authProvidersEnabled) {
      throw new Error(
        'When NEXTAUTH_ENABLE is true, at least one authentication provider must be enabled.'
      );
    }
  }
}

export function validateEnv(): void {
  configs.forEach(validateEnvVar);
  validateAuthProviders();

}
