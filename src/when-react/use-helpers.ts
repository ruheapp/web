import { getValue, when } from '@whenjs/when';
import { useEffect, useState } from 'react';
import { Observable } from 'rxjs';

export type PropSelector<TIn, TOut> = ((t: TIn) => TOut);

export function useObservable<T>(target: () => Observable<T>, initial: T) {
  const [ret, setter] = useState(initial);
  const [obs] = useState(target());

  useEffect(
    () => {
      const sub = obs.subscribe(setter);
      return sub.unsubscribe.bind(sub);
    },
    [obs]
  );

  return ret;
}

export function useWhen<TSource, TRet>(
  model: TSource,
  prop: PropSelector<TSource, TRet>
): TRet {
  return useObservable(() => when(model, prop), getValue(model, prop).result!);
}
