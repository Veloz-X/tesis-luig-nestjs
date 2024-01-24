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

@Injectable()
export class AuthService {

  constructor(
    @Inject(NotificationsService)
    private readonly notificationsService: NotificationsService,
    
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
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
    const response = await axios.get(`https://ipinfo.io/45.71.113.218?token=e52e757b8b05ec`);
    // const response = await axios.get(`https://ipinfo.io/${ipAddress}?token=e52e757b8b05ec`);
    return response.data;
  }

  async login(ipAddress: string, loginUserDto: LoginUserDto) {
    const { password, email } = loginUserDto;

    const user = await this.userRepository.findOne({
      where: { email },
      select: { email: true, password: true, id: true, isActive: true, roles: true, updateDate: true, createDate: true },
    });

    if (!user) {
      throw new UnauthorizedException('Credenciales no válidas (email)');
    }

    if (!bcrypt.compareSync(password, user.password)) {
      throw new UnauthorizedException('Credenciales no válidas (password)');
    }

    delete user.password;
    const dataIp = await this.getIpAddressInfo(ipAddress);
    
    console.log('ipAddress', dataIp);
    await this.notificationsService.createNotification({
      content: `El usuario ${user.email} ha iniciado sesión desde ${dataIp.city}, ${dataIp.region}, ${dataIp.country} ${dataIp.ip}.`
    });

    return {
      ...user,
      token: this.getJwtToken({ id: user.id }),
    };
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
