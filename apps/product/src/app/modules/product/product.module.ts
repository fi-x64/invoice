import { TypeOrmProvider } from '@common/configuration/type-orm.config';
import { Product } from '@common/entities/product.entity';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductRepository } from '../repositories/product.repository';
import { ProductService } from '../services/product.service';
import { ProductController } from './controllers/product.controller';

@Module({
  imports: [TypeOrmProvider, TypeOrmModule.forFeature([Product])],
  controllers: [ProductController],
  providers: [ProductService, ProductRepository],
  exports: [],
})
export class ProductModule {}
