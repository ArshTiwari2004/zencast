import { Model } from 'objection'

class Recording extends Model {
  static get tableName() {
    return 'recordings'
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['userId', 'title'],
      properties: {
        id: { type: 'string', format: 'uuid' },
        userId: { type: 'string', format: 'uuid' },
        title: { type: 'string', minLength: 1 },
        description: { type: 'string' },
        status: { 
          type: 'string',
          enum: ['pending', 'recording', 'uploading', 'processing', 'completed', 'failed']
        },
        s3Key: { type: 'string' },
        duration: { type: 'number' },
        createdAt: { type: 'string', format: 'date-time' },
        updatedAt: { type: 'string', format: 'date-time' }
      }
    }
  }

  static get relationMappings() {
    const User = require('./User').default
    const Participant = require('./Participant').default
    return {
      user: {
        relation: Model.BelongsToOneRelation,
        modelClass: User,
        join: {
          from: 'recordings.userId',
          to: 'users.id'
        }
      },
      participants: {
        relation: Model.HasManyRelation,
        modelClass: Participant,
        join: {
          from: 'recordings.id',
          to: 'participants.recordingId'
        }
      }
    }
  }

  $beforeInsert() {
    this.createdAt = new Date().toISOString()
    this.updatedAt = new Date().toISOString()
  }

  $beforeUpdate() {
    this.updatedAt = new Date().toISOString()
  }
}

export default Recording