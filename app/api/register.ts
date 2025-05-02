// pages/api/register.ts

import { NextApiRequest, NextApiResponse } from 'next';
import bcrypt from 'bcryptjs';
import postgres from 'postgres';

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        const { email, password } = req.body;

        // Hash the password before saving
        const hashedPassword = await bcrypt.hash(password, 10);

        try {
            // Insert the new user into the database
            await sql`INSERT INTO users (email, password) VALUES (${email}, ${hashedPassword})`;

            // Return a success response
            return res.status(200).json({ message: 'User registered successfully' });
        } catch (err) {
            console.error('Error registering user:', err);
            return res.status(500).json({ error: 'Error registering user' });
        }
    } else {
        // If method is not POST, return 405 (Method Not Allowed)
        return res.status(405).json({ error: 'Method Not Allowed' });
    }
}
