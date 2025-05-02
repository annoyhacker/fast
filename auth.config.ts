import type { NextAuthConfig } from 'next-auth';

export const authConfig = {
    pages: {
        signIn: '/login',
    },
    callbacks: {
        authorized({ auth, request: { nextUrl } }) {
            const isLoggedIn = !!auth?.user;
            const path = nextUrl.pathname;

            if (path.startsWith('/signup')) {
                return !isLoggedIn; // Allow access if not logged in
            }

            if (path.startsWith('/dashboard')) {
                return isLoggedIn;
            }

            return true;
        },
    },
    providers: [],
} satisfies NextAuthConfig;