import { useState } from 'react'
import { supabase } from '../supabaseClient'
import { Upload, X } from 'lucide-react'

function SingleImageUpload({ imageUrl, onChange, label = "Image" }) {
  const [uploading, setUploading] = useState(false)

  async function uploadImage(file) {
    try {
      setUploading(true)

      const fileExt = file.name.split('.').pop()
      const fileName = `${Math.random()}.${fileExt}`
      const filePath = `${fileName}`

      const { error: uploadError } = await supabase.storage
        .from('nms-images')
        .upload(filePath, file)

      if (uploadError) throw uploadError

      const { data } = supabase.storage
        .from('nms-images')
        .getPublicUrl(filePath)

      onChange(data.publicUrl)
    } catch (error) {
      console.error('Error uploading image:', error)
      alert('Erreur lors de l\'upload : ' + error.message)
    } finally {
      setUploading(false)
    }
  }

  function handleFileChange(e) {
    const file = e.target.files?.[0]
    if (file) {
      uploadImage(file)
    }
  }

  function removeImage() {
    onChange('')
  }

  return (
    <div className="form-group">
      <label className="form-label">{label}</label>
      
      {imageUrl ? (
        <div style={{ position: 'relative', display: 'inline-block' }}>
          <img 
            src={imageUrl} 
            alt={label}
            style={{ 
              maxWidth: '300px', 
              maxHeight: '200px', 
              objectFit: 'contain',
              display: 'block',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--nms-dark)'
            }}
          />
          <button
            type="button"
            onClick={removeImage}
            style={{
              position: 'absolute',
              top: '0.5rem',
              right: '0.5rem',
              background: 'var(--nms-red)',
              border: 'none',
              borderRadius: '50%',
              width: '2rem',
              height: '2rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: 'white'
            }}
          >
            <X size={16} />
          </button>
        </div>
      ) : (
        <label 
          className="form-input" 
          style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            minHeight: '100px',
            cursor: 'pointer',
            border: '2px dashed var(--nms-cyan)',
            backgroundColor: 'transparent'
          }}
        >
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            disabled={uploading}
            style={{ display: 'none' }}
          />
          <div style={{ textAlign: 'center' }}>
            <Upload size={32} style={{ marginBottom: '0.5rem', color: 'var(--nms-cyan)' }} />
            <p>{uploading ? 'Upload en cours...' : 'Cliquer pour ajouter une image'}</p>
          </div>
        </label>
      )}
    </div>
  )
}

export default SingleImageUpload
