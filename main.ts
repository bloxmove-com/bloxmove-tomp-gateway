import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

// tslint:disable-next-line: no-var-requires
const appVersion = require('../package.json').version;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const options = new DocumentBuilder()
    .setTitle(`bloXmove-TOMP Gateway v${appVersion}`)
    .setDescription('The bloXmove-TOMP Gateway API description.')
    .setVersion('0.1')
    .addServer(process.env.SWAGGER_BASE_PATH || '/')
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api', app, document);
  const portKey = 'PORT';
  const endpoint = process.env[portKey] || 2900;
  await app.listen(endpoint);
}
bootstrap();
