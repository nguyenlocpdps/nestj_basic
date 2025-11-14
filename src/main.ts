import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { TransformInterceptor } from './core/transform.interceptor';
import cookieParser from 'cookie-parser';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.useStaticAssets(join(__dirname, '..', 'public')); //js, css, images
  app.setBaseViewsDir(join(__dirname, '..', 'views')); //view
  app.setViewEngine('ejs');
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );

  //config swagger
  const config = new DocumentBuilder()
    .setTitle('Nest JS')
    .setDescription('The NestJS API description')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'Bearer',
        bearerFormat: 'JWT',
        in: 'header',
      },
      'token', // This name here is important for matching up with @ApiBearerAuth() in your controller!
    )
    .addSecurityRequirements('token')
    .build();

  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory, {
     swaggerOptions: {
        persistAuthorization: true, // this
    },
  });

  //config cookie-parser
  app.use(cookieParser());

  //config cors
  app.enableCors({
    origin: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    preflightContinue: false,
    optionsSuccessStatus: 204,
    credentials: true,
  });
  const reflector = app.get(Reflector);

  app.useGlobalInterceptors(new TransformInterceptor(reflector));
  app.useGlobalGuards(new JwtAuthGuard(reflector)); //global guard

  //enable versioning API
  app.setGlobalPrefix('api'); //global prefix
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: ['1'],
  });
  const configService = app.get(ConfigService);

  await app.listen(configService.get<string>('PORT'));
}
bootstrap();
