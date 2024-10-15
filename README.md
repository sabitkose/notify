<p align="center">
  <a href="http://******.com" target="blank"><img src="https://img.uxcel.com/tags/notifications-1700498330224-2x.jpg" width="200" alt="Nest Logo" /></a>
</p>

  <p align="center">Sabit's Notification Service provides APIs for sending notifications such as emails.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://coveralls.io/github/nestjs/nest?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#9" alt="Coverage" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
</p>
  
## Description

### Notify - Notification Service

Notify is a service that provides APIs for sending notifications such as emails, built with the NestJS framework.

### Features:

- Sends email notifications with customizable templates.
- Supports multiple languages using the Polyglot library.
- API documentation available via Swagger UI.
- Handlebars used for dynamic email templates.

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Running the App with Docker

To run the application using Docker, use the following command:

```bash
$ docker-compose up

```

## API Documentation

This documentation outlines the API specifications and endpoints. You can explore and interact with the API using the Swagger UI interface.

Access the API documentation at: [http://localhost:3000/api-documents](http://localhost:3000/api-documents)

## Configuring Environment Variables

The application can be configured using environment variables. There are two main ways to set these variables:

### 1. Using a .env File

Create a file named `.env` in the root of your project and specify the required environment variables. For example:

```env
PORT=3000
# Add other environment variables...
```

## Email Template Files

The email template files are stored in the `./templates` directory. This directory houses templates used for creating email messages. It's important to note that template support is implemented using the "handlebars" library. Handlebars allows dynamic content rendering and simplifies the process of crafting email templates.

### Handlebars Template Examples

Here are a few examples to illustrate how to use Handlebars in your email templates:

#### Basic Variable Insertion

```handlebars
<p>Hello, {{name}}!</p>
```

### Conditional Rendering

```
{{#if isNewUser}}
  <p>Welcome to our platform!</p>
{{else}}
  <p>Thanks for being with us!</p>
{{/if}}
```

### Looping through Items

```
<ul>
  {{#each items}}
    <li>{{ this }}</li>
  {{/each}}
</ul>
```

## Language Files

Language support files are stored in the `./locales` directory. Within this directory, you'll find files responsible for providing language support in your application. To configure the supported languages, use the environment parameter specified in your project's configuration.

### Polyglot Library Integration

Our language support is implemented using the "Polyglot" library. Polyglot simplifies the process of handling multilingual content in your application.

#### Example Usage:

```javascript
{{t 'welcome'}}
```

## Example API Calls

### Delete an email message

```
curl --request DELETE \
  --url http://localhost:3000/v1/emails/65c9fc786736d5d7d7abc5e7 \
  --header 'User-Agent: insomnia/8.6.1'
```

### Retrieve a list of all email messages.

```
curl --request GET \
  --url http://localhost:3000/v1/emails/ \
  --header 'User-Agent: insomnia/8.6.0'
```

### Retrieve a list of email messages based on the provided filters.

```
curl --request POST \
  --url http://localhost:3000/v1/emails/filter \
  --header 'Content-Type: application/json' \
  --header 'User-Agent: insomnia/8.6.0' \
  --data '    {
      "status": "awaiting",
      "identity": "sabit",
      "uniqueMessageKey": "ops+72",
      "contact": "s*******e@gmail.com",
      "language": "en-GB",
      "subject": "subject test",
      "retryLimit": 1,
      "template": "example-templatex",
       "requestDate": {
        "start": "2024-02-01T00:00:00.000Z",
        "end": "2024-02-12T11:10:00.000Z"
      }
    }'
```

### Creates and sends email messages based on the provided template.

```
curl --request POST \
  --url http://localhost:3000/v1/emails/example-template \
  --header 'Content-Type: application/json' \
  --data '[
		{
		"uniqueMessageKey": "ops+77",
		"identity": "sabit.kose",
		"contact": "sa******e@gmail.com",
		"language": "tr-TR",
		"subject": "subject test",
		"data": {
				"name": "Sabit",
				"lastname": "Köse",
				"email": "sa***@******.com",
				"membership_date": "01.01.2023",
				"documents": [
					{
						"url": "*****.com",
						"name": "Document x"
					},
					{
						"url": "*****.com",
						"name": "Document y"
					},
					{
						"url": "*****..com",
						"name": "Document z"
					}
				]
		}
	}
]'
```
