// app/api/signup/route.ts
import { NextResponse } from 'next/server';
import { Pool } from 'pg';
import bcrypt from 'bcryptjs';

// Configure PostgreSQL connection pool
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false,
    },
});

export async function POST(request: Request) {
    try {
        const { name, email, password } = await request.json();

        // Validate request body
        if (!name || !email || !password) {
            return NextResponse.json(
                { message: 'All fields are required' },
                { status: 400 }
            );
        }

        // Hash password before storing
        const hashedPassword = await bcrypt.hash(password, 10);

        // Database insert operation
        const client = await pool.connect();
        try {
            const result = await client.query(
                `INSERT INTO users (name, email, password)
         VALUES ($1, $2, $3)
         RETURNING id, email `,
                [name, email, hashedPassword]
            );

            return NextResponse.json({
                success: true,
                user: result.rows[0],
                message: 'User created successfully'
            });

        } catch (error: any) {
            // Handle unique constraint violation (duplicate email)
            if (error.code === '23505') {
                return NextResponse.json(
                    { message: 'Email already exists' },
                    { status: 409 }
                );
            }
            throw error;
        } finally {
            client.release();
        }

    } catch (error: any) {
        console.error('Signup error:', error);
        return NextResponse.json(
            { message: error.message || 'Internal server error' },
            { status: error.status || 500 }
        );
    }
}