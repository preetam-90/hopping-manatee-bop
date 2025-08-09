import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { Category } from '@/types/database'

export function useCategories(userId: string) {
  const queryClient = useQueryClient()

  const { data: categories, isLoading, error } = useQuery({
    queryKey: ['categories', userId],
    queryFn: async () => {
      console.log('Fetching categories for user:', userId)
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('user_id', userId)
        .order('name', { ascending: true })
      
      if (error) {
        console.error('Error fetching categories:', error)
        throw error
      }
      
      console.log('Categories fetched:', data)
      return data as Category[]
    },
    enabled: !!userId,
  })

  const createCategory = useMutation({
    mutationFn: async (category: Omit<Category, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('categories')
        .insert({ ...category, user_id: userId })
        .select()
        .single()
      
      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories', userId] })
    },
  })

  return {
    categories,
    isLoading,
    error,
    createCategory,
  }
}