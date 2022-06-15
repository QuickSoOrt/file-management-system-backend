export interface IJwtConfigInterface {
  getJwtSecret(): string;
  getJwtExpirationTime(): string;
}
