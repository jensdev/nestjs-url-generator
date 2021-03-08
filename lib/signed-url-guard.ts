import {
  Injectable,
  CanActivate,
  ExecutionContext,
  MethodNotAllowedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { UrlGeneratorService } from './url-generator.service';

@Injectable()
export class SignedUrlGuard implements CanActivate {
  constructor(private readonly urlGeneratorService: UrlGeneratorService) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    return this.validateRequest(request);
  }

  private validateRequest(request: any): boolean {
    if (!request.headers.host) {
      throw new MethodNotAllowedException(
        'Unable to derive host name from request',
      );
    }

    return this.urlGeneratorService.isSignatureValid({
      host: `${request.protocol}://${request.headers.host}`,
      routePath: request._parsedUrl.pathname,
      query: request.query,
    });
  }
}
