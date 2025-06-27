import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from 'jose';

const SECRET_KEY = process.env.SECRET_KEY || " ";

export async function middleware(req: NextRequest) {
    const token = req.cookies.get("token")?.value; 
    const type = req.cookies.get("type")?.value;
    const { pathname } = req.nextUrl;
    if (!token) {
        if (pathname !== '/auth/login'&& pathname !== "/auth/register") {
            console.log("No token found, redirecting to login...");
            return NextResponse.redirect(new URL("/auth/login", req.url));
        }
        return NextResponse.next();
    }
    try {
        const secretKey = new TextEncoder().encode(SECRET_KEY);
        const { payload } = await jwtVerify(token, secretKey);
        console.log("Decoded Token:", payload);
        if (type === "doctor" && ["/auth/login", "/auth/register", "/"].includes(pathname)) {
            return NextResponse.redirect(new URL("/doctor", req.url));
        }
        if (token && (pathname === "/auth/login" || pathname === "/auth/register")) {
            return NextResponse.redirect(new URL("/", req.url));
        }
        if(!type && pathname === "/auth/login") {
            return NextResponse.redirect(new URL("/", req.url));
        }
        if (type === "doctor" && pathname === "/") {
            return NextResponse.redirect(new URL("/doctor", req.url));
        }
        return NextResponse.next();

    } catch (error) {
        console.log("Invalid token, redirecting to login...");
        const response = NextResponse.redirect(new URL("/auth/login", req.url));
        response.cookies.delete("token"); 
        return response;
    }
}

export const config = {
    matcher: ['/auth/login','/auth/register','/',"/doctor"],
};