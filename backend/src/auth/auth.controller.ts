import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  Req,
  Headers,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { TokenBlacklistService } from './token-blacklist.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly blacklist: TokenBlacklistService,
  ) {}

  @Post('register')
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  /**
   * POST /auth/logout
   *
   * Accepts the JWT via:
   *   1. Authorization: Bearer <token>  header  (from the logout() utility)
   *   2. Body: { token }                         (from navigator.sendBeacon on browser close)
   *
   * The token is added to the in-memory blacklist, which is checked by JwtStrategy
   * on every subsequent request.
   */
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  logout(
    @Headers('authorization') authHeader: string | undefined,
    @Body() body: { token?: string },
  ) {
    // Extract token from header first, then fall back to body (sendBeacon payload)
    let token: string | undefined;

    if (authHeader?.startsWith('Bearer ')) {
      token = authHeader.slice(7).trim();
    } else if (body?.token) {
      token = body.token;
    }

    if (token) {
      this.blacklist.blacklist(token);
    }

    return { message: 'Logged out successfully' };
  }
}
