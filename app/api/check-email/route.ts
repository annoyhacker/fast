// app/api/check-email/route.ts
import { NextResponse } from 'next/server';
import { Pool } from 'pg';


const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false,
    },
});

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const email = searchParams.get('email');

        if (!email) {
            return NextResponse.json(
                { message: 'Email is required' },
                { status: 400 }
            );
        }

        const client = await pool.connect();
        try {
            const result = await client.query(
                'SELECT 1 FROM users WHERE email = $1 LIMIT 1',
                [email]
            );

            return NextResponse.json({ exists: result.rowCount! > 0 });
        } finally {
            client.release();
        }
    } catch (error) {
        console.error('Email check error:', error);
        return NextResponse.json(
            { message: 'Error checking email' },
            { status: 500 }
        );
    }
}