import { NextAuthOptions } from 'next-auth';
import GithubProvider from 'next-auth/providers/github';
import AzureADProvider from 'next-auth/providers/azure-ad';

export const authOptions: NextAuthOptions = {
  providers: [
    GithubProvider({
      clientId: process.env.NEXTAUTH_GITHUB_ID!,
      clientSecret: process.env.NEXTAUTH_GITHUB_SECRET!,
      authorization: {
        params: {
          scope: 'read:user,user:email,read:org',
        },
      },
    }),
    AzureADProvider({
      clientId: process.env.NEXTAUTH_AZURE_AD_CLIENT_ID!,
      clientSecret: process.env.NEXTAUTH_AZURE_AD_CLIENT_SECRET!,
      tenantId: process.env.NEXTAUTH_AZURE_AD_TENANT_ID,
    }),
  ],
};
