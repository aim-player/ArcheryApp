const { createContext, useState, useContext } = require("react");

const Context = createContext();

export const ContextProvider = ({ children }) => {
  const sheets = useState([]);
  const places = useState([]);
  return (
    <Context.Provider value={{ sheets, places }}>{children}</Context.Provider>
  );
};

export const useSheets = () => {
  const context = useContext(Context);
  return context.sheets;
};

export const usePlaces = () => {
  const context = useContext(Context);
  return context.places;
};
