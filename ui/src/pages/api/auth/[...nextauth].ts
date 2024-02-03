import NextAuth, { NextAuthOptions } from 'next-auth';
import GithubProvider from 'next-auth/providers/github';
import { NextApiRequest, NextApiResponse } from 'next';

const enableAuth = process.env.NEXTAUTH_ENABLE === 'true';

const options = {
  providers: [
    GithubProvider({
      clientId: process.env.NEXTAUTH_GITHUB_ID,
      clientSecret: process.env.NEXTAUTH_GITHUB_SECRET,
      authorization: {
        params: {
          scope: 'read:user,user:email,read:org',
        },
      },
    }),
  ],
  callbacks: {
    async signIn({ account, profile }) {
      if (account?.provider === 'github' &&
        (process.env.NEXTAUTH_GITHUB_ORGANISATION ?? '').trim() !== '') {

        const orgName = process.env.NEXTAUTH_GITHUB_ORGANISATION;
        const token = account.access_token;
        const url = `https://api.github.com/orgs/${orgName}/members/${profile?.login}`;
        const response = await fetch(url, {
          headers: {
            Authorization: `token ${token}`,
          },
        });
        console.log('response', response);
        return response.ok;
      }
      // If not GitHub, continue the sign-in process
      return true;
    },
  },
} satisfies NextAuthOptions;

// eslint-disable-next-line import/no-anonymous-default-export
export default (req: NextApiRequest, res: NextApiResponse) => {
  if (enableAuth) {
    // Initialize NextAuth if auth is enabled
    return NextAuth(req, res, options);
  } else {
    res.status(200).json({ message: 'Authentication bypassed' });
  }
};
