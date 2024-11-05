export class CreateUserDto {
  readonly firstname: string;
  readonly lastname: string;
  readonly email: string;
  readonly password: string;
  readonly role: string;
  readonly is_active: boolean;
}
