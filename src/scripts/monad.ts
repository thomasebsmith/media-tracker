type Then<T, U> = (value: T) => Monad<U>;

interface Monad<T> {
  // Applies `then` to the value(s) "inside" the monad. This should return the
  //  same kind of monad as it is called on, possibly with a different type
  //  parameter.
  bind<U>(then: Then<T, U>): Monad<U>;

  // Creates a monad of this type containing `value`.
  pure(value: T): Monad<T>;
}

export type {Monad, Then};
