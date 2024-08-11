import {
  type PropsWithChildren,
  type RefObject,
  createContext,
  useContext,
} from "react";

interface IAppCtx {
  overflowContainerRef: RefObject<HTMLElement>;
  textMeasurerRef: RefObject<HTMLDivElement>;
}

export const AppCtx = createContext<IAppCtx | null>(null);

type IProps = PropsWithChildren<IAppCtx>;

export const AppCtxProvider = ({
  overflowContainerRef,
  textMeasurerRef,
  children,
}: IProps) => {
  return (
    <AppCtx.Provider value={{ overflowContainerRef, textMeasurerRef }}>
      {children}
    </AppCtx.Provider>
  );
};

export const useAppCtx = () => {
  const ctx = useContext(AppCtx);
  if (!ctx) {
    throw Error("useAppCtx: AppCtx is undefined!");
  }
  return ctx;
};
