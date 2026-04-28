'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { auth } from '@/lib/auth';

export async function updateUserProfile(data: { name: string; motto?: string }) {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, error: '認証が必要です' };
  }

  if (!data.name || data.name.trim().length === 0) {
    return { success: false, error: '名前を入力してください' };
  }

  try {
    await prisma.user.update({
      where: { id: session.user.id },
      data: { 
        name: data.name.trim(),
        motto: data.motto?.trim() || null
      },
    });
    revalidatePath('/user');
    return { success: true };
  } catch (error) {
    console.error('Failed to update user profile:', error);
    return { success: false, error: '更新に失敗しました' };
  }
}
