/* eslint-disable @typescript-eslint/no-unsafe-function-type */

// pg-constraint.decorator.ts
import { BadRequestException } from '@nestjs/common';
import 'reflect-metadata';
import { POST_LANGUAGE_AND_TITLE_MUST_BE_UNIQUE } from '../../../infrastructure/shared/constants';

const constraintToErrorMessageMap = new Map([
  ['posts_language_title_unique', POST_LANGUAGE_AND_TITLE_MUST_BE_UNIQUE],
]);

export function MapDbConstraintErrors(): MethodDecorator {
  return (target, propertyKey, descriptor: PropertyDescriptor) => {
    const originalMethod = descriptor.value as Function;

    const wrappedMethod = async function (...args: any[]) {
      try {
        return await originalMethod.apply(this, args);
      } catch (err: any) {
        if ('constraint' in err && err.constraint) {
          const errorMessage = constraintToErrorMessageMap.get(err.constraint);
          if (errorMessage) {
            throw new BadRequestException(errorMessage);
          }

          throw new Error('unknown constraint was thrown', { cause: err });
        }

        throw err;
      }
    };

    const metadataKeys = Reflect.getOwnMetadataKeys(originalMethod);
    for (const key of metadataKeys) {
      const meta = Reflect.getOwnMetadata(key, originalMethod);
      Reflect.defineMetadata(key, meta, wrappedMethod);
    }

    descriptor.value = wrappedMethod;
  };
}
