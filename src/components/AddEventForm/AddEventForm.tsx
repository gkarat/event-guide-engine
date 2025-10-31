'use client'
import React, { useState } from 'react'
import styles from './add-event-form.module.css'
import LoadingIndicator from '../LoadingIndicator'
import VenueSearchField from '../VenueSearchField'
import { createEvent, uploadMedia } from '@/app/lib/actions'
import { Venue } from '@/payload-types'

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
  selectedVenue: Venue | null
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
    selectedVenue: null,
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

  const handleVenueChange = (venue: Venue | null) => {
    setFormData((prev) => ({
      ...prev,
      selectedVenue: venue,
      venue: venue ? venue.name : '',
    }))
    // Clear error when venue is selected
    if (venue && errors.location) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors.location
        return newErrors
      })
    }
  }

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.title.trim()) {
      newErrors.title = 'Název je povinný'
    }

    if (!formData.startDate) {
      newErrors.startDate = 'Začátek akce je povinný'
    }

    if (!formData.location.trim() && !formData.selectedVenue) {
      newErrors.location = 'Lokace nebo Venue je povinné'
    }

    if (formData.location.trim() && formData.selectedVenue) {
      newErrors.location = 'Vyplňte pouze jedno: buď Lokace, nebo Venue'
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
      let uploadedImageId: number | undefined

      // Upload image if provided
      if (formData.backgroundImage) {
        const fd = new FormData()
        fd.append('file', formData.backgroundImage)
        fd.append('alt', formData.title)
        fd.append('type', 'image')

        const uploadResult = await uploadMedia(fd)
        if (!uploadResult?.id) {
          throw new Error('Error upload media')
        }
        uploadedImageId = uploadResult.id
      }

      // Helper function to convert date strings to ISO format
      const toISOOrUndefined = (value: string) =>
        value ? new Date(value).toISOString() : undefined

      // Prepare event payload
      const eventPayload = {
        title: formData.title,
        description: formData.description || undefined,
        startDate: toISOOrUndefined(formData.startDate) as string,
        endDate: toISOOrUndefined(formData.endDate),
        location: formData.location || undefined,
        venue: formData.selectedVenue ? formData.selectedVenue.id : undefined,
        backgroundImage: uploadedImageId,
        tags: (formData.tags || [])
          .filter((t) => t.value.trim() !== '')
          .map((t) => ({ tag: t.value })),
        url: formData.url || undefined,
        artist: (formData.artists || [])
          .filter((a) => a.name.trim() !== '')
          .map((a) => ({ type: 'string' as 'string' | 'relationship', string: a.name })),
        approved: false,
      }

      // Create the event
      const result = await createEvent(eventPayload)
      if (!result?.id) {
        throw new Error('Odeslání události se nezdařilo')
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
        selectedVenue: null,
        backgroundImage: null,
        tags: [],
        url: '',
      })
      setFileName('')
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Něco se pokazilo. Zkuste to prosím znovu.'
      setErrors({ submit: message })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleRemoveFile = () => {
    setFileName('')
    setFormData((prev) => ({
      ...prev,
      backgroundImage: null,
    }))
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
                      aria-label={`Odebrat umělce ${artist.name || index + 1}`}
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
              <VenueSearchField
                value={formData.venue}
                onChange={handleVenueChange}
                placeholder="Vyhledat venue"
              />
              <div className={styles.helperText}>Vyberte ze seznamu již existujících míst</div>
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
                      aria-label={`Odebrat tag ${tag.value || index + 1}`}
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
              <button type="button" className={styles.removeButton} onClick={handleRemoveFile}>
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
