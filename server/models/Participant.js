import { Model } from 'objection'

class Participant extends Model {
  static get tableName() {
    return 'participants'
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['recordingId', 'userId', 'joinedAt'],
      properties: {
        id: { type: 'string', format: 'uuid' },
        recordingId: { type: 'string', format: 'uuid' },
        userId: { type: 'string', format: 'uuid' },
        joinedAt: { type: 'string', format: 'date-time' },
        leftAt: { type: 'string', format: 'date-time' },
        s3Key: { type: 'string' },
        duration: { type: 'number' }
      }
    }
  }

  static get relationMappings() {
    return {
      recording: {
        relation: Model.BelongsToOneRelation,
        modelClass: async () => {
          const mod = await import('./Recording.js')
          return mod.default
        },
        join: {
          from: 'participants.recordingId',
          to: 'recordings.id'
        }
      },
      user: {
        relation: Model.BelongsToOneRelation,
        modelClass: async () => {
          const mod = await import('./User.js')
          return mod.default
        },
        join: {
          from: 'participants.userId',
          to: 'users.id'
        }
      }
    }
  }
}

export default Participant
