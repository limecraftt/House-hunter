import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// ── Auth helpers ──────────────────────────────────────────────────────────────

export const signUp = async ({ email, password, fullName, role }) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { full_name: fullName, role }
    }
  });
  return { data, error };
};

export const signIn = async ({ email, password }) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });
  return { data, error };
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  return { error };
};

export const getSession = async () => {
  const { data: { session } } = await supabase.auth.getSession();
  return session;
};

export const getProfile = async (userId) => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();
  return { data, error };
};

// ── Property helpers ──────────────────────────────────────────────────────────

export const fetchProperties = async () => {
  const { data, error } = await supabase
    .from('properties')
    .select('*')
    .order('created_at', { ascending: false });
  return { data, error };
};

export const fetchLandlordProperties = async (landlordId) => {
  const { data, error } = await supabase
    .from('properties')
    .select('*')
    .eq('landlord_id', landlordId)
    .order('created_at', { ascending: false });
  return { data, error };
};

export const insertProperty = async (propertyData) => {
  const { data, error } = await supabase
    .from('properties')
    .insert([propertyData])
    .select()
    .single();
  return { data, error };
};

export const updateProperty = async (id, propertyData) => {
  const { data, error } = await supabase
    .from('properties')
    .update(propertyData)
    .eq('id', id)
    .select()
    .single();
  return { data, error };
};

export const deleteProperty = async (id) => {
  const { error } = await supabase
    .from('properties')
    .delete()
    .eq('id', id);
  return { error };
};

// ── Saved properties helpers ──────────────────────────────────────────────────

export const fetchSavedProperties = async (tenantId) => {
  const { data, error } = await supabase
    .from('saved_properties')
    .select('property_id, properties(*)')
    .eq('tenant_id', tenantId);
  return { data, error };
};

export const saveProperty = async (tenantId, propertyId) => {
  const { data, error } = await supabase
    .from('saved_properties')
    .insert([{ tenant_id: tenantId, property_id: propertyId }]);
  return { data, error };
};

export const unsaveProperty = async (tenantId, propertyId) => {
  const { error } = await supabase
    .from('saved_properties')
    .delete()
    .eq('tenant_id', tenantId)
    .eq('property_id', propertyId);
  return { error };
};

// ── Messages helpers ──────────────────────────────────────────────────────────

export const sendMessage = async ({ propertyId, senderId, landlordId, message }) => {
  const { data, error } = await supabase
    .from('messages')
    .insert([{
      property_id: propertyId,
      sender_id: senderId,
      landlord_id: landlordId,
      message
    }]);
  return { data, error };
};

export const fetchLandlordMessages = async (landlordId) => {
  const { data, error } = await supabase
    .from('messages')
    .select(`
      *,
      properties(title),
      profiles!sender_id(full_name)
    `)
    .eq('landlord_id', landlordId)
    .order('created_at', { ascending: false });
  return { data, error };
};

export const fetchTenantMessages = async (tenantId) => {
  const { data, error } = await supabase
    .from('messages')
    .select(`
      *,
      properties(title),
      profiles!landlord_id(full_name)
    `)
    .eq('sender_id', tenantId)
    .order('created_at', { ascending: false });
  return { data, error };
};

// ── Image upload helper ───────────────────────────────────────────────────────

export const uploadPropertyImage = async (file, landlordId) => {
  const fileExt = file.name.split('.').pop();
  const fileName = `${landlordId}/${Date.now()}.${fileExt}`;

  const { data, error } = await supabase.storage
    .from('property-images')
    .upload(fileName, file, { cacheControl: '3600', upsert: false });

  if (error) return { url: null, error };

  const { data: { publicUrl } } = supabase.storage
    .from('property-images')
    .getPublicUrl(fileName);

  return { url: publicUrl, error: null };
};