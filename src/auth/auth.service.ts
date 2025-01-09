import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './entities/user.entity';
import { Model } from 'mongoose';

@Injectable()
export class AuthService {

  constructor(
    @InjectModel(User.name)
    private userModel: Model<User>
  ) { }

  async create(createAuthDto: CreateUserDto): Promise<User> {

    //1- Encriptar contraseña
    //2- Guardar en BD
    //3- Generar el JWT
    //4- Manejar exepciones

    try {
      const newUser = new this.userModel(createAuthDto);
      return await newUser.save();
    } catch (error) {
      if (error.code === 11000) {
        throw new BadRequestException(`${createAuthDto.email} already exists!`);
      }
      throw new InternalServerErrorException('Something terrible happened');
    }

  }

  findAll() {
    return `This action returns all auth`;
  }

  findOne(id: number) {
    return `This action returns a #${id} auth`;
  }

  update(id: number, updateAuthDto: UpdateAuthDto) {
    return `This action updates a #${id} auth`;
  }

  remove(id: number) {
    return `This action removes a #${id} auth`;
  }
}
