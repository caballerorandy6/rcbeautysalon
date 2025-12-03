import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth/auth"
import { v2 as cloudinary } from "cloudinary"

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

// Upload type configurations
type UploadType = "avatar" | "service" | "product" | "staff"

const uploadConfigs: Record<UploadType, { folder: string; transformation: object[] }> = {
  avatar: {
    folder: "Beauty Salon/avatars",
    transformation: [
      { width: 400, height: 400, crop: "fill", gravity: "face" },
      { quality: "auto", fetch_format: "auto" },
    ],
  },
  service: {
    folder: "Beauty Salon/services",
    transformation: [
      { width: 800, height: 600, crop: "fill" },
      { quality: "auto", fetch_format: "auto" },
    ],
  },
  product: {
    folder: "Beauty Salon/products",
    transformation: [
      { width: 600, height: 600, crop: "fill" },
      { quality: "auto", fetch_format: "auto" },
    ],
  },
  staff: {
    folder: "Beauty Salon/staff",
    transformation: [
      { width: 400, height: 500, crop: "fill", gravity: "face" },
      { quality: "auto", fetch_format: "auto" },
    ],
  },
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const formData = await request.formData()
    const file = formData.get("file") as File | null
    const type = (formData.get("type") as UploadType) || "avatar"
    const customId = formData.get("customId") as string | null

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    // Validate file type
    if (!file.type.startsWith("image/")) {
      return NextResponse.json({ error: "File must be an image" }, { status: 400 })
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: "File size must be less than 5MB" }, { status: 400 })
    }

    // Get config for upload type
    const config = uploadConfigs[type] || uploadConfigs.avatar

    // Convert file to base64
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const base64 = `data:${file.type};base64,${buffer.toString("base64")}`

    // Generate public_id based on type
    const publicId = customId || `${type}_${Date.now()}`

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(base64, {
      folder: config.folder,
      public_id: publicId,
      overwrite: true,
      transformation: config.transformation,
    })

    return NextResponse.json({
      success: true,
      url: result.secure_url,
      publicId: result.public_id,
    })
  } catch (error) {
    console.error("Upload error:", error)
    return NextResponse.json({ error: "Upload failed" }, { status: 500 })
  }
}
