import { GraphQLError } from 'graphql';

export class CustomError extends Error {
  code: number;
  additionalInfo?: string;

  constructor(message: string, code: number, additionalInfo?: string) {
    super(message);
    this.code = code;
    this.additionalInfo = additionalInfo;
  }
}

export function formatError(error: GraphQLError) {
  if (error.originalError instanceof CustomError) {
    return {
      message: error.message,
      code: error.originalError.code,
      additionalInfo: error.originalError.additionalInfo,
    };
  } else {
    return {
      message: 'Erro interno, tente novamente.',
      code: 500,
      additionalInfo: error.originalError.message,
    };
  }
}
