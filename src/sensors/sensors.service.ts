import { Injectable } from '@nestjs/common';
import { CreateSensorDto } from './dto/create-sensor.dto';
import { UpdateSensorDto } from './dto/update-sensor.dto';
import { InjectRepository } from '@nestjs/typeorm/dist/common/typeorm.decorators';
import { Sensor } from './entities/sensor.entity';
import { Repository } from 'typeorm';
import { PaginationDto } from 'src/common/dtos/pagination.dto';

@Injectable()
export class SensorsService {

  constructor(
    @InjectRepository(Sensor)
    private readonly sensorRepository: Repository<Sensor>,
  ) { }

  async create(createSensorDto: CreateSensorDto) {
    try {
      const {  ...sensorDetails } = createSensorDto;
      const newsensor = this.sensorRepository.create({
        ...sensorDetails,
      });
      const sensor = await this.sensorRepository.save(newsensor);

      return {...sensor};
    } catch (error) {
      
    }
  }

  async findAll(paginationDto: PaginationDto) {
    const { limit = 10, offset = 0 } = paginationDto;

    if (limit < 0 || offset < 0) {
      throw new Error('Limit and offset must be non-negative values.');
    }

    const [sensors, total] = await this.sensorRepository.findAndCount({
      skip: offset,
      take: limit,
    });

    return sensors;
  }

  findOne(id: number) {
    return `This action returns a #${id} sensor`;
  }

  update(id: number, updateSensorDto: UpdateSensorDto) {
    return `This action updates a #${id} sensor`;
  }

  remove(id: number) {
    return `This action removes a #${id} sensor`;
  }
}
