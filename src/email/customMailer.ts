import * as nodemailer from 'nodemailer';
import * as sesTransport from 'nodemailer-ses-transport';
import * as handlebars from 'handlebars';
import * as fs from 'fs';
import * as path from 'path';
const Polyglot = require('node-polyglot');
import { CustomConfig } from '../common/customConfig';
import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { ApiResponse } from 'src/common/api-response';

export class CustomMailer {
  // Nodemailer transporter for AWS SES
  private transporter: nodemailer.Transporter;
  
  // Handlebars instance
  private handlebars: typeof handlebars;
  
  // Translations for different locales
  private translations: {};

  constructor() {
    // Set up Nodemailer transporter for communication with AWS SES
    this.transporter = nodemailer.createTransport(
      sesTransport({
        accessKeyId: CustomConfig.AWS_SES_ACCESS_KEY_ID,
        secretAccessKey: CustomConfig.AWS_SES_SECRET_ACCESS_KEY,
        region: CustomConfig.AWS_REGION,
      }),
    );

    // Configuration for Handlebars.js can be done here
    this.handlebars = handlebars;

    // Configuration for gettext for language support
    const projectRoot = path.resolve(__dirname, '../');
    const localeFolderPath = path.join(projectRoot, 'locales');
    this.translations = this.loadTranslations(localeFolderPath);
    this.registerPartials();
  }

  // Load translations from JSON files
  loadTranslations(folderPath) {
    const translations = {};
    const supportedLocales = CustomConfig.APP_SUPPORTED_LOCALES;
    supportedLocales.forEach((locale) => {
      const filePath = `${folderPath}/${locale}.json`;
      try {
        const fileContent = fs.readFileSync(filePath, 'utf-8');
        translations[locale] = JSON.parse(fileContent);
      } catch (error) {
        console.error(`Error loading translations for ${locale}:`, error);
      }
    });

    return translations;
  }

  // Register Handlebars partials from the 'templates/partials' folder
  registerPartials() {
    const projectRoot = path.resolve(__dirname, '../');
    const partialsFolderPath = path.join(projectRoot, 'templates/partials');
    const partialFiles = fs.readdirSync(partialsFolderPath);
    partialFiles.forEach((partialFile) => {
      const partialFilePath = path.join(partialsFolderPath, partialFile);
      const partialContent = fs.readFileSync(partialFilePath, 'utf-8');
      const partialName = path.parse(partialFile).name;
      handlebars.registerPartial(partialName, partialContent);
    });
  }

  // Load the Handlebars template from the 'templates' folder
  loadTemplate(templateName) {
    try {
      const projectRoot = path.resolve(__dirname, '../');
      const localeFolderPath = path.join(projectRoot, 'templates');
      const templatePath = `${localeFolderPath}/${templateName}.hbs`;
      const template = fs.readFileSync(templatePath, 'utf-8');
      return template;
    } catch (error) {
      console.log(error);
      throw new HttpException(ApiResponse.error(null, `Template '${templateName}' not found`, HttpStatus.NOT_FOUND, `Template '${templateName}' not found`), HttpStatus.NOT_FOUND);
    }
  }

  // Load and configure Polyglot.js for translation
  loadTranslate(locale) {
    // Configure Polyglot.js
    const polyglot = new Polyglot();
    polyglot.extend(this.translations[locale]);

    // Register a Handlebars helper for translation
    handlebars.registerHelper('t', function (key) {
      return polyglot.t(key);
    });
  }

  // Send an email using Nodemailer and Handlebars template
  async sendMail(to, subject, templateName, context, locale = 'en-GB') {
    try {
      const template = this.loadTemplate(templateName);
      this.loadTranslate(locale);
      
      // Compile Handlebars template
      const compiledTemplate = this.handlebars.compile(template);
      
      // Generate HTML content using the context
      const htmlContent = compiledTemplate(context);
      
      // Set up mail options
      const mailOptions = {
        from: CustomConfig.AWS_MAIL_FROM, // An email address verified in AWS SES
        to: to,
        subject: subject,
        html: htmlContent,
      };

      // Send mail
      const result = await this.transporter.sendMail(mailOptions);
      return {
        'mailSentInfo': result,
        'content': htmlContent
      }
    } catch (error) {
      console.error('Error sending mail:', error);
      throw error;
    }
  }

  
  templateList(): { name: string }[] {
    try {
      const projectRoot = path.resolve(__dirname, '../');
      const localeFolderPath = path.join(projectRoot, 'templates');
  
      // Tüm .hbs dosyalarını listelemek için readdirSync kullanılır.
      const templateFiles = fs.readdirSync(localeFolderPath).filter(file => file.endsWith('.hbs'));
  
      // Template listesini oluştur
      const templateList = templateFiles.map(templateFile => ({
        name: path.parse(templateFile).name, // .hbs uzantısını kaldırmak için
        // path: path.join(localeFolderPath, templateFile),
      }));
  
      return templateList;
    } catch (error) {
      console.error(error);
      throw new HttpException(ApiResponse.error(null, 'Template not found', HttpStatus.NOT_FOUND, 'Template not found'), HttpStatus.NOT_FOUND);
    }
  }
  

}
