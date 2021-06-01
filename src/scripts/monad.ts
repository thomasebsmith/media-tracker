type Then<T, U> = (value: T) => Monad<U>;

interface Monad<T> {
  bind<U>(then: Then<T, U>): Monad<U>;
  pure(value: T): Monad<T>;
}

export type {Monad, Then};
