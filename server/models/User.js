import { Model } from 'objection'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

class User extends Model {
  static get tableName() {
    return 'users'
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['email', 'password'],
      properties: {
        id: { type: 'string', format: 'uuid' },
        email: { type: 'string', format: 'email' },
        password: { type: 'string', minLength: 8 },  // Use password here
        name: { type: 'string', minLength: 2 },
        created_at: { type: 'string', format: 'date-time' },
        updated_at: { type: 'string', format: 'date-time' }
      }
    }
  }

  static get relationMappings() {
    return {
      recordings: {
        relation: Model.HasManyRelation,
        modelClass: async () => {
          const mod = await import('./Recording.js')
          return mod.default
        },
        join: {
          from: 'users.id',
          to: 'recordings.userId'
        }
      }
    }
  }

  async $beforeInsert() {
    const now = new Date().toISOString()
    this.created_at = now
    this.updated_at = now

    if (this.password) {
      this.password = await bcrypt.hash(this.password, 10)
    }
  }

  async $beforeUpdate() {
    this.updated_at = new Date().toISOString()
    if (this.password) {
      this.password = await bcrypt.hash(this.password, 10)
    }
  }

  generateAuthToken() {
    return jwt.sign(
      { id: this.id, email: this.email },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    )
  }

  generateRefreshToken() {
    return jwt.sign(
      { id: this.id },
      process.env.JWT_SECRET,
      { expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN }
    )
  }

  static async findByCredentials(email, password) {
    const user = await this.query().findOne({ email })
    if (!user) {
      throw new Error('Invalid credentials')
    }
    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      throw new Error('Invalid credentials')
    }
    return user
  }
}

export default User
