const { createContext, useState, useContext } = require("react");

const Context = createContext();

export const ContextProvider = ({ children }) => {
  const user = useState();
  const sheets = useState([]);
  const trains = useState([]);
  const ends = useState([]);
  const places = useState([]);
  const popup = useState({ login: false });
  const alert = useState({ active: false, message: "", callbackFn: null });
  const confirm = useState({ active: false, messsage: "", callbackFn: null });
  return (
    <Context.Provider
      value={{ user, sheets, trains, ends, places, popup, alert, confirm }}
    >
      {children}
    </Context.Provider>
  );
};

export const useUser = () => {
  const context = useContext(Context);
  return context.user;
};

export const useSheets = () => {
  const context = useContext(Context);
  return context.sheets;
};

export const useTrains = () => {
  const context = useContext(Context);
  return context.trains;
};

export const useEnds = () => {
  const context = useContext(Context);
  return context.ends;
};

export const usePlaces = () => {
  const context = useContext(Context);
  return context.places;
};

export const usePopup = () => {
  const context = useContext(Context);
  return context.popup;
};

export const useAlert = () => {
  const context = useContext(Context);
  return context.alert;
};

export const useConfirm = () => {
  const context = useContext(Context);
  return context.confirm;
};
