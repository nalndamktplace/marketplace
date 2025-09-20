import { AnyAction, combineReducers, configureStore } from "@reduxjs/toolkit";
import {
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
  persistReducer,
  persistStore,
} from "redux-persist";

import userManageReducer from "./slice/userManageReducer";
import spinnerManageReducer from "./slice/spinnerManageReducer";
import storage from "redux-persist/lib/storage";

const persistConfig = {
  key: "root",
  storage: storage,
  whitelist: ["userManage"], // specify which slices to persist
};

const combinedReducer = combineReducers({
  userManage: userManageReducer,
  spinnerManage: spinnerManageReducer,
});

const persistedReducer = persistReducer(persistConfig, combinedReducer);

const rootReducer = (
  state: ReturnType<typeof combinedReducer> | undefined,
  action: AnyAction
) => {
  return persistedReducer(state as any, action);
};

const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
