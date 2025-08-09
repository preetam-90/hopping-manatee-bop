import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { Debt } from '@/types/database'

export function useDebts(userId: string) {
  const queryClient = useQueryClient()

  const { data: debts, isLoading, error } = useQuery({
    queryKey: ['debts', userId],
    queryFn: async () => {
      console.log('Fetching debts for user:', userId)
      const { data, error } = await supabase
        .from('debts')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
      
      if (error) {
        console.error('Error fetching debts:', error)
        throw error
      }
      
      console.log('Debts fetched:', data)
      return data as Debt[]
    },
    enabled: !!userId,
  })

  const createDebt = useMutation({
    mutationFn: async (debt: Omit<Debt, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('debts')
        .insert({ ...debt, user_id: userId })
        .select()
        .single()
      
      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['debts', userId] })
    },
  })

  const updateDebt = useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Debt> & { id: string }) => {
      const { data, error } = await supabase
        .from('debts')
        .update(updates)
        .eq('id', id)
        .select()
        .single()
      
      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['debts', userId] })
    },
  })

  const deleteDebt = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('debts')
        .delete()
        .eq('id', id)
      
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['debts', userId] })
    },
  })

  return {
    debts,
    isLoading,
    error,
    createDebt,
    updateDebt,
    deleteDebt,
  }
}