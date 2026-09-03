import type { User } from '@/types';

export const AUTH_TOKEN_KEY = 'nova_token';
export const AUTH_USER_KEY = 'nova_user';
export const AUTH_EXPIRED_EVENT = 'nova:auth-expired';

export function clearAuthStorage(): void {
  localStorage.removeItem(AUTH_TOKEN_KEY);
  localStorage.removeItem(AUTH_USER_KEY);
}

export function parseStoredUser(raw: string): User | null {
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object') return null;
    const candidate = parsed as Partial<User>;
    if (
      typeof candidate.id !== 'string' ||
      typeof candidate.name !== 'string' ||
      typeof candidate.email !== 'string' ||
      (candidate.role !== 'customer' && candidate.role !== 'admin')
    ) {
      return null;
    }
    return {
      id: candidate.id,
      name: candidate.name,
      email: candidate.email,
      role: candidate.role,
    };
  } catch {
    return null;
  }
}

export function getPostAuthRedirect(from?: { pathname?: string; search?: string }): string {
  const path = from?.pathname;
  if (
    !path ||
    !path.startsWith('/') ||
    path.startsWith('//') ||
    path.startsWith('/login') ||
    path.startsWith('/register')
  ) {
    return '/';
  }
  return `${path}${from.search ?? ''}`;
}

export function isPopulatedProduct(
  product: unknown
): product is { _id: string; name: string; category: string; price: number; stock: number } {
  if (!product || typeof product !== 'object') return false;
  const p = product as Record<string, unknown>;
  return (
    typeof p._id === 'string' &&
    typeof p.name === 'string' &&
    typeof p.price === 'number'
  );
}
