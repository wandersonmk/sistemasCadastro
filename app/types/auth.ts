import type { User, Session } from '@supabase/supabase-js'

export type LoginParams = { email: string; password: string }
export type SignupParams = LoginParams
export type SignupResult = { user: User | null; session: Session | null }


