import { BadRequestException, Inject, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import { LoginUserDto } from './dto/login-user.dto';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { JwtService } from '@nestjs/jwt';
import { NotificationsService } from 'src/notifications/notifications.service';
import axios from 'axios';
import * as requestIp from 'request-ip';
import { TwoFactorToken } from './entities/two_factor_token.entity';
import { verifyEmail } from './dto/verify-email.dto';

@Injectable()
export class AuthService {

  constructor(
    @Inject(NotificationsService)
    private readonly notificationsService: NotificationsService,
    
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(TwoFactorToken)
    private readonly twoFactorTokenRepository: Repository<TwoFactorToken>,


    private readonly jwtService: JwtService
  ) { }

  async create(createUserDto: CreateUserDto) {
    try {
      const { password, ...userData } = createUserDto;
      const user = this.userRepository.create({
        ...userData,
        password: await bcrypt.hashSync(password, 10)
      });
      await this.userRepository.save(user);
      delete user.password;
      return {
        ...user,
        token: this.getJwtToken({id:user.id})
      };
    } catch (error) {
      this.handleDBError(error);
    }
  }

  async getIpAddressInfo(ipAddress: string) {
    const response = await axios.get(`https://ipinfo.io/${ipAddress}?token=e52e757b8b05ec`);
    return response.data;
  }

  async login(loginUserDto: LoginUserDto) {
    const { password, email,code } = loginUserDto;

    const user = await this.userRepository.findOne({
      where: { email },
      select: { email: true, password: true, id: true, isActive: true, roles: true, isTwoFactorEnabled: true},
    });

    if (code) {
      const twoFactorToken = await this.twoFactorTokenRepository.findOne({
        where: { user: { id: user.id } }
      });
      console.log(twoFactorToken);
      if (code !== twoFactorToken.token) {
        throw new UnauthorizedException('Credenciales no válidas (code)');
      }
      // await this.twoFactorTokenRepository.delete(twoFactorToken.id);
    }

    if (!user) {
      throw new UnauthorizedException('Credenciales no válidas (email)');
    }

    if (!bcrypt.compareSync(password, user.password)) {
      throw new UnauthorizedException('Credenciales no válidas (password)');
    }

    delete user.password;
    
    console.log(user);

    


    
    await this.notificationsService.createNotification({
      content: `El usuario ${user.email} ha iniciado sesión.`
    });
    

    return {
      ...user,
      token: this.getJwtToken({ id: user.id }),
    };
  }

  generateRandomNumber(): number {
    return Math.floor(10000 + Math.random() * 90000);
  }

  async createTwoFactor(user: User){
    try {
      const randomNumber = this.generateRandomNumber().toString();
      await this.notificationsService.createNotification({
        content: `Usa el codigo: ${randomNumber}  para ingresar al sistema.`
      });
      const twoFactorToken = this.twoFactorTokenRepository.create({
        token: randomNumber,
        user: user
      });
      await this.twoFactorTokenRepository.save(twoFactorToken);
    } catch (error) {
      this.handleDBError(error);
    }
  }
  
  async verifyEmailUser(verifyEmail: verifyEmail){
    await this.notificationsService.createNotification({
      content: `El usuario ${verifyEmail.email} esta intentanto verificarse.`
    });
    try {
      const user = await this.userRepository.findOne({
          where: { email:verifyEmail.email }
      });
      if (user.isTwoFactorEnabled) {
        this.createTwoFactor(user)
      }

      return user;
  } catch (error) {
      console.error('Error al verificar el usuario por correo electrónico:', error.message);
      throw error; // Puedes lanzar el error o devolver un valor predeterminado según tus necesidades
  }
  }

  async checkAuthStatus(user: User) {
    return {
      ...user,
      token: this.getJwtToken({id:user.id})
    };
  }

  private getJwtToken(payload: JwtPayload) {
    const token = this.jwtService.sign(payload);
    return token;
  }

  private handleDBError(error: any): never {
    if (error.code === '23505') throw new BadRequestException(error.detail);
    throw new InternalServerErrorException('Consulte los registros del servidor para obtener más detalles.');
  }

}
