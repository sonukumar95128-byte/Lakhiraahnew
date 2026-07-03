import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

// Images stored in home dir — never wiped by deploys
const IMG_DIR = "/home/u771790581/domains/lakshiraah.com/product-images";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ filename: string }> }
) {
  const { filename } = await params;

  // Security: only allow safe filenames (alphanumeric, dash, underscore, dot)
  if (!/^[\w\-]+\.webp$/.test(filename)) {
    return new NextResponse("Not found", { status: 404 });
  }

  const filePath = path.join(IMG_DIR, filename);

  try {
    const buffer = fs.readFileSync(filePath);
    return new NextResponse(buffer, {
      headers: {
        "Content-Type": "image/webp",
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch {
    return new NextResponse("Not found", { status: 404 });
  }
}
