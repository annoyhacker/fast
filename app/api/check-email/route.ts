// app/api/check-email/route.ts
import { NextResponse } from 'next/server';
import postgres from 'postgres';

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

export async function POST(request: Request) {
    const { email } = await request.json();

    try {
        const user = await sql`SELECT id FROM users WHERE email = ${email}`;
        return NextResponse.json({ exists: user.length > 0 });
    } catch (error) {
        return NextResponse.json(
            { error: 'Database error' },
            { status: 500 }
        );
    }
}