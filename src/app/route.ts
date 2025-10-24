import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
    // generate a random 4-digit code (includes leading zeros)
    const code = Math.floor(Math.random() * 10000).toString().padStart(4, '0')

    // redirect to /<code> on the same origin
    const destination = new URL(`/${code}`, request.url)
    return NextResponse.redirect(destination)
}