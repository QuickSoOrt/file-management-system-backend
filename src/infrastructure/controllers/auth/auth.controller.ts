import {
  Body,
  Controller,
  Get,
  Inject,
  ParseIntPipe,
  Post,
  Query,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthUseCasesProxyModule } from '../../usecases-proxy/auth-use-cases-proxy.module';
import { UseCaseProxy } from '../../usecases-proxy/usecase-proxy';
import { SignUpRequestDto } from './dtos/sign-up-request.dto';
import { UserMapper } from '../../mappers/user.mapper';
import { SignInRequestDto } from './dtos/sign-in-request.dto';
import { JwtAuthenticationGuard } from '../../authentication/guards/jwt-authentication.guard';
import { Response } from 'express';
import IRequestWithUser from '../../../domain/authentication/request-with-user.interface';
import { SignInUseCase } from '../../../usecases/auth/sign-in/sign-in.use-case';
import { SignUpUseCase } from '../../../usecases/auth/sing-up/sign-up.use-case';
import { SignOutUseCase } from '../../../usecases/auth/sign-out/sign-out.use-case';

@Controller('auth')
export class AuthController {
  constructor(
    @Inject(UserMapper)
    private readonly userMapper: UserMapper,
    @Inject(AuthUseCasesProxyModule.SIGN_IN_USECASE_PROXY)
    private readonly signInUseCaseProxy: UseCaseProxy<SignInUseCase>,
    @Inject(AuthUseCasesProxyModule.SIGN_UP_USECASE_PROXY)
    private readonly signUpUseCaseProxy: UseCaseProxy<SignUpUseCase>,
    @Inject(AuthUseCasesProxyModule.SIGN_OUT_USECASE_PROXY)
    private readonly signOutUseCaseProxy: UseCaseProxy<SignOutUseCase>,
  ) {}

  @Post('signin')
  async signIn(@Body() signInDto: SignInRequestDto, @Res() response: Response) {
    const { email, password } = signInDto;
    const { user, cookie } = await this.signInUseCaseProxy
      .getInstance()
      .execute(email, password);
    response.setHeader('Set-Cookie', cookie);
    return response.send(this.userMapper.fromUserModelToUserPresenter(user));
  }

  @Post('signup')
  async signUp(@Body() signUpDto: SignUpRequestDto) {
    const { email, username, password } = signUpDto;
    const result = await this.signUpUseCaseProxy
      .getInstance()
      .execute(email, username, password);
    return this.userMapper.fromUserModelToUserPresenter(result);
  }

  @UseGuards(JwtAuthenticationGuard)
  @Get()
  async getAuthenticatedUserInfo(@Req() request: IRequestWithUser) {
    const user = request.user;
    return user;
  }

  @UseGuards(JwtAuthenticationGuard)
  @Post('signout')
  async signOut(@Res() response: Response) {
    const cookie = await this.signOutUseCaseProxy.getInstance().execute();
    response.setHeader('Set-Cookie', cookie);
    return response.sendStatus(200);
  }
}
