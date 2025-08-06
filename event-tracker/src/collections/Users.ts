import { hasSmtpSet } from '@/constants'
import type { CollectionConfig } from 'payload'

export const isAdmin = (user: any) => user?.role === 'admin' && user?.suspended === false

export const isAdminOrModerator = (user: any) =>
  (user?.role === 'admin' || user?.role === 'moderator') && user?.suspended === false

export const Users: CollectionConfig = {
  slug: 'users',
  labels: {
    singular: 'User',
    plural: 'Users',
  },
  admin: {
    useAsTitle: 'name',
    defaultColumns: [hasSmtpSet ? 'email' : 'username', 'name', 'role', 'suspended', 'updatedAt'],
    group: 'Administration',
  },
  auth: {
    loginWithUsername: !hasSmtpSet,
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
      name: 'email',
      type: 'email',
      required: false,
      admin: {
        hidden: !hasSmtpSet,
      },
    },
    {
      name: 'username',
      type: 'text',
      required: !hasSmtpSet,
      admin: {
        position: 'sidebar',
        hidden: hasSmtpSet,
      },
    },
    {
      name: 'name',
      type: 'text',
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
