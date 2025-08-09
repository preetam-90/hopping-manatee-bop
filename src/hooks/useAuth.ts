import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { User } from '@supabase/supabase-js'

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check active sessions and sets the user
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      setLoading(false)
      
      // Setup default data for new users
      if (session?.user) {
        setupUserData(session.user)
      }
    })

    // Listen for changes on auth state (logged in, signed out, etc.)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      
      // Setup default data for new users
      if (session?.user) {
        setupUserData(session.user)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  const setupUserData = async (user: User) => {
    try {
      // Check if user already has categories
      const { data: existingCategories } = await supabase
        .from('categories')
        .select('id')
        .eq('user_id', user.id)
        .limit(1)

      if (!existingCategories || existingCategories.length === 0) {
        // Create default categories for new user
        const defaultCategories = [
          { name: 'Food & Dining', color: '#ef4444', icon: 'utensils', budget_limit: 500 },
          { name: 'Transportation', color: '#3b82f6', icon: 'car', budget_limit: 300 },
          { name: 'Shopping', color: '#8b5cf6', icon: 'shopping-bag', budget_limit: 400 },
          { name: 'Entertainment', color: '#f59e0b', icon: 'film', budget_limit: 200 },
          { name: 'Bills & Utilities', color: '#10b981', icon: 'receipt', budget_limit: 800 },
          { name: 'Healthcare', color: '#ec4899', icon: 'heart-pulse', budget_limit: 200 },
          { name: 'Salary', color: '#22c55e', icon: 'dollar-sign', budget_limit: null },
        ]

        for (const category of defaultCategories) {
          await supabase.from('categories').insert({
            ...category,
            user_id: user.id,
          })
        }

        // Create a default account
        await supabase.from('accounts').insert({
          user_id: user.id,
          name: 'Main Account',
          type: 'checking',
          balance: 0,
          currency: 'USD',
        })
      }
    } catch (error) {
      console.error('Error setting up user data:', error)
    }
  }

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    return { data, error }
  }

  const signUp = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    })
    return { data, error }
  }

  const signOut = async () => {
    const { error } = await supabase.auth.signOut()
    return { error }
  }

  return {
    user,
    loading,
    signIn,
    signUp,
    signOut,
  }
}