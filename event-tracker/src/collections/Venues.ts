import { CollectionConfig } from 'payload'
import { isAdminOrModerator } from './Users'

export const Venues: CollectionConfig = {
  slug: 'venues',
  admin: {
    defaultColumns: ['name', 'address', 'approved', 'submittedBy'],
    group: 'Content',
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'address',
      type: 'text',
      required: true,
    },
    {
      name: 'approved',
      type: 'checkbox',
      defaultValue: false,
      required: true,
    },
    {
      name: 'submittedBy',
      type: 'relationship',
      relationTo: 'users',
      hasMany: false,
      admin: {
        readOnly: true,
        description: 'Automatically set to the user who created this venue',
      },
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
  access: {
    create: ({ req: { user } }) => isAdminOrModerator(user),
    delete: ({ req: { user } }) => isAdminOrModerator(user),
    read: ({ req: { user } }) => isAdminOrModerator(user),
    update: ({ req: { user } }) => isAdminOrModerator(user),
  },
}
