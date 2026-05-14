import { useState, useCallback, useEffect } from 'react';
import { profileService } from '@/services/profileService';
import { Database } from '@/types/database';
import { supabase } from '@/lib/supabase';

type Profile = Database['public']['Tables']['profiles']['Row'];

export function useProfile(userId: string | undefined) {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchProfile = useCallback(async () => {
    if (!userId) {
      setIsLoading(false);
      return;
    }
    
    setIsLoading(true);
    const data = await profileService.getProfile(userId);
    
    if (data) {
      setProfile(data);
    } else {
      // Create a default profile if one doesn't exist
      const todayDateStr = new Date().toLocaleDateString('en-CA');
      const newProfile = await profileService.createProfile(userId, { last_reset_date: todayDateStr });
      if (newProfile) setProfile(newProfile);
    }
    setIsLoading(false);
  }, [userId]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const updateProfile = useCallback(async (updates: Partial<Profile>) => {
    if (!userId) return;
    
    // Optimistic update
    setProfile(prev => prev ? { ...prev, ...updates } : null);
    
    const updated = await profileService.updateProfile(userId, updates);
    if (updated) {
        setProfile(updated);
    }
  }, [userId]);

  // Set up realtime subscription
  useEffect(() => {
      if (!userId) return;

      const profileChannel = supabase.channel(`profile_${userId}`)
          .on('postgres_changes', { 
              event: '*', 
              schema: 'public', 
              table: 'profiles', 
              filter: `id=eq.${userId}` 
          }, payload => {
              if (payload.new) setProfile(prev => ({ ...prev, ...(payload.new as Profile) }));
          }).subscribe();

      return () => {
          supabase.removeChannel(profileChannel);
      };
  }, [userId]);


  return {
    profile,
    isLoading,
    updateProfile,
    refreshProfile: fetchProfile
  };
}
