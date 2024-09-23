import { validateEnv } from '@/lib/utils/validate-env';
import { config as originalConfig } from 'dotenv';

jest.mock('dotenv');

describe('validateEnv', () => {
  let config: jest.Mock;

  beforeEach(() => {
    config = originalConfig as jest.Mock;
    // @ts-ignore
    process.env = {};
  });

  describe('langscout api', () => {

    it('should throw error when required environment variable is missing', () => {
      expect(validateEnv)
        .toThrowError('Environment variable LANGSCOUT_API_URL is required but was not provided.');
    });

    it('should throw error when url environment variable is not a valid url', () => {
      process.env.LANGSCOUT_API_URL = 'not a url';

      expect(validateEnv)
        .toThrowError('Environment variable LANGSCOUT_API_URL must be a valid URL.');
    });
  });

  describe('authentication', () => {
    describe('NEXTAUTH_ENABLE', () => {

      it('should not throw error when authentication is disabled', () => {
        process.env.LANGSCOUT_API_URL = 'http://localhost';
        process.env.NEXTAUTH_ENABLE = 'false';

        expect(validateEnv).not.toThrow();
      });

      it('should throw error when authentication is enable but not NEXTAUTH_URL is not set', () => {
        process.env.LANGSCOUT_API_URL = 'http://localhost';
        process.env.NEXTAUTH_ENABLE = 'true';

        expect(validateEnv).toThrowError('Environment variable NEXTAUTH_URL is required if NEXTAUTH_ENABLE is true.');
      });

      it('should throw error when authentication is enable but not NEXTAUTH_SECRET is not set', () => {
        process.env.LANGSCOUT_API_URL = 'http://localhost';
        process.env.NEXTAUTH_ENABLE = 'true';
        process.env.NEXTAUTH_URL = 'http://localhost';

        expect(validateEnv).toThrowError('Environment variable NEXTAUTH_SECRET is required if NEXTAUTH_ENABLE is true.');
      });

      it('should throw error when boolean environment variable is not "true" or "false"', () => {
        process.env.LANGSCOUT_API_URL = 'http://localhost';
        process.env.NEXTAUTH_ENABLE = 'not a boolean';

        expect(validateEnv)
          .toThrowError('Environment variable NEXTAUTH_ENABLE must be either "true" or "false".');
      });

      it('should throw error when authentication is enabled but all auth options are disabled', () => {
        process.env.LANGSCOUT_API_URL = 'http://localhost';
        process.env.NEXTAUTH_ENABLE = 'true';
        process.env.NEXTAUTH_URL = 'http://localhost';
        process.env.NEXTAUTH_SECRET = 'secret';
        process.env.NEXTAUTH_AZURE_AD = 'false';
        process.env.NEXTAUTH_GITHUB = 'false';

        expect(validateEnv)
          .toThrowError('When NEXTAUTH_ENABLE is true, at least one authentication provider must be enabled.');
      });
    });

    describe('NEXTAUTH_AZURE_AD', () => {
      it('should not throw error when Azure AD enabled but NEXTAUTH_AZURE_AD_CLIENT_ID is missing', () => {
        process.env.LANGSCOUT_API_URL = 'http://localhost';
        process.env.NEXTAUTH_ENABLE = 'true';
        process.env.NEXTAUTH_URL = 'http://localhost';
        process.env.NEXTAUTH_SECRET = 'secret';
        process.env.NEXTAUTH_GITHUB = 'false';
        process.env.NEXTAUTH_AZURE_AD = 'true';
        expect(validateEnv)
          .toThrowError('Environment variable NEXTAUTH_AZURE_AD_CLIENT_ID is required if NEXTAUTH_AZURE_AD is true.');
      });
      it('should not throw error when Azure AD enabled but NEXTAUTH_AZURE_AD_CLIENT_SECRET is missing', () => {
        process.env.LANGSCOUT_API_URL = 'http://localhost';
        process.env.NEXTAUTH_ENABLE = 'true';
        process.env.NEXTAUTH_URL = 'http://localhost';
        process.env.NEXTAUTH_SECRET = 'secret';
        process.env.NEXTAUTH_GITHUB = 'false';
        process.env.NEXTAUTH_AZURE_AD = 'true';
        process.env.NEXTAUTH_AZURE_AD_CLIENT_ID = 'dasdsadas';
        expect(validateEnv)
          .toThrowError('Environment variable NEXTAUTH_AZURE_AD_CLIENT_SECRET is required if NEXTAUTH_AZURE_AD is true.');
      });

      it('should not throw error when Azure AD enabled but NEXTAUTH_AZURE_AD_TENANT_ID is missing', () => {
        process.env.LANGSCOUT_API_URL = 'http://localhost';
        process.env.NEXTAUTH_ENABLE = 'true';
        process.env.NEXTAUTH_URL = 'http://localhost';
        process.env.NEXTAUTH_SECRET = 'secret';
        process.env.NEXTAUTH_GITHUB = 'false';
        process.env.NEXTAUTH_AZURE_AD = 'true';
        process.env.NEXTAUTH_AZURE_AD_CLIENT_ID = 'dasdsadas';
        process.env.NEXTAUTH_AZURE_AD_CLIENT_SECRET = 'secret';
        expect(validateEnv)
          .toThrowError('Environment variable NEXTAUTH_AZURE_AD_TENANT_ID is required if NEXTAUTH_AZURE_AD is true.');
      });
    });

    describe('NEXTAUTH_GITHUB', () => {
      it('should not throw error when github enabled but NEXTAUTH_GITHUB_ID is missing', () => {
        process.env.LANGSCOUT_API_URL = 'http://localhost';
        process.env.NEXTAUTH_ENABLE = 'true';
        process.env.NEXTAUTH_URL = 'http://localhost';
        process.env.NEXTAUTH_SECRET = 'secret';
        process.env.NEXTAUTH_AZURE_AD = 'false';
        process.env.NEXTAUTH_GITHUB = 'true';
        expect(validateEnv)
          .toThrowError('Environment variable NEXTAUTH_GITHUB_ID is required if NEXTAUTH_GITHUB is true.');
      });

      it('should not throw error when github enabled but NEXTAUTH_GITHUB_SECRET is missing', () => {
        process.env.LANGSCOUT_API_URL = 'http://localhost';
        process.env.NEXTAUTH_ENABLE = 'true';
        process.env.NEXTAUTH_URL = 'http://localhost';
        process.env.NEXTAUTH_SECRET = 'secret';
        process.env.NEXTAUTH_AZURE_AD = 'false';
        process.env.NEXTAUTH_GITHUB = 'true';
        process.env.NEXTAUTH_GITHUB_ID = '31231';
        expect(validateEnv)
          .toThrowError('Environment variable NEXTAUTH_GITHUB_SECRET is required if NEXTAUTH_GITHUB is true.');
      });
    });
  });
});
