import { NextResponse } from 'next/server'
import NextAuth from 'next-auth'
import { authOptions } from '@/lib/authOptions'

export { GET, POST }
    from "next-auth/next"
export const handler = NextAuth(authOptions)
