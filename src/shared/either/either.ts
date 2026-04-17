export enum EitherTag {
  Left = 'Left',
  Right = 'Right',
}

export type Left<L> = { readonly _tag: EitherTag.Left; readonly value: L };
export type Right<R> = { readonly _tag: EitherTag.Right; readonly value: R };
export type Either<L, R> = Left<L> | Right<R>;

export const left = <L, R = never>(value: L): Either<L, R> => ({
  _tag: EitherTag.Left,
  value,
});

export const right = <R, L = never>(value: R): Either<L, R> => ({
  _tag: EitherTag.Right,
  value,
});

export const isLeft = <L, R>(e: Either<L, R>): e is Left<L> =>
  e._tag === EitherTag.Left;

export const isRight = <L, R>(e: Either<L, R>): e is Right<R> =>
  e._tag === EitherTag.Right;
