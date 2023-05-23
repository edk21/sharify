import db from "@/lib/conns";
import bcrypt from "bcrypt"
import User from "@/models/User";

export async function POST(req) {
    try {
        await db.connect()

        const { username, email, password: pass } = await req.json()

        const isExisting = await User.findOne({ email })
        if (isExisting) {
            throw new Error("User already exist! ")
        }

        const hashedPassword = await bcrypt.hash(pass, 12)

        const newUser = await User.create({ username, email, password: hashedPassword })

        const { password, ...user } = newUser._doc

        return new Response(JSON.stringify(user), {status: 200})
    } catch (error) {
        return new Response(JSON.stringify(error.message), {status: 500})
    }
} 
