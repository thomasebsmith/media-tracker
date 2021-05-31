type Then<M, T> = (value: T) => M;

interface Monad<T> {
  bind<U, N extends Monad<U>>(then: Then<N, T>): N;
  pure(value: T): this;
}

export type {Monad, Then};
