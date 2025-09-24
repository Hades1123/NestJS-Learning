import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import mongoose, { Model } from 'mongoose';
import bcrypt, { compareSync, genSaltSync, hash } from 'bcryptjs'

@Injectable()
export class UsersService {

	constructor(
		@InjectModel(User.name) private userModel: Model<User>,
	) { }

	getHashPassword = async (plainText: string) => {
		const salt = genSaltSync(10);
		const hashed = hash(plainText, salt);
		return hashed;
	}

	async create(user: CreateUserDto) {
		const hashPassword = await this.getHashPassword(user.password);
		const result = await this.userModel.create({
			name: user.name,
			email: user.email,
			password: hashPassword,
		});
		return result;
	}

	async findAll() {
		const users = await this.userModel.find();
		return users;
	}

	findOne(id: string) {
		if (!mongoose.Types.ObjectId.isValid(id)) {
			return 'Invalid id';
		}
		return this.userModel.findOne({
			_id: id,
		})
	}

	async findOneByUsername(username: string) {
		return await this.userModel.findOne({
			email: username,
		})
	}

	async update(updateUserDto: UpdateUserDto) {
		return await this.userModel.updateOne({ _id: updateUserDto._id }, { ...updateUserDto })
	}

	async remove(id: string) {
		if (!mongoose.Types.ObjectId.isValid(id)) {
			return 'Invalid id';
		}
		return await this.userModel.deleteOne({
			_id: id,
		})
	}

	isValidPassword(password: string, hashPassword: string) {
		return compareSync(password, hashPassword);
	}
}
