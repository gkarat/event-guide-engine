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
    /*     {
      name: 'url',
      type: 'text',
      required: true,
    }, */
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
      admin: {
        description: 'Only approved venues can be selected',
      },
      filterOptions: {
        approved: {
          equals: true,
        },
      },
    },
    {
      name: 'event',
      type: 'relationship',
      relationTo: 'events',
      hasMany: true,
      admin: {
        description: 'Only approved events can be selected',
      },
      filterOptions: {
        approved: {
          equals: true,
        },
      },
    },
    {
      name: 'artist',
      type: 'relationship',
      relationTo: 'artists',
      hasMany: true,
      admin: {
        description: 'Only approved artists can be selected',
      },
      filterOptions: {
        approved: {
          equals: true,
        },
      },
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
  upload: true,
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
