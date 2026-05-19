import { put } from "@vercel/blob";
import { NextResponse } from "next/server";
import path from "node:path";
import { auth } from "@/lib/auth";

export const dynamic = "force-dynamic";

const ALLOWED_EXTENSIONS = [".jpg", ".jpeg", ".png", ".webp", ".gif", ".svg"];
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export async function POST(request: Request): Promise<NextResponse> {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = process.env.BLOB_READ_WRITE_TOKEN;

    if (!token) {
      return NextResponse.json(
        {
          error: "BLOB_READ_WRITE_TOKEN が設定されていません。",
          details: ".envファイルを確認し、サーバーを再起動してください。",
        },
        { status: 500 },
      );
    }

    const { searchParams } = new URL(request.url);
    const filename = searchParams.get("filename");

    if (!filename) {
      return NextResponse.json({ error: "Filename is required" }, { status: 400 });
    }

    // ファイル形式の検証
    const ext = path.extname(filename).toLowerCase();
    if (!ALLOWED_EXTENSIONS.includes(ext)) {
      return NextResponse.json({ error: "許可されていないファイル形式です。" }, { status: 400 });
    }

    const blob = await request.blob();

    if (blob.size === 0) {
      return NextResponse.json({ error: "Body is empty" }, { status: 400 });
    }

    if (blob.size > MAX_FILE_SIZE) {
      return NextResponse.json({ error: "ファイルサイズが大きすぎます（最大10MB）。" }, { status: 400 });
    }

    // 安全でユニークなファイル名の生成
    const safeFilename = `uploads/${Date.now()}-${Math.random().toString(36).slice(2)}${ext}`;

    const result = await put(safeFilename, blob, {
      access: "public",
      token: token,
    });

    return NextResponse.json(result);
  } catch (error: unknown) {
    const err = error as Error;
    console.error("Blob Upload Error:", err.message || "unknown upload error");
    return NextResponse.json(
      {
        error: "アップロード中にエラーが発生しました。",
        details: err.message || "不明なエラー",
      },
      { status: 500 },
    );
  }
}
