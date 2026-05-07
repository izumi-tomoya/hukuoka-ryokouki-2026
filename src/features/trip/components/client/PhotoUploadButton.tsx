'use client';

import { useState, useRef } from 'react';
import { ImagePlus, Loader2 } from 'lucide-react';
import { addPhotoToEvent } from '@/features/trip/api/tripActions';
import imageCompression from 'browser-image-compression';

interface PhotoUploadButtonProps {
  eventId?: string;
}

export default function PhotoUploadButton({ eventId }: PhotoUploadButtonProps) {
  const [status, setStatus] = useState<'idle' | 'compressing' | 'uploading'>('idle');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !eventId) return;

    try {
      // 1. 画像の圧縮 (軽量化)
      setStatus('compressing');
      const options = {
        maxSizeMB: 0.8, // 1MB未満に抑える
        maxWidthOrHeight: 1920, // フルHDサイズを上限にする
        useWebWorker: true,
      };
      
      const compressedFile = await imageCompression(file, options);
      console.log(`Original size: ${(file.size / 1024 / 1024).toFixed(2)} MB`);
      console.log(`Compressed size: ${(compressedFile.size / 1024 / 1024).toFixed(2)} MB`);

      // 2. Vercel Blob API Route にアップロード
      setStatus('uploading');
      const response = await fetch(
        `/api/upload?filename=${encodeURIComponent(compressedFile.name)}`,
        {
          method: 'POST',
          body: compressedFile,
        },
      );

      if (!response.ok) {
        let errorMessage = 'Upload failed';
        try {
          const errorData = await response.json();
          errorMessage = errorData.details || errorData.error || errorMessage;
        } catch {
          errorMessage = `Server error (${response.status})`;
        }
        throw new Error(errorMessage);
      }
      
      const data = await response.json();
      const imageUrl = data.url;

      // 3. データベースを更新 (Server Action)
      const result = await addPhotoToEvent(eventId, imageUrl);
      if (!result.success) throw new Error(result.error);
      
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "unknown upload error";
      console.error('Upload Error:', message);
      alert('アップロードに失敗しました: ' + message);
    } finally {
      setStatus('idle');
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  if (!eventId) return null;

  return (
    <div className="mt-4">
      <input 
        type="file" 
        accept="image/*" 
        className="hidden" 
        ref={fileInputRef}
        onChange={handleUpload}
      />
      
      <button 
        onClick={() => fileInputRef.current?.click()}
        disabled={status !== 'idle'}
        className="w-full flex items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-stone-200 py-6 text-[12px] font-bold text-stone-400 transition-all hover:border-rose-300 hover:bg-rose-50 hover:text-rose-500 group disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {status !== 'idle' ? (
          <>
            <Loader2 size={20} className="animate-spin text-rose-500" />
            <span>{status === 'compressing' ? '画像を軽量化中...' : '思い出を保存中...'}</span>
          </>
        ) : (
          <>
            <div className="h-10 w-10 rounded-full bg-stone-50 flex items-center justify-center group-hover:bg-rose-100 transition-colors">
              <ImagePlus size={20} className="text-stone-400 group-hover:text-rose-500" />
            </div>
            <div className="text-left">
              <p className="text-stone-600 group-hover:text-rose-600">思い出の写真を追加する</p>
              <p className="text-[10px] font-medium text-stone-400 group-hover:text-rose-400">自動で軽量化してアップロードします ✨</p>
            </div>
          </>
        )}
      </button>
    </div>
  );
}
