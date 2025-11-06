import type { CollectionConfig } from 'payload'
import { isAdminOrModerator } from './Users'

export const Media: CollectionConfig = {
  slug: 'media',
  access: {
    read: () => true,
    create: ({ req: { user } }) => isAdminOrModerator(user),
    update: ({ req: { user } }) => isAdminOrModerator(user),
    delete: ({ req: { user } }) => isAdminOrModerator(user),
  },
  admin: {
    group: 'Content',
    useAsTitle: 'alt',
    defaultColumns: ['filename', 'type', 'submittedBy'],
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
    },
    {
      name: 'type',
      type: 'radio',
      options: ['image', 'video'],
      required: true,
    },
    {
      name: 'venue',
      type: 'relationship',
      relationTo: 'venues',
      hasMany: true,
    },
    {
      name: 'event',
      type: 'relationship',
      relationTo: 'events',
      hasMany: true,
    },
    {
      name: 'artist',
      type: 'relationship',
      relationTo: 'artists',
      hasMany: true,
    },
    {
      name: 'submittedBy',
      type: 'relationship',
      relationTo: 'users',
      hasMany: false,
      admin: {
        readOnly: true,
        description: 'Automatically set to the user who created this media',
      },
    },
  ],
  upload: {
    mimeTypes: ['image/*', 'video/*'],
  },
  hooks: {
    beforeChange: [
      ({ req, data, operation }) => {
        if (operation === 'create' && !data.submittedBy && req.user) {
          return {
            ...data,
            submittedBy: req.user.id,
          }
        }
      },
    ],
  },
}
