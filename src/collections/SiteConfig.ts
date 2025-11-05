import type { GlobalConfig } from 'payload'

export const SiteConfig: GlobalConfig = {
  slug: 'site-config',
  access: {
    read: () => true, // Public access for frontend
  },
  admin: {
    description:
      'Configure UI text and labels. Note: Logos and images are managed as static files in /public/media/',
  },
  fields: [
    {
      name: 'menuLabels',
      type: 'group',
      label: 'Navigation Menu Labels',
      fields: [
        {
          name: 'events',
          type: 'text',
          label: 'Events Label',
          required: true,
          defaultValue: 'Events',
          admin: {
            description: 'Label for events navigation item',
          },
        },
        {
          name: 'artists',
          type: 'text',
          label: 'Artists Label',
          required: true,
          defaultValue: 'Artists',
          admin: {
            description: 'Label for artists navigation item',
          },
        },
      ],
    },
    {
      name: 'footerText',
      type: 'group',
      label: 'Footer Link Text',
      fields: [
        {
          name: 'addEvent',
          type: 'text',
          label: 'Add Event Link Text',
          required: true,
          defaultValue: 'Add Event',
        },
        {
          name: 'sendFeedback',
          type: 'text',
          label: 'Send Feedback Link Text',
          required: true,
          defaultValue: 'Send Feedback',
        },
      ],
    },
  ],
}
