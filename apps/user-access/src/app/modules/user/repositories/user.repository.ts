import { User, UserModel, UserModelName } from '@common/schemas/user.schema';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class UserRepository {
  constructor(@InjectModel(UserModelName) private readonly userModel: UserModel) {}

  create(data: Partial<User>) {
    return this.userModel.create(data);
  }

  getById(id: string) {
    return this.userModel.findById(id).exec();
  }

  getByUserId(userId: string) {
    return this.userModel.findOne({ userId }).populate('roles').exec();
  }

  getByUserIdOrEmail(params: { userId?: string; email?: string }) {
    const conditions = [{ userId: params.userId }, { email: params.email }].filter(
      (condition) => Object.values(condition)[0],
    );

    if (!conditions.length) {
      return null;
    }

    return this.userModel.findOne({ $or: conditions }).populate('roles').exec();
  }

  getByEmail(email: string) {
    return this.userModel.findOne({ email }).exec();
  }

  async exists(email: string) {
    const result = await this.userModel.exists({ email }).exec();

    return !!result;
  }
}
