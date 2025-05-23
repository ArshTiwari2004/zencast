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
        userId: { type: 'integer' },  // lowercase to match DB column
        title: { type: 'string', minLength: 1 },
        description: { type: 'string' },
        status: {
          type: 'string',
          enum: ['pending', 'recording', 'uploading', 'processing', 'completed', 'failed']
        },
        s3key: { type: 'string' },
        duration: { type: 'number' },
        createdat: { type: 'string', format: 'date-time' }, // lowercase
        updatedat: { type: 'string', format: 'date-time' }  // lowercase
      }
    }
  }

  static get relationMappings() {
    return {
      user: {
        relation: Model.BelongsToOneRelation,
        modelClass: async () => {
          const mod = await import('./User.js')
          return mod.default
        },
        join: {
          from: 'recordings.userId',
          to: 'users.id'
        }
      },
      participants: {
        relation: Model.HasManyRelation,
        modelClass: async () => {
          const mod = await import('./Participant.js')
          return mod.default
        },
        join: {
          from: 'recordings.id',
          to: 'participants.recordingId'
        }
      }
    }
  }

  $beforeInsert() {
    const now = new Date().toISOString()
    this.createdat = now
    this.updatedat = now
  }

  $beforeUpdate() {
    this.updatedat = new Date().toISOString()
  }
}


export default Recording
