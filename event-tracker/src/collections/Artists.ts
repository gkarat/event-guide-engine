import { CollectionConfig } from 'payload'

export const Artists: CollectionConfig = {
  slug: 'artists',
  labels: {
    singular: 'Artist',
    plural: 'Artists',
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'description',
      type: 'text',
    },
    {
      name: 'location',
      type: 'text',
    },
    {
      name: 'genres',
      type: 'text',
    },
    {
      name: 'url',
      type: 'text',
    },
    {
      name: 'avatar_url',
      type: 'text',
    },
    {
      name: 'approved',
      type: 'checkbox',
      defaultValue: false,
    },
    {
      name: 'submittedBy',
      type: 'relationship',
      relationTo: 'users',
      hasMany: false,
    },
  ],
  hooks: {
    beforeChange: [
      ({ req, data, operation }) => {
        // Only set submittedBy on create operation and if it's not already set
        if (operation === 'create' && !data.submittedBy && req.user) {
          return {
            ...data,
            submittedBy: req.user.id,
          }
        }
        return data
      },
    ],
  },
}
