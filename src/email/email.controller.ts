import { Controller, Get, Post, Body, Param, Delete, Res, HttpStatus, Query } from '@nestjs/common';
import { EmailService } from './email.service';
import { CreateEmailDto } from './dto/create-email.dto';
import { Response } from 'express';
import { ApiResponse as CustomApiResponse } from 'src/common/api-response';
import { ApiTags, ApiResponse, ApiOperation, ApiParam, ApiBody } from '@nestjs/swagger';
import { CreateEmailResultDto } from './dto/create-email-result.dto';
import { CreateEmailConflictResultDto } from './dto/create-email-conflict-result.dto';
import { FilterEmailDto } from './dto/filter-email.dto';

@ApiTags('emails')
@Controller('v1/emails')
export class EmailController {
  constructor(private readonly emailService: EmailService) {}

  @Get()
  @ApiOperation({ summary: 'Get all email messages', description: 'Retrieve a list of all email messages.' })
  @ApiResponse({ status: 200, description: 'Success', type: CreateEmailResultDto, isArray: true })
  async findAll(@Res() res: Response): Promise<void> {
    const results = await this.emailService.findAll(null);
    res.status(HttpStatus.OK).json(CustomApiResponse.success(results, HttpStatus.OK, 'Success'));
  }

  @ApiOperation({ summary: 'Get email messages with filters', description: 'Retrieve a list of email messages based on the provided filters.' })
  @ApiParam({ name: 'filters', description: 'The filters to apply', type: FilterEmailDto })
  @ApiResponse({ status: 200, description: 'Successful operation', type: CreateEmailResultDto, isArray: true })
  @ApiResponse({ status: 404, description: 'Record not found' })
  @Post('filter')
  async findAllWithFilter(@Body() filters: FilterEmailDto, @Res() res: Response): Promise<void> {
    console.log(filters);
    const results = await this.emailService.findAll(filters);
    res.status(HttpStatus.OK).json(CustomApiResponse.success(results, HttpStatus.OK, 'Success'));
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a record by ID', description: 'Returns a single record based on the provided ID.' })
  @ApiParam({ name: 'id', description: 'ID of the record', type: 'string' })
  @ApiResponse({ status: 200, description: 'Successful operation', type: CreateEmailResultDto })
  @ApiResponse({ status: 404, description: 'Record not found' })
  async findOne(@Param('id') id: string, @Res() res: Response): Promise<void> {
    const result = await this.emailService.findOne(id);
    res.status(HttpStatus.OK).json(CustomApiResponse.success(result, HttpStatus.OK, 'Success'));
  }

  @Post('/:template')
  @ApiOperation({
    summary: 'Create and send email messages',
    description: 'Creates and sends email messages based on the provided template.'
  })
  @ApiParam({ name: 'template', description: 'Name of the email template to use for creating messages.' }) 
  @ApiBody({ type: [CreateEmailDto], description: 'Array of objects containing information to create email messages.' }) 
  @ApiResponse({ status: 201, description: 'Email messages successfully created.', type: CreateEmailResultDto, isArray: true })
  @ApiResponse({ status: 409, description: 'Conflict. Some or all of the records have already been created.', type: CreateEmailConflictResultDto})
  async create(@Body() createEmailDtos: CreateEmailDto[], @Param('template') template: string, @Res() res: Response): Promise<void> {
    const results = await this.emailService.create(template, createEmailDtos);
    res.status(HttpStatus.CREATED).json(CustomApiResponse.success(results, HttpStatus.CREATED, 'Success'));
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete an email message', description: 'Delete an email message based on the provided ID.' })
  @ApiResponse({ status: 204, description: 'Email message successfully deleted.' })
  @ApiResponse({ status: 404, description: 'Email message not found.' })
  async remove(@Param('id') id: string, @Res() res: Response): Promise<void> {
    try {
      const result = await this.emailService.remove(id);
      res.status(204).send();
    } catch (error) {
      res.status(HttpStatus.NOT_FOUND).json(CustomApiResponse.error(null, null, HttpStatus.NOT_FOUND, 'Email message not found.'));
    }
  }

  @Get('preview/:id/:uniqueMessageKey')
  @ApiOperation({ summary: 'Preview email content', description: 'Preview email content based on the provided ID and unique message key.' })
  @ApiResponse({ status: 200, description: 'Success' })
  @ApiResponse({ status: 404, description: 'Email message not found.' })
  previewContent(@Param('id') id: string, @Param('uniqueMessageKey') uniqueMessageKey: string) {
    return this.emailService.previewContent(id, uniqueMessageKey);
  }

  @Get('templates/list')
  @ApiOperation({ summary: 'Get template list', description: 'Get a list of available email templates.' })
  @ApiResponse({ status: 200, description: 'Success' })
  getTemplateList() {
    return this.emailService.templateList();
  }

}
