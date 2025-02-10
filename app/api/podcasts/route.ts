import { NextResponse } from "next/server";
import connectToDatabase from "../../lib/mongoose";
import Podcast from "@/models/Podcast";
import { authorizeAdmin } from "../../lib/authorization";

// **GET**: Fetch all podcasts (Public)
export async function GET() {
  try {
    await connectToDatabase();
    const podcasts = await Podcast.find({});
    return NextResponse.json(podcasts);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch podcasts" }, { status: 500 });
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

    return NextResponse.json({ message: "Podcast added successfully", podcast });
  } catch (error) {
    return NextResponse.json({ error: "Failed to add podcast" }, { status: 500 });
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
      return NextResponse.json({ error: "Podcast not found" }, { status: 404 });
    }

    return NextResponse.json(updatedPodcast);
  } catch (error) {
    return NextResponse.json({ error: "Failed to update podcast" }, { status: 500 });
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
      return NextResponse.json({ error: "Podcast not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Podcast deleted successfully" });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete podcast" }, { status: 500 });
  }
}
