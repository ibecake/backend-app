import { NextResponse } from "next/server";
import connectToDatabase from "../../lib/mongoose";
import User from "@/models/User";
import { generateToken } from "../../lib/auth";

// **POST /api/auth/signup** → Register new users
export async function POST(req: Request) {
  try {
    await connectToDatabase();
    const { email, password, role } = await req.json();

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ error: "User already exists" }, { status: 400 });
    }

    const newUser = new User({ email, password, role });
    await newUser.save();

    const token = generateToken(newUser._id.toString(), newUser.role);
    return NextResponse.json({ token, user: { email, role } });
  } catch (error) {
    return NextResponse.json({ error: "Signup failed" }, { status: 500 });
  }
}

// **POST /api/auth/login** → Authenticate users
export async function LOGIN(req: Request) {
  try {
    await connectToDatabase();
    const { email, password } = await req.json();

    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const token = generateToken(user._id.toString(), user.role);
    return NextResponse.json({ token, user: { email, role: user.role } });
  } catch (error) {
    return NextResponse.json({ error: "Login failed" }, { status: 500 });
  }
}
