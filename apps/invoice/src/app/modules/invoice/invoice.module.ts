import { MongoProvider } from '@common/configuration/mongo.config';
import { TCP_SERVICES, TcpProvider } from '@common/configuration/tcp.config';
import { InvoiceDestination } from '@common/schemas/invoice.schema';
import { Module } from '@nestjs/common';
import { ClientsModule } from '@nestjs/microservices';
import { MongooseModule } from '@nestjs/mongoose';
import { InvoiceController } from './controllers/invoice.controller';
import { InvoiceRepository } from './repositories/invoice.repository';
import { InvoiceService } from './services/invoice.service';

@Module({
  imports: [
    MongoProvider,
    MongooseModule.forFeature([InvoiceDestination]),
    ClientsModule.registerAsync([TcpProvider(TCP_SERVICES.PDF_GENERATOR_SERVICE)]),
  ],
  controllers: [InvoiceController],
  providers: [InvoiceService, InvoiceRepository],
})
export class InvoiceModule {}
