import { TCP_SERVICES } from '@common/configuration/tcp.config';
import { TCP_REQUEST_MESSAGE } from '@common/constants/enum/tcp-request-message.enum';
import { ProcessId } from '@common/decorators/processid.decorator';
import { CreateInvoiceRequestDto, InvoiceResponseDto } from '@common/interfaces/gateway/invoice';
import { ResponseDto } from '@common/interfaces/gateway/response.interfaces';
import { TcpClient } from '@common/interfaces/tcp/common/tcp-client.interface';
import { CreateInvoiceTcpRequest, InvoiceTcpResponse } from '@common/interfaces/tcp/invoice';
import { Body, Controller, Inject, Post } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { map } from 'rxjs';

@ApiTags('Invoice')
@Controller('invoice')
export class InvoiceController {
  constructor(@Inject(TCP_SERVICES.INVOICE_SERVICE) private readonly invoiceClient: TcpClient) {}

  @Post()
  @ApiOkResponse({ type: ResponseDto<InvoiceResponseDto> })
  @ApiOperation({ summary: 'Create a new invoice' })
  create(@Body() body: CreateInvoiceRequestDto, @ProcessId() processId: string) {
    return this.invoiceClient
      .send<InvoiceTcpResponse, CreateInvoiceTcpRequest>(TCP_REQUEST_MESSAGE.INVOICE.CREATE, { data: body, processId })
      .pipe(
        map(
          (response) => new ResponseDto<InvoiceTcpResponse>({ data: response.data, statusCode: response.statusCode }),
        ),
      );
  }
}
