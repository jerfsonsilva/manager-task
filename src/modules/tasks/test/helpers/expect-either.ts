import {
  EitherTag,
  type Either,
  type Left,
  type Right,
} from '@shared/either/either';

export function expectLeft<L, R>(either: Either<L, R>): Left<L> {
  expect(either._tag).toBe(EitherTag.Left);

  return either as Left<L>;
}

export function expectRight<L, R>(either: Either<L, R>): Right<R> {
  expect(either._tag).toBe(EitherTag.Right);

  return either as Right<R>;
}
