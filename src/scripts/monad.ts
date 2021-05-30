type Then<M, T> = (value: T) => M;

interface Monad<T> {
  bind(then: Then<this, T>): this;
  pure(value: T): this;
}

export type {Monad, Then};
