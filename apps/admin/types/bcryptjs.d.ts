declare module "bcryptjs" {
  export function compare(s: string, hash: string): Promise<boolean>;
  export function hash(s: string, salt: number | string): Promise<string>;
  export function genSalt(rounds?: number): Promise<string>;
}
