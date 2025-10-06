'use client'
import React, { useState } from 'react'
import styles from './add-event-form.module.css'
import LoadingIndicator from '../LoadingIndicator'

interface Artist {
  name: string
}

interface Tag {
  value: string
}

interface FormData {
  title: string
  description: string
  artists: Artist[]
  startDate: string
  endDate: string
  location: string
  venue: string
  backgroundImage: File | null
  tags: Tag[]
  url: string
}

const AddEventForm: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    title: '',
    description: '',
    artists: [{ name: '' }],
    startDate: '',
    endDate: '',
    location: '',
    venue: '',
    backgroundImage: null,
    tags: [],
    url: '',
  })

  const [fileName, setFileName] = useState<string>('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [successMessage, setSuccessMessage] = useState<string>('')
  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }

  const handleArtistChange = (index: number, value: string) => {
    const newArtists = [...formData.artists]
    newArtists[index] = { name: value }
    setFormData((prev) => ({
      ...prev,
      artists: newArtists,
    }))
  }

  const addArtist = () => {
    setFormData((prev) => ({
      ...prev,
      artists: [...prev.artists, { name: '' }],
    }))
  }

  const removeArtist = (index: number) => {
    if (formData.artists.length > 1) {
      const newArtists = formData.artists.filter((_, i) => i !== index)
      setFormData((prev) => ({
        ...prev,
        artists: newArtists,
      }))
    }
  }

  const handleTagChange = (index: number, value: string) => {
    const newTags = [...formData.tags]
    newTags[index] = { value }
    setFormData((prev) => ({
      ...prev,
      tags: newTags,
    }))
  }

  const addTag = () => {
    setFormData((prev) => ({
      ...prev,
      tags: [...prev.tags, { value: '' }],
    }))
  }

  const removeTag = (index: number) => {
    const newTags = formData.tags.filter((_, i) => i !== index)
    setFormData((prev) => ({
      ...prev,
      tags: newTags,
    }))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null
    setFormData((prev) => ({
      ...prev,
      backgroundImage: file,
    }))
    setFileName(file?.name || '')
  }

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.title.trim()) {
      newErrors.title = 'Název je povinný'
    }

    if (!formData.startDate) {
      newErrors.startDate = 'Začátek akce je povinný'
    }

    if (!formData.location.trim() && !formData.venue.trim()) {
      newErrors.location = 'Umělci (odděleně čárkou) nebo Venue je povinné'
    }

    if (formData.location.trim() && formData.venue.trim()) {
      newErrors.location = 'Vyplňte pouze jedno: buď Umělci (odděleně čárkou), nebo Venue'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)
    setSuccessMessage('')
    setErrors((prev) => {
      const { submit: _submit, ...rest } = prev
      return rest
    })

    try {
      let uploadedImageId: string | undefined

      if (formData.backgroundImage) {
        const uploadData = new FormData()
        uploadData.append('file', formData.backgroundImage)
        uploadData.append(
          'data',
          JSON.stringify({
            alt: formData.title,
            type: 'image',
          }),
        )

        const uploadRes = await fetch('/api/media', {
          method: 'POST',
          body: uploadData,
          credentials: 'include',
        })

        if (!uploadRes.ok) {
          const message = await uploadRes.text()
          throw new Error(message || 'Nahrání souboru se nezdařilo')
        }

        const uploadJson = await uploadRes.json()
        uploadedImageId = uploadJson?.doc?.id || uploadJson?.id
      }

      const toISOOrUndefined = (value: string) =>
        value ? new Date(value).toISOString() : undefined

      const eventPayload: Record<string, unknown> = {
        title: formData.title,
        description: formData.description || undefined,
        startDate: toISOOrUndefined(formData.startDate),
        endDate: toISOOrUndefined(formData.endDate || ''),
        location: formData.location || undefined,
        // Note: venue is a relationship; this form uses free-text, so we omit it
        backgroundImage: uploadedImageId,
        tags: (formData.tags || [])
          .filter((t) => t.value.trim() !== '')
          .map((t) => ({ tag: t.value })),
        url: formData.url || undefined,
        artist: (formData.artists || [])
          .filter((a) => a.name.trim() !== '')
          .map((a) => ({ type: 'string', string: a.name })),
        approved: false,
      }

      const res = await fetch('/api/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(eventPayload),
      })

      if (!res.ok) {
        const text = await res.text()
        if (res.status === 401 || res.status === 403) {
          throw new Error('Pro odeslání události se prosím přihlaste.')
        }
        throw new Error(text || 'Odeslání události se nezdařilo')
      }

      setSuccessMessage('Událost byla úspěšně odeslána! Po schválení moderátorem bude zveřejněna.')

      // Reset form
      setFormData({
        title: '',
        description: '',
        artists: [{ name: '' }],
        startDate: '',
        endDate: '',
        location: '',
        venue: '',
        backgroundImage: null,
        tags: [],
        url: '',
      })
      setFileName('')
    } catch (_error) {
      const message =
        _error instanceof Error ? _error.message : 'Něco se pokazilo. Zkuste to prosím znovu.'
      setErrors({ submit: message })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className={styles.formContainer}>
      <div className={styles.formDescription}>
        Pomocí tohoto formuláře můžete přidat novou událost do našeho systému. Vezměte prosím na
        vědomí, že nově vytvořené události nejsou automaticky schváleny a budou veřejně zobrazeny
        uživatelům až poté, co je moderátor nebo administrátor schválí. Vyplňte prosím všechna
        povinná pole označená hvězdičkou (*).
      </div>

      {isSubmitting && <LoadingIndicator message="Odesílání" overlay />}

      {successMessage ? (
        <div className={styles.successMessage}>{successMessage}</div>
      ) : errors.submit ? (
        <div className={styles.errorMessage}>{errors.submit}</div>
      ) : (
        <form className={styles.form} onSubmit={handleSubmit}>
          {/* Title */}
          <div className={styles.formGroup}>
            <label htmlFor="title" className={styles.label}>
              Název<span className={styles.required}>*</span>
            </label>
            <input
              type="text"
              id="title"
              name="title"
              className={styles.input}
              value={formData.title}
              onChange={handleInputChange}
              required
            />
            {errors.title && <div className={styles.errorMessage}>{errors.title}</div>}
          </div>

          {/* Description */}
          <div className={styles.formGroup}>
            <label htmlFor="description" className={styles.label}>
              Popis
            </label>
            <textarea
              id="description"
              name="description"
              className={styles.textarea}
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Zadejte popis události..."
            />
          </div>

          {/* Artists */}
          <div className={styles.formGroup}>
            <label className={styles.label}>Umělci</label>
            <div className={styles.artistsList}>
              {formData.artists.map((artist, index) => (
                <div key={index} className={styles.artistItem}>
                  <div className={styles.inputGroup}>
                    <input
                      type="text"
                      className={styles.input}
                      value={artist.name}
                      onChange={(e) => handleArtistChange(index, e.target.value)}
                      placeholder="Jméno umělce"
                    />
                  </div>
                  {formData.artists.length > 1 && (
                    <button
                      type="button"
                      className={styles.removeButton}
                      onClick={() => removeArtist(index)}
                    >
                      Odebrat
                    </button>
                  )}
                </div>
              ))}
              <button type="button" className={styles.addButton} onClick={addArtist}>
                + Přidat umělce
              </button>
            </div>
          </div>

          {/* Date Range */}
          <div className={styles.row}>
            <div className={styles.formGroup}>
              <label htmlFor="startDate" className={styles.label}>
                Začátek akce<span className={styles.required}>*</span>
              </label>
              <input
                type="datetime-local"
                id="startDate"
                name="startDate"
                className={styles.input}
                value={formData.startDate}
                onChange={handleInputChange}
                required
              />
              {errors.startDate && <div className={styles.errorMessage}>{errors.startDate}</div>}
            </div>
          </div>

          {/* Location and Venue */}
          <div className={styles.row}>
            <div className={styles.formGroup}>
              <label htmlFor="location" className={styles.label}>
                Lokace
              </label>
              <input
                type="text"
                id="location"
                name="location"
                className={styles.input}
                value={formData.location}
                onChange={handleInputChange}
                placeholder="Volný text"
              />
              {errors.location && <div className={styles.errorMessage}>{errors.location}</div>}
              <div className={styles.helperText}>
                Zadejte vlastní adresu nebo vyberte místo v dalším poli
              </div>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="venue" className={styles.label}>
                Venue
              </label>
              <input
                type="text"
                id="venue"
                name="venue"
                className={styles.input}
                value={formData.venue}
                onChange={handleInputChange}
              />
              <div className={styles.helperText}>Vyberte ze seznamu jiz existujicich míst</div>
            </div>
          </div>

          {/* Tags */}
          <div className={styles.formGroup}>
            <label className={styles.label}>Tagy</label>
            {formData.tags.length > 0 && (
              <div className={styles.tagsList}>
                {formData.tags.map((tag, index) => (
                  <div key={index} className={styles.tagItem}>
                    <div className={styles.inputGroup}>
                      <input
                        type="text"
                        className={styles.input}
                        value={tag.value}
                        onChange={(e) => handleTagChange(index, e.target.value)}
                        placeholder="Název tagu"
                      />
                    </div>
                    <button
                      type="button"
                      className={styles.removeButton}
                      onClick={() => removeTag(index)}
                    >
                      Odebrat
                    </button>
                  </div>
                ))}
              </div>
            )}
            <button type="button" className={styles.addButton} onClick={addTag}>
              + Přidat tag
            </button>
          </div>

          {/* Background Image */}
          <div className={styles.formGroup}>
            <label htmlFor="backgroundImage" className={styles.label}>
              Fotografie
            </label>
            <input
              type="file"
              id="backgroundImage"
              name="backgroundImage"
              className={styles.fileInput}
              onChange={handleFileChange}
              accept="image/*"
            />
            <label htmlFor="backgroundImage" className={styles.fileInputLabel}>
              Vybrat soubor
            </label>
            {fileName && <div className={styles.fileName}>Vybraný soubor: {fileName}</div>}
            {fileName && (
              <button type="button" className={styles.removeButton} onClick={() => setFileName('')}>
                Odebrat soubor
              </button>
            )}
          </div>

          {/* URL */}
          <div className={styles.formGroup}>
            <label htmlFor="url" className={styles.label}>
              URL
            </label>
            <input
              type="url"
              id="url"
              name="url"
              className={styles.input}
              value={formData.url}
              onChange={handleInputChange}
              placeholder="https://example.com"
            />
          </div>
          <button type="submit" className={styles.submitButton} disabled={isSubmitting}>
            {isSubmitting ? 'Odesílání...' : 'Potvrdit'}
          </button>
        </form>
      )}
    </div>
  )
}

export default AddEventForm
