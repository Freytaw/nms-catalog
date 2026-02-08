import { useState } from 'react'
import { supabase } from '../supabaseClient'
import { Upload, X, Loader } from 'lucide-react'

function ImageUpload({ images = [], onChange, bucket = 'nms-images', label = 'Images' }) {
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState(null)

  async function uploadImage(file) {
    try {
      setUploading(true)
      setUploadError(null)

      // Generate unique filename
      const fileExt = file.name.split('.').pop()
      const fileName = `${Math.random().toString(36).substring(2)}_${Date.now()}.${fileExt}`
      const filePath = fileName

      // Upload to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(filePath, file)

      if (uploadError) throw uploadError

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from(bucket)
        .getPublicUrl(filePath)

      // Add to images array
      const newImages = [...images, publicUrl]
      onChange(newImages)

    } catch (error) {
      console.error('Error uploading image:', error)
      setUploadError(error.message)
    } finally {
      setUploading(false)
    }
  }

  function handleFileSelect(e) {
    const files = Array.from(e.target.files || [])
    files.forEach(file => {
      if (file.type.startsWith('image/')) {
        uploadImage(file)
      }
    })
    e.target.value = '' // Reset input
  }

  function removeImage(index) {
    const newImages = images.filter((_, i) => i !== index)
    onChange(newImages)
  }

  return (
    <div className="form-group">
      <label className="form-label">{label}</label>
      
      {/* Upload button */}
      <div style={{ marginBottom: '1rem' }}>
        <label className="btn btn-secondary" style={{ cursor: 'pointer' }}>
          {uploading ? (
            <>
              <Loader size={20} style={{ animation: 'spin 1s linear infinite' }} />
              Upload en cours...
            </>
          ) : (
            <>
              <Upload size={20} />
              Choisir des images
            </>
          )}
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileSelect}
            disabled={uploading}
            style={{ display: 'none' }}
          />
        </label>
      </div>

      {/* Error message */}
      {uploadError && (
        <p style={{ color: 'var(--nms-secondary)', marginBottom: '1rem' }}>
          Erreur: {uploadError}
        </p>
      )}

      {/* Image previews */}
      {images.length > 0 && (
        <div className="image-grid">
          {images.map((url, idx) => (
            <div key={idx} className="image-preview" style={{ position: 'relative' }}>
              <img src={url} alt={`Upload ${idx + 1}`} />
              <button
                type="button"
                onClick={() => removeImage(idx)}
                className="btn btn-danger"
                style={{
                  position: 'absolute',
                  top: '0.25rem',
                  right: '0.25rem',
                  padding: '0.25rem',
                  minWidth: 'auto'
                }}
              >
                <X size={16} />
              </button>
              {idx === 0 && (
                <div style={{
                  position: 'absolute',
                  bottom: '0.25rem',
                  left: '0.25rem',
                  background: 'var(--nms-primary)',
                  color: 'var(--nms-darker)',
                  padding: '0.25rem 0.5rem',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.75rem',
                  fontWeight: 'bold'
                }}>
                  Principale
                </div>
              )}
            </div>
          ))}
        </div>
      )}
      
      <small style={{ color: 'var(--nms-gray)', fontSize: '0.875rem' }}>
        La première image sera l'image principale. Vous pouvez ajouter plusieurs images.
      </small>
    </div>
  )
}

export default ImageUpload
