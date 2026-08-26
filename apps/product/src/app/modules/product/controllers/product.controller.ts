import { TCP_REQUEST_MESSAGE } from '@common/constants/enum/tcp-request-message.enum';
import { RequestParams } from '@common/decorators/request.param.decorator';
import { TcpLoggingInterceptor } from '@common/interceptors/tcpLogging.interceptor';
import { Response } from '@common/interfaces/tcp/common/response.interface';
import { CreateProductTcpRequest, ProductTcpResponse } from '@common/interfaces/tcp/product';
import { Controller, UseInterceptors } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { ProductService } from '../../services/product.service';

@Controller()
@UseInterceptors(TcpLoggingInterceptor)
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @MessagePattern(TCP_REQUEST_MESSAGE.PRODUCT.CREATE)
  async create(@RequestParams() body: CreateProductTcpRequest): Promise<Response<ProductTcpResponse>> {
    const result = await this.productService.create(body);
    return Response.success<ProductTcpResponse>(result);
  }

  @MessagePattern(TCP_REQUEST_MESSAGE.PRODUCT.GET_LIST)
  async getList(): Promise<Response<ProductTcpResponse[]>> {
    const result = await this.productService.getList();
    return Response.success<ProductTcpResponse[]>(result);
  }
}
