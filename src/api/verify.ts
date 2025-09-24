import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken';

export async function GET(req: NextRequest) {
  const token = req.headers.get('authorization')?.replace('Bearer ', '')
  
  if (!token) {
    return NextResponse.json({ valid: false }, { status: 401 })
  }

  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY!)
    return NextResponse.json({ valid: true, user: decoded })
  } catch {
    return NextResponse.json({ valid: false }, { status: 401 })
  }
}