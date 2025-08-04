import type { CollectionConfig } from 'payload'

// Helper function to check if user is admin
const isAdmin = (user: any) => user?.role === 'admin' && user?.suspended === false

// Helper function to check if user is admin or moderator
const isAdminOrModerator = (user: any) =>
  (user?.role === 'admin' || user?.role === 'moderator') && user?.suspended === false

export const Users: CollectionConfig = {
  slug: 'users',
  admin: {
    useAsTitle: 'email',
    defaultColumns: ['email', 'name', 'role', 'suspended', 'updatedAt'],
    group: 'Administration',
  },
  auth: {
    loginWithUsername: false,
  },
  access: {
    admin: ({ req: { user } }) => isAdminOrModerator(user),
    create: ({ req: { user } }) => isAdmin(user),
    delete: ({ req: { user } }) => isAdmin(user),
    read: ({ req: { user } }) => isAdminOrModerator(user),
    update: ({ req: { user } }) => isAdmin(user),
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'role',
      type: 'select',
      options: [
        {
          label: 'Admin',
          value: 'admin',
        },
        {
          label: 'Moderator',
          value: 'moderator',
        },
        {
          label: 'User',
          value: 'user',
        },
      ],
      defaultValue: 'user',
      required: true,
      admin: {
        description: 'User role determines access permissions',
        position: 'sidebar',
      },
      access: {
        update: ({ req: { user } }) => isAdmin(user),
      },
    },
    {
      name: 'suspended',
      type: 'checkbox',
      defaultValue: false,
      required: true,
      admin: {
        description: 'Suspended users cannot access the system',
        position: 'sidebar',
      },
      access: {
        update: ({ req: { user } }) => isAdmin(user),
      },
    },
  ],
}
