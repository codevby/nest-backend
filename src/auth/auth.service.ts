import { BadRequestException, Body, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import * as bcryptjs from 'bcryptjs';

import { LoginDto, RegisterUserDto, CreateUserDto, UpdateAuthDto } from './dto';
import { User } from './entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './interfaces/jwt.payload';
import { LoginResponse } from './interfaces/login-response';

@Injectable()
export class AuthService {

  constructor(
    @InjectModel(User.name)
    private userModel: Model<User>,

    private jwtService: JwtService,
  ) { }

  async create(createUserDto: CreateUserDto): Promise<User> {

    try {

      //1- Encriptar contraseña
      const { password, ...userData } = createUserDto;

      const newUser = new this.userModel({
        password: bcryptjs.hashSync(password, 10),
        ...userData
      });

      await newUser.save();

      const { password: _, ...user } = newUser.toJSON();

      return user;
      //2- Guardar en BD
      //3- Generar el JWT
      //4- Manejar exepciones

      //const newUser = new this.userModel(createAuthDto);
    } catch (error) {
      if (error.code === 11000) {
        throw new BadRequestException(`${createUserDto.email} already exists!`);
      }
      throw new InternalServerErrorException('Something terrible happened');
    }

  }

  async register(registerDto: RegisterUserDto): Promise<LoginResponse> {

    const user = await this.create(registerDto);
    console.log(user);

    return {
      user,
      token: this.getJwtToken({ id: user._id })
    }

  }

  async login(loginDto: LoginDto): Promise<LoginResponse> {

    const { email, password } = loginDto;

    const user = await this.userModel.findOne({ email });

    if (!user) {
      throw new UnauthorizedException('Not Valid Credentials');
    }

    if (!bcryptjs.compareSync(password, user.password)) {
      throw new UnauthorizedException('Not Valid Credentials');
    }

    const { password: _, ...rest } = user.toJSON();

    return {
      user: rest,
      token: this.getJwtToken({ id: user.id })
    };

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

  getJwtToken(payload: JwtPayload) {
    const token = this.jwtService.sign(payload);
    return token;
  }

}
