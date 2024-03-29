import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { User } from './entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtStrategy } from './strategies/jwt.strategy';
import { TwoFactorToken } from './entities/two_factor_token.entity';
import { NotificationsModule } from 'src/notifications/notifications.module';

@Module({
  controllers: [AuthController],
  providers: [AuthService,JwtStrategy],
  imports: [
    NotificationsModule,
    ConfigModule,
    TypeOrmModule.forFeature([User,TwoFactorToken]),
    PassportModule.register({defaultStrategy: 'jwt'}),

    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        // console.log('process.env.JWT_SECRET', configService.get('JWT_SECRET'));
        // console.log('process.env.JWT_SECRET', process.env.JWT_SECRET);
        return {
          secret: configService.get('JWT_SECRET'),
          signOptions: { expiresIn: '30d' }
        }
      }
    })
  ],
  exports: [TypeOrmModule,JwtStrategy,PassportModule, JwtModule]
})
export class AuthModule { }
