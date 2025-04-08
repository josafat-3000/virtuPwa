import { configureStore} from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import sesionStorage from 'redux-persist/lib/storage/session';
import userReducer from './userSlice';
import visitsReducer from './visitSlice';
import allVisitReducer from './allVisitSlice';
import registerReducer from './registerSlice';
import createVisitReducer from './createVisitSlice';
import scanReducer from './scanSlice';
import configReducer from './configSlice';
import notificationsReducer from './notificationSlice';
import visitByIdReducer from './singleVisitSlice';
import linkReducer from './visitLinkSlice';
import createFromLinkReducer from './createFromLinkSlice';
const persistConfig = {
  key: 'root',
  storage: sesionStorage,
};

const persistedReducer = persistReducer(persistConfig, userReducer);

const store = configureStore({
  reducer: {
    user: persistedReducer,
    visits: visitsReducer,
    allVisits: allVisitReducer,
    register: registerReducer,
    createVisit: createVisitReducer,
    scan: scanReducer,
    config: configReducer,
    notifications: notificationsReducer,
    visitById: visitByIdReducer,
    link: linkReducer,
    createFromLink: createFromLinkReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
        ignoredPaths: ['register'],
      },
    }),
});

export const persistor = persistStore(store);
export default store;
