import { put } from '@vercel/blob';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(request: Request): Promise<NextResponse> {
  try {
    const token = process.env.BLOB_READ_WRITE_TOKEN;

    if (!token) {
      return NextResponse.json({ 
        error: 'BLOB_READ_WRITE_TOKEN が設定されていません。',
        details: '.envファイルを確認し、サーバーを再起動してください。' 
      }, { status: 500 });
    }

    const { searchParams } = new URL(request.url);
    const filename = searchParams.get('filename');

    if (!filename) {
      return NextResponse.json({ error: 'Filename is required' }, { status: 400 });
    }

    const blob = await request.blob();

    if (blob.size === 0) {
      return NextResponse.json({ error: 'Body is empty' }, { status: 400 });
    }

    const result = await put(filename, blob, {
      access: 'public',
      token: token,
    });

    return NextResponse.json(result);

  } catch (error: unknown) {
    const err = error as Error;
    console.error('Blob Upload Error:', err.message || "unknown upload error");
    return NextResponse.json({ 
      error: 'アップロード中にエラーが発生しました。',
      details: err.message || "不明なエラー"
    }, { status: 500 });
  }
}
