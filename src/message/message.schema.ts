import * as mongoose from 'mongoose';

const validateContact = (value: string, type: string) => {
  if (type === 'email') {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  } else if (type === 'sms' || type === 'mobile') {
    return /^(\+?\d{1,4}[\s-]?)?\d{10}$/.test(value);
  } else {
    return false;
  }
};

export const MessageSchema = new mongoose.Schema({
  type: { type: String, enum: ['email', 'sms'], required: true },
  template: { type: String, required: true },
  uniqueMessageKey: { type: String, unique: true, required: true },
  identity: { type: String, required: true },
  contact: {
    type: String,
    required: true,
    validate: {
      validator: function (value: string) {
        return validateContact(value, this.get('type'));
      },
      message: 'Invalid contact format',
    },
  },
  language: { type: String, match: /^[a-z]{2}-[A-Z]{2}$/ },
  data: { type: mongoose.Schema.Types.Mixed },
  subject: { type: String, required: true },
  content: { type: String, required: true },
  status: { type: String, enum: ['awaiting', 'sent'], required: true },
  retryCount: { type: Number, default: 1},
  requestDate: { type: Date, default: Date},
  mailSentInfo: { type: mongoose.Schema.Types.Mixed },
});

export interface Message extends mongoose.Document {
  type: 'email' | 'sms';
  template: string;
  uniqueMessageKey: string;
  identity: string;
  contact: string;
  language?: string;
  data?: any;
  subject: string;
  content: string;
  status: 'awaiting' | 'sent';
  retryCount: number;
  requestDate: { type: Date, default: Date };
  mailSentInfo?: any;
}
