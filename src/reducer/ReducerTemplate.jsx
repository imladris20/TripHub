export const initialState = {
  key1: value1,
  key2: value2,
};

export const ACTIONS = {
  ACTION1: "ACTION1",
  ACTION2: "ACTION2",
};

const Reducer = (state, action) => {
  const { type, payload } = action;
  const { key1, key2 } = state;

  switch (type) {
    case ACTIONS.ACTION1:
      return {
        ...state,
      };
    case ACTIONS.ACTION2:
      return {
        ...state,
      };
    default:
      return state;
  }
};

export default Reducer;
