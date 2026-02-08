import { createClient } from '@supabase/supabase-js'

// Ces valeurs devront être remplacées par tes vraies credentials Supabase
// Tu les trouveras dans ton dashboard Supabase sous Settings > API
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'YOUR_SUPABASE_URL'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'YOUR_SUPABASE_ANON_KEY'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
