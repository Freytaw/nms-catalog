-- Configuration Supabase Storage pour les images
-- Exécute ces commandes dans Supabase Dashboard

-- 1. Va dans Storage > Create a new bucket
-- Nom du bucket: "nms-images"
-- Public bucket: OUI (pour pouvoir afficher les images)

-- 2. Puis exécute ce SQL pour les policies :

-- Policy pour permettre l'upload (INSERT)
CREATE POLICY "Allow public uploads"
ON storage.objects FOR INSERT
TO public
WITH CHECK (bucket_id = 'nms-images');

-- Policy pour permettre la lecture (SELECT)
CREATE POLICY "Allow public reads"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'nms-images');

-- Policy pour permettre la mise à jour (UPDATE)
CREATE POLICY "Allow public updates"
ON storage.objects FOR UPDATE
TO public
USING (bucket_id = 'nms-images');

-- Policy pour permettre la suppression (DELETE)
CREATE POLICY "Allow public deletes"
ON storage.objects FOR DELETE
TO public
USING (bucket_id = 'nms-images');

-- Vérification
SELECT * FROM storage.buckets WHERE name = 'nms-images';
