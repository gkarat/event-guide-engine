import type { GlobalConfig } from 'payload'

export const SiteConfig: GlobalConfig = {
  slug: 'site-config',
  access: {
    read: () => true, // Public access for frontend
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Branding Assets',
          description: 'Upload your branding images here',
          fields: [
            {
              name: 'logoDesktop',
              type: 'upload',
              relationTo: 'media',
              label: 'Desktop Logo',
              required: true,
              admin: {
                description: 'Main logo for desktop (recommended: 650x100px)',
              },
            },
            {
              name: 'logoMobile',
              type: 'upload',
              relationTo: 'media',
              label: 'Mobile Logo',
              required: true,
              admin: {
                description: 'Logo for mobile devices (recommended: 250x50px)',
              },
            },
            {
              name: 'logoFooter',
              type: 'upload',
              relationTo: 'media',
              label: 'Footer Logo',
              required: true,
              admin: {
                description: 'Logo for footer (SVG recommended)',
              },
            },
          ],
        },
        {
          label: 'Background Images',
          description: 'Optional background images (only if using image type in .env)',
          fields: [
            {
              name: 'backgroundMainImage',
              type: 'upload',
              relationTo: 'media',
              label: 'Main Background Image',
              required: false,
              admin: {
                description: 'Used if BACKGROUND_MAIN_TYPE=image in your .env file',
              },
            },
            {
              name: 'backgroundMenuImage',
              type: 'upload',
              relationTo: 'media',
              label: 'Menu Background Image',
              required: false,
              admin: {
                description: 'Used if BACKGROUND_MENU_TYPE=image in your .env file',
              },
            },
          ],
        },
        {
          label: 'UI Text & Labels',
          description: 'Translatable text for user interface',
          fields: [
            {
              name: 'menuLabels',
              type: 'group',
              label: 'Navigation Menu',
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
              label: 'Footer Links',
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
        },
      ],
    },
  ],
}
