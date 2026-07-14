import { NextRequest, NextResponse } from "next/server";
import { auth } from "./auth";

export default async function proxy(req: NextRequest) {
    console.log('proxy is run in path:', req.nextUrl.pathname);
    
    const session = await auth();
    
    const userIsLogedIn : boolean = Boolean(session)
    const currentUrl = req.nextUrl.pathname
    if ((currentUrl === "/register" || currentUrl === "/") && userIsLogedIn == true) {
        return NextResponse.redirect(new URL("/admin", req.nextUrl));
    }
    if (currentUrl === "/profile" && userIsLogedIn != true) {
        return NextResponse.redirect(new URL("/", req.nextUrl));
    }
    if (currentUrl === "/admin" && userIsLogedIn != true) {
        return NextResponse.redirect(new URL("/", req.nextUrl));
    }
    if (currentUrl.includes('/admin') && userIsLogedIn != true) {
        return NextResponse.redirect(new URL("/", req.nextUrl));
    }
    return NextResponse.next();
}

export const config = {
    matcher: [
        "/", 
        "/register", 
        "/admin/profile", 
        "/admin/transactions", 
        "/admin/wallets",
        "/admin",
        "/admin/profile"
    ]
};
