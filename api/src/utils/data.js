import bcrypt from 'bcryptjs'

const data = {
  users: [
    {
      name: 'Admin',
      email: 'admin@example.com',
      password: bcrypt.hashSync('12345'),
      rooms: []
    },
    {
      name: 'Alex',
      email: 'alex@example.com',
      password: bcrypt.hashSync('12345'),
      rooms: []
    }
  ],
  rooms: [
    {
      name: 'Test room',
      passcode: bcrypt.hashSync('12345'),
      users: []
    },
    {
      name: 'Second test room',
      passcode: bcrypt.hashSync('12345'),
      users: []
    }
  ],
  category: [
    {
      name: 'Food',
      rooms: {},
      items: []
    },
    {
      name: 'Pharm',
      rooms: {},
      items: []
    }
  ],
  items: [
    {
      name: 'Milk',
      category: {}
    },
    {
      name: 'Eggs',
      category: {}
    },
    {
      name: 'Anti-Sicking',
      category: {}
    },
    {
      name: 'Anti-Headack',
      category: {}
    }
  ]
}
