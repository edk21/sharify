import db from "@/lib/conns";
import { verifyJwtToken } from "@/lib/jwt"
import Blog from "@/models/Blog";

export async function GET(req) {
    await db.connect()

    try {
        const blogs = await Blog.find({}).limit(16).populate("authorId")
        return new Response(JSON.stringify(blogs), { status: 200 })
    } catch (error) {
        return new Response(JSON.stringify(null), { status: 500 })
    }
}

export async function POST(req) {
    await db.connect()

    // the form is like: "Bearer token"
    const accessToken = req.headers.get("authorization")
    const token = accessToken.split(' ')[1]

    console.log("acceddToken: ", accessToken)
    console.log("token: ", token)

    const decodedToken = verifyJwtToken(token)
    console.log("decodedToken: ", decodedToken)

    if (!accessToken || !decodedToken) {
        return new Response(JSON.stringify({ error: "Unthorized (wrong or expired) token"}), { status: 403 })
    }

    try {
        const body = await req.json()
        console.log("body: ", body)
        const newBlog = await Blog.create()

        return new Response(JSON.stringify(newBlog), { status: 201 })
    } catch (error) {
        return new Response(JSON.stringify(null), { status: 500 })
    }
}