import { CollectionConfig } from 'payload'
import { isAdminOrModerator } from './Users'

export const Feedback: CollectionConfig = {
  slug: 'feedback',
  labels: {
    singular: 'Feedback',
    plural: 'Feedback',
  },
  fields: [
    {
      name: 'email',
      label: "User's email",
      type: 'email',
    },
    {
      name: 'message',
      label: 'Message',
      type: 'textarea',
      required: true,
    },
  ],
  admin: {
    group: 'Administration',
  },
  access: {
    // Anyone can submit feedback (public endpoint)
    create: () => true,
    // Only admins/moderators can read/update
    read: ({ req: { user } }) => isAdminOrModerator(user),
    update: ({ req: { user } }) => isAdminOrModerator(user),
    delete: ({ req: { user } }) => isAdminOrModerator(user),
  },
}
