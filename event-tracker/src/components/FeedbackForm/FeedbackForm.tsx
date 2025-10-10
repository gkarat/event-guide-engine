'use client'
import React, { useState } from 'react'
import styles from './feedback-form.module.css'
import LoadingIndicator from '../LoadingIndicator'
import { submitFeedback } from '@/app/lib/actions'

const FeedbackForm: React.FC = () => {
  const [formData, setFormData] = useState({
    email: '',
    message: '',
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [successMessage, setSuccessMessage] = useState<string>('')
  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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

  const validateEmail = (email: string): boolean => {
    if (!email) return true // Email is optional

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.message.trim()) {
      newErrors.message = 'Zpráva je povinná'
    }

    if (formData.email && !validateEmail(formData.email)) {
      newErrors.email = 'Zadejte platnou emailovou adresu'
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
      const feedbackData: { email?: string; message: string } = {
        message: formData.message,
      }

      // Only include email if it's provided
      if (formData.email.trim()) {
        feedbackData.email = formData.email
      }

      const result = await submitFeedback(feedbackData)

      if (!result.success) {
        throw new Error(result.error || 'Odeslání zpětné vazby se nezdařilo')
      }

      setSuccessMessage('Vaše zpráva byla úspěšně odeslána.')

      // Reset form
      setFormData({
        email: '',
        message: '',
      })
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Něco se pokazilo. Zkuste to prosím znovu.'
      setErrors({ submit: message })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className={styles.formContainer}>
      <h1 className={styles.formHeader}>Zpětná vazba</h1>

      {isSubmitting && <LoadingIndicator message="Odesílání" overlay />}

      {successMessage ? (
        <div className={styles.successMessage}>{successMessage}</div>
      ) : errors.submit ? (
        <div className={styles.errorMessage}>{errors.submit}</div>
      ) : (
        <form className={styles.form} onSubmit={handleSubmit}>
          {/* Email */}
          <div className={styles.formGroup}>
            <label htmlFor="email" className={styles.label}>
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              className={styles.input}
              value={formData.email}
              onChange={handleInputChange}
              placeholder="vas@email.cz"
            />
            {errors.email && <div className={styles.errorMessage}>{errors.email}</div>}
            <div className={styles.helperText}>
              Nepovinné - pokud chcete, abychom vás kontaktovali
            </div>
          </div>

          {/* Message */}
          <div className={styles.formGroup}>
            <label htmlFor="message" className={styles.label}>
              Zpráva<span className={styles.required}>*</span>
            </label>
            <textarea
              id="message"
              name="message"
              className={styles.textarea}
              value={formData.message}
              onChange={handleInputChange}
              placeholder="Napište nám svou zpětnou vazbu..."
              required
            />
            {errors.message && <div className={styles.errorMessage}>{errors.message}</div>}
          </div>

          <button type="submit" className={styles.submitButton} disabled={isSubmitting}>
            {isSubmitting ? 'Odesílání...' : 'Odeslat'}
          </button>
        </form>
      )}
    </div>
  )
}

export default FeedbackForm
