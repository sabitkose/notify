import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Message, MessageSchema } from '../message/message.schema';
import { CreateEmailDto } from './dto/create-email.dto';
import { EmailMapper } from './email.mapper';
import { CustomMailer } from './customMailer';
import { CreateEmailResultDto } from './dto/create-email-result.dto';
import { ApiResponse } from 'src/common/api-response';
import { CreateEmailConflictResultDto } from './dto/create-email-conflict-result.dto';

@Injectable()
export class EmailService {
  constructor(
    @InjectModel('Message') private readonly messageModel: Model<Message>,
  ) {}

  async findAll(filters: any): Promise<CreateEmailResultDto[]> {
    const createResultDtos: CreateEmailResultDto[] = [];
    let query = {};
    if (filters) {
      Object.keys(filters).forEach((key) => {
        if (key === 'retryLimit') {
          query['retryCount'] = { $gte: filters[key] };
        } else if (
          key === 'requestDate' &&
          filters[key] &&
          filters[key].start &&
          filters[key].end
        ) {
          query[key] = {
            $gte: new Date(filters[key].start),
            $lte: new Date(filters[key].end),
          };
        } else if (
          ['identity', 'contact', 'subject', 'template'].includes(key)
        ) {
          query[key] = { $regex: new RegExp(filters[key], 'i') };
        } else {
          query[key] = filters[key];
        }
      });
    }

    const messages = await this.messageModel.find(query).exec();
    for (const message of messages) {
      const emailResult = EmailMapper.createResultDtoFromMessage(message);
      emailResult.previewURL = `/v1/emails/preview/${emailResult.id}/${emailResult.uniqueMessageKey}`;
      createResultDtos.push(emailResult);
    }
    return createResultDtos;
  }

  async findOne(id: string): Promise<CreateEmailResultDto> {
    const message = await this.messageModel.findById(id).exec();
    if (!message) {
      throw new NotFoundException(`Message with id ${id} not found.`);
    }
    const emailResult = EmailMapper.createResultDtoFromMessage(message);
    emailResult.previewURL = `/v1/emails/preview/${emailResult.id}/${emailResult.uniqueMessageKey}`;
    return emailResult;
  }

  async create(
    template: string,
    createEmailDtos: CreateEmailDto[],
  ): Promise<CreateEmailResultDto[]> {
    const createEmailResults: CreateEmailResultDto[] = [];
    const existEmailResults: CreateEmailResultDto[] = [];

    for (const createEmailDto of createEmailDtos) {
      const message = EmailMapper.createDtoToMessage(
        createEmailDto,
        this.messageModel,
      );
      const existingMessage = await this.messageModel
        .findOne({ uniqueMessageKey: message.uniqueMessageKey })
        .exec();
      if (existingMessage) {
        existingMessage.retryCount++;
        await existingMessage.save();
        const emailResult =
          EmailMapper.createResultDtoFromMessage(existingMessage);
        emailResult.previewURL = `/v1/emails/preview/${emailResult.id}/${emailResult.uniqueMessageKey}`;
        existEmailResults.push(emailResult);
      } else {
        message.template = template;
        const createdMessage = await message.save();
        const customMailer = new CustomMailer();
        const mailContext = createdMessage.data;
        const result = await customMailer.sendMail(
          createdMessage.contact,
          createdMessage.subject,
          template,
          mailContext,
          createdMessage.language,
        );
        createdMessage.status = 'sent';
        createdMessage.mailSentInfo = result.mailSentInfo;
        createdMessage.content = result.content;
        await createdMessage.save();
        const emailResult =
          EmailMapper.createResultDtoFromMessage(createdMessage);
        emailResult.previewURL = `/v1/emails/preview/${emailResult.id}/${emailResult.uniqueMessageKey}`;
        createEmailResults.push(emailResult);
      }
    }

    let result = new CreateEmailConflictResultDto();
    result.created = createEmailResults;
    result.existing = existEmailResults;

    if (existEmailResults.length > 0) {
      throw new HttpException(
        ApiResponse.error(
          result,
          null,
          HttpStatus.CONFLICT,
          'This request, or some parts of it, has been sent before.',
        ),
        HttpStatus.CONFLICT,
      );
    }

    return createEmailResults;
  }

  async update(id: string, message: Message): Promise<Message> {
    return await this.messageModel
      .findByIdAndUpdate(id, message, { new: true })
      .exec();
  }

  async remove(id: string): Promise<void> {
    const deletedDocument = await this.messageModel
      .findByIdAndDelete(id)
      .exec();

    if (deletedDocument) {
      // Belge başarıyla silindiğinde 204 No Content durumunu döndür
      return;
    } else {
      // Belge bulunamadığında 404 Not Found durumunu döndür
      throw new NotFoundException(`Email message with ID ${id} not found.`);
    }
  }

  async previewContent(id: string, uniqueMessageKey: string): Promise<string> {
    try {
      const message = await this.messageModel.findById(id).exec();
      if (!message) {
        throw new Error();
      }

      // Eğer message'in uniqueMessageKey'i ile header'daki uniqueMessageKey eşleşmiyorsa hata fırlat
      if (message.uniqueMessageKey !== uniqueMessageKey) {
        throw new Error();
      }

      // İçeriği döndür
      return message.content;
    } catch (error) {
      throw new NotFoundException(
        `Message with id ${id} and unique message key ${uniqueMessageKey} not found.`,
      );
    }
  }

  async templateList(): Promise<{ name: string }[]> {
    const customMailer = new CustomMailer();
    return await customMailer.templateList();
  }
}
