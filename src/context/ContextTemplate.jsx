import { createContext, useReducer } from "react";
import Reducer, { ACTIONS, initialState } from "../reducer/ReducerTemplate";

const Context = createContext(initialState);

export const ContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(Reducer, initialState);

  const function1 = () => {
    dispatch({
      type: ACTIONS.ACTION1,
    });
  };

  const function2 = () => {
    dispatch({
      type: ACTIONS.ACTION2,
    });
  };

  const value = {
    state,
    function1,
    function2,
  };

  return <Context.Provider value={value}>{children}</Context.Provider>;
};

export default Context;
