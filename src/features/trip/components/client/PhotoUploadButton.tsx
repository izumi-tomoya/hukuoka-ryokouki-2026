'use client';

import { useState, useRef } from 'react';
import { ImagePlus, Loader2 } from 'lucide-react';
import { addPhotoToEvent } from '@/features/trip/api/tripActions';

interface PhotoUploadButtonProps {
  eventId?: string;
}

export default function PhotoUploadButton({ eventId }: PhotoUploadButtonProps) {
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !eventId) return;

    setIsUploading(true);
    
    try {
      // 1. Vercel Blob API Route にアップロード
      const response = await fetch(
        `/api/upload?filename=${encodeURIComponent(file.name)}`,
        {
          method: 'POST',
          body: file,
        },
      );

      // JSONとして解析を試みる前にステータスをチェック
      if (!response.ok) {
        let errorMessage = 'Upload failed';
        try {
          const errorData = await response.json();
          errorMessage = errorData.details || errorData.error || errorMessage;
        } catch (e) {
          // JSON解析に失敗した場合はステータステキストを使用
          errorMessage = `Server error (${response.status}): ${response.statusText}`;
        }
        throw new Error(errorMessage);
      }
      
      const data = await response.json();
      const imageUrl = data.url;

      // 2. データベースを更新 (Server Action)
      const result = await addPhotoToEvent(eventId, imageUrl);
      
      if (!result.success) throw new Error(result.error);

      // 完了通知（オプション）
      // alert('思い出が追加されました！');
      
    } catch (error: any) {
      console.error('Upload Error:', error);
      alert('アップロードに失敗しました: ' + (error.message || '不明なエラー'));
    } finally {
      setIsUploading(false);
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
        disabled={isUploading}
        className="w-full flex items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-stone-200 py-6 text-[12px] font-bold text-stone-400 transition-all hover:border-rose-300 hover:bg-rose-50 hover:text-rose-500 group disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isUploading ? (
          <>
            <Loader2 size={20} className="animate-spin text-rose-500" />
            <span>思い出を保存中...</span>
          </>
        ) : (
          <>
            <div className="h-10 w-10 rounded-full bg-stone-50 flex items-center justify-center group-hover:bg-rose-100 transition-colors">
              <ImagePlus size={20} className="text-stone-400 group-hover:text-rose-500" />
            </div>
            <div className="text-left">
              <p className="text-stone-600 group-hover:text-rose-600">思い出の写真を追加する</p>
              <p className="text-[10px] font-medium text-stone-400 group-hover:text-rose-400">誰でも投稿してシェアできます ✨</p>
            </div>
          </>
        )}
      </button>
    </div>
  );
}
