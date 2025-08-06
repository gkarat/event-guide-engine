import { CollectionConfig } from 'payload'
import { isAdminOrModerator } from './Users'

export const Events: CollectionConfig = {
  slug: 'events',
  labels: {
    singular: 'Event',
    plural: 'Events',
  },
  admin: {
    defaultColumns: ['title', 'location', 'venue', 'submittedBy'],
    group: 'Content',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'description',
      type: 'text',
    },
    {
      name: 'startDate',
      type: 'date',
      required: true,
      admin: {
        date: {
          pickerAppearance: 'dayAndTime',
        },
      },
      localized: true,
    },
    {
      name: 'endDate',
      type: 'date',
      admin: {
        date: {
          pickerAppearance: 'dayAndTime',
        },
      },
      localized: true,
    },
    {
      type: 'row',
      fields: [
        {
          name: 'location',
          type: 'text',
          admin: {
            description: 'Enter a custom location (use this OR select a venue in the next field)',
          },
          validate: (value: string | null | undefined, { siblingData }: { siblingData: any }) => {
            const hasLocation = value && value.trim() !== ''
            const hasVenue = siblingData?.venue

            if (!hasLocation && !hasVenue) {
              return 'Either location or venue must be provided'
            }

            if (hasLocation && hasVenue) {
              return 'Please provide either a location OR a venue, not both'
            }

            return true
          },
        },
        {
          name: 'venue',
          type: 'relationship',
          relationTo: 'venues',
          hasMany: false,
          admin: {
            description:
              'Select a venue from the list (use this OR enter a custom location in the previous field)',
          },
          validate: (value: any, { siblingData }: { siblingData: any }) => {
            const hasLocation = siblingData?.location && siblingData.location.trim() !== ''
            const hasVenue = value

            if (!hasLocation && !hasVenue) {
              return 'Either location or venue must be provided'
            }

            if (hasLocation && hasVenue) {
              return 'Please provide either a location OR a venue, not both'
            }

            return true
          },
        },
      ],
    },
    {
      name: 'approved',
      type: 'checkbox',
      defaultValue: false,
      required: true,
      admin: {
        description: 'Approved events are visible to all users',
      },
    },
    {
      name: 'submittedBy',
      type: 'relationship',
      relationTo: 'users',
      hasMany: false,
      admin: {
        readOnly: true,
        description: 'Automatically set to the user who created this event',
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
