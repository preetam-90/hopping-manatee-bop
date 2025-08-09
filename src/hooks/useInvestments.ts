import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { Investment } from '@/types/database'

export function useInvestments(userId: string) {
  const queryClient = useQueryClient()

  const { data: investments, isLoading, error } = useQuery({
    queryKey: ['investments', userId],
    queryFn: async () => {
      console.log('Fetching investments for user:', userId)
      const { data, error } = await supabase
        .from('investments')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
      
      if (error) {
        console.error('Error fetching investments:', error)
        throw error
      }
      
      console.log('Investments fetched:', data)
      return data as Investment[]
    },
    enabled: !!userId,
  })

  const createInvestment = useMutation({
    mutationFn: async (investment: Omit<Investment, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('investments')
        .insert({ ...investment, user_id: userId })
        .select()
        .single()
      
      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['investments', userId] })
    },
  })

  const updateInvestment = useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Investment> & { id: string }) => {
      const { data, error } = await supabase
        .from('investments')
        .update(updates)
        .eq('id', id)
        .select()
        .single()
      
      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['investments', userId] })
    },
  })

  const deleteInvestment = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('investments')
        .delete()
        .eq('id', id)
      
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['investments', userId] })
    },
  })

  return {
    investments,
    isLoading,
    error,
    createInvestment,
    updateInvestment,
    deleteInvestment,
  }
}