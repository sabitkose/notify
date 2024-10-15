import { CreateEmailDto } from './dto/create-email.dto';
import { Message } from '../message/message.schema';
import { Model } from 'mongoose';
import { CreateEmailResultDto } from './dto/create-email-result.dto';

export class EmailMapper {
  static createDtoToMessage(dto: CreateEmailDto, MessageModel: Model<Message>): Message {
    const message = new MessageModel();
    message.type = 'email'; // Varsayılan olarak email olarak ayarlandı, ihtiyaca göre güncellenebilir.
    message.uniqueMessageKey = dto.uniqueMessageKey;
    message.identity = dto.identity;
    message.contact = dto.contact;
    message.language = dto.language;
    message.data = dto.data;
    message.subject = dto.subject;
    message.content = 'preparing';
    message.status = 'awaiting'; // Varsayılan olarak awaiting olarak ayarlandı, ihtiyaca göre güncellenebilir.
    message.retryCount = 1;
    return message;
  }

  static createResultDtoFromMessage(message: Message): CreateEmailResultDto {
    const dto = new CreateEmailResultDto();
    dto.id = message.id;
    dto.uniqueMessageKey = message.uniqueMessageKey;
    dto.identity = message.identity;
    dto.contact = message.contact;
    dto.language = message.language;
    dto.data = message.data;
    dto.subject = message.subject;
    dto.content = message.content;
    dto.status = message.status;
    dto.retryCount = message.retryCount;
    dto.template = message.template;
    dto.requestDate = message.requestDate;
    dto.mailSentInfo = message.mailSentInfo;
    return dto;
  }
}
