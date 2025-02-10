import { NextResponse } from "next/server";
import connectToDatabase from "../../lib/mongoose";
import Podcast from "@/models/Podcast";
import { authorizeAdmin } from "../../lib/authorization";

// ✅ Utility function to set CORS headers
function setCorsHeaders(response: NextResponse) {
  response.headers.set("Access-Control-Allow-Origin", "*"); // Allow all origins (Change in production)
  response.headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  response.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
  return response;
}

// ✅ Handle OPTIONS requests (Preflight)
export async function OPTIONS() {
  return setCorsHeaders(NextResponse.json({ message: "CORS Preflight OK" }));
}

// **GET**: Fetch all podcasts (Public)
export async function GET() {
  try {
    await connectToDatabase();
    const podcasts = await Podcast.find({});
    return setCorsHeaders(NextResponse.json(podcasts));
  } catch (error) {
    return setCorsHeaders(NextResponse.json({ error: "Failed to fetch podcasts" }, { status: 500 }));
  }
}

// **POST**: Add a new podcast (Admins Only)
export async function POST(req: Request) {
  try {
    const admin = authorizeAdmin(req);
    if (admin instanceof NextResponse) return admin; // Unauthorized response

    const body = await req.json();
    await connectToDatabase();
    const podcast = new Podcast(body);
    await podcast.save();

    return setCorsHeaders(NextResponse.json({ message: "Podcast added successfully", podcast }));
  } catch (error) {
    return setCorsHeaders(NextResponse.json({ error: "Failed to add podcast" }, { status: 500 }));
  }
}

// **PUT**: Update a podcast (Admins Only)
export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const admin = authorizeAdmin(req);
    if (admin instanceof NextResponse) return admin; // Unauthorized response

    const body = await req.json();
    await connectToDatabase();
    const updatedPodcast = await Podcast.findByIdAndUpdate(params.id, body, { new: true });

    if (!updatedPodcast) {
      return setCorsHeaders(NextResponse.json({ error: "Podcast not found" }, { status: 404 }));
    }

    return setCorsHeaders(NextResponse.json(updatedPodcast));
  } catch (error) {
    return setCorsHeaders(NextResponse.json({ error: "Failed to update podcast" }, { status: 500 }));
  }
}

// **DELETE**: Remove a podcast (Admins Only)
export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const admin = authorizeAdmin(req);
    if (admin instanceof NextResponse) return admin; // Unauthorized response

    await connectToDatabase();
    const deletedPodcast = await Podcast.findByIdAndDelete(params.id);

    if (!deletedPodcast) {
      return setCorsHeaders(NextResponse.json({ error: "Podcast not found" }, { status: 404 }));
    }

    return setCorsHeaders(NextResponse.json({ message: "Podcast deleted successfully" }));
  } catch (error) {
    return setCorsHeaders(NextResponse.json({ error: "Failed to delete podcast" }, { status: 500 }));
  }
}
