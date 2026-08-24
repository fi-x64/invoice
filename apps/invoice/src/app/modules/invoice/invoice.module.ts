import { MongoProvider } from '@common/configuration/mongo.config';
import { InvoiceDestination } from '@common/schemas/invoice.schema';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { InvoiceController } from './controllers/invoice.controller';
import { InvoiceRepository } from './repositories/invoice.repository';
import { InvoiceService } from './services/invoice.service';

@Module({
  imports: [MongoProvider, MongooseModule.forFeature([InvoiceDestination])],
  controllers: [InvoiceController],
  providers: [InvoiceService, InvoiceRepository],
})
export class InvoiceModule {}
