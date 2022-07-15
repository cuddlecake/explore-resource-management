import { TypedAction } from '@ngrx/store/src/models';
import { NotAllowedCheck, Store } from '@ngrx/store';
import { inject } from '@angular/core';

type InjectActionProp<P extends object> = (
  props: P & NotAllowedCheck<P>
) => TypedAction<string>;
type InjectEmptyActionProp = () => TypedAction<string>;
export const injectAction = <P extends object>(action: InjectActionProp<P>) => {
  const store = inject(Store);
  return (props: P & NotAllowedCheck<P>) => store.dispatch(action(props));
};
export const injectEmptyAction = (action: InjectEmptyActionProp) => {
  const store = inject(Store);
  return () => store.dispatch(action());
};
