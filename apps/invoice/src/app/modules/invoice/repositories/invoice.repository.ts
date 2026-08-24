import { INVOICE_STATUS } from '@common/constants/enum/invoice.enum';
import { Invoice, InvoiceModel, InvoiceModelName } from '@common/schemas/invoice.schema';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class InvoiceRepository {
  constructor(@InjectModel(InvoiceModelName) private readonly invoiceModel: InvoiceModel) {}

  async create(data: Partial<Invoice>): Promise<Invoice> {
    const invoice = await this.invoiceModel.create({
      ...data,
      status: INVOICE_STATUS.CREATED,
    });

    return invoice.toObject();
  }

  getById(id: string): Promise<Invoice | null> {
    return this.invoiceModel.findById(id);
  }

  updateById(id: string, data: Partial<Invoice>): Promise<Invoice | null> {
    return this.invoiceModel.findByIdAndUpdate(id, data, { new: true });
  }

  deleteById(id: string): Promise<Invoice | null> {
    return this.invoiceModel.findByIdAndDelete(id);
  }
}
