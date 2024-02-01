import { Injectable } from '@nestjs/common';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Notification } from './entities/notification.entity';
import { Repository } from 'typeorm';
import axios from 'axios';
import { PaginationDto } from 'src/common/dtos/pagination.dto';

@Injectable()
export class NotificationsService {

  constructor(
    @InjectRepository(Notification)
    private readonly notificationRepository: Repository<Notification>,
  ) { }

  
  async createNotification(createNotificationDto: CreateNotificationDto) {
    const notificationSendApi = false;
    const chat_id_telegram = '-1002081115144';
    try {
      const { content} = createNotificationDto;

      const newnotification = this.notificationRepository.create({
        content,
        notificationSent: notificationSendApi,
      });
      const notification = await this.notificationRepository.save(newnotification);

      const telegramApiUrl = 'https://api.telegram.org/bot6975775664:AAGaZGiJDw1WZ7q7QnmSAXif87dUyj-dyac/sendMessage';
      const telegramMessage = {
        chat_id: chat_id_telegram,
        text: content,
      };

      const response = await axios.post(telegramApiUrl, telegramMessage);
      if (response.data.ok === true) {
        newnotification.notificationSent = true;
        await this.notificationRepository.save(newnotification);
      }

      return { ...notification };
    } catch (error) {
      return {
        ok: false,
        error: error.message,
      }
    }
  }

  async findAll(paginationDto: PaginationDto) {
    const { limit = 10, offset = 0 } = paginationDto;

    if (limit < 0 || offset < 0) {
      throw new Error('Limit and offset must be non-negative values.');
    }

    const [notification, total] = await this.notificationRepository.findAndCount({
      skip: offset,
      take: limit,
      order: {
        createDate: 'DESC',
      },
    });

    return notification;
  }

  findOne(id: number) {
    return `This action returns a #${id} notification`;
  }

  update(id: number, updateNotificationDto: UpdateNotificationDto) {
    return `This action updates a #${id} notification`;
  }

  remove(id: number) {
    return `This action removes a #${id} notification`;
  }
}
