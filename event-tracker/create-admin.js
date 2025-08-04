// create-admin.js
const createAdminUser = async () => {
  try {
    const response = await fetch('http://localhost:3000/api/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'admin@example.com',
        password: 'admin123',
        name: 'Admin User',
        role: 'admin',
      }),
    })

    if (response.ok) {
      const user = await response.json()
      console.log('✅ Admin user created successfully!')
      console.log('Email:', user.email)
      console.log('ID:', user.id)
    } else {
      const error = await response.text()
      console.error('❌ Error creating admin user:', error)
    }
  } catch (error) {
    console.error('❌ Network error:', error.message)
  }
}

createAdminUser()
