type ValidationRule<T = any> = (value: T) => string | null;
type ValidationSchema<T extends Record<string, any>> = {
  [K in keyof T]?: ValidationRule<T[K]>;
};

export class Validator<T extends Record<string, any>> {
  private errors: Record<keyof T, string | null> = {} as Record<keyof T, string | null>;
  private schema: ValidationSchema<T>;
  private data: T;

  constructor(data: T, schema: ValidationSchema<T>) {
    this.schema = schema;
    this.data = data;
    this.validateAll();
  }

  private validateAll() {
    for (const [field, rule] of Object.entries(this.schema) as [keyof T, ValidationRule][]) {
      this.errors[field] = rule(this.data[field]);
    }
  }

  public hasErrors(): boolean {
    return Object.values(this.errors).some(error => error !== null);
  }

  public getFirstError(): string | null {
    for (const error of Object.values(this.errors)) {
      if (error) return error;
    }
    return null;
  }

  public getAllErrors(): Record<keyof T, string | null> {
    return this.errors;
  }
}

export const required = (fieldName: string) => 
  (value: any) => !value ? `${fieldName} is required` : null;

export const minLength = (fieldName: string, min: number) => 
  (value: string) => value && value.length < min ? `${fieldName} should be at least ${min} characters` : null;

export const email = () => (value: string) => 
  !value ? "Email is required" : 
  !/^\S+@\S+\.\S+$/.test(value) ? "Please enter a valid email address" : null;

export const passwordsMatch = (password1: string, password2: string) => 
  password1 !== password2 ? "Passwords don't match" : null;