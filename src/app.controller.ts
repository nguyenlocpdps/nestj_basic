import { Controller } from '@nestjs/common';
import { AuthService } from './auth/auth.service';

@Controller() //consumer
export class AppController {
  constructor(private authService: AuthService) { }

}
