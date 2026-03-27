import { createBrowserClient } from '@supabase/ssr'

const SINGLETON_KEY = '__supabase_client__'

export function createClient() {
  if (typeof window === 'undefined') {
    return createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
  }

  const g = globalThis as unknown as Record<string, ReturnType<typeof createBrowserClient>>
  if (!g[SINGLETON_KEY]) {
    g[SINGLETON_KEY] = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
  }
  return g[SINGLETON_KEY]
}
