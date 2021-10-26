import { NextResponse } from 'next/server';
export function middleware() {
    let res = NextResponse.next();
    return res;
}
