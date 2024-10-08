import { configureStore } from '@reduxjs/toolkit';
import { persistReducer, persistStore } from 'redux-persist';
import { thunk } from 'redux-thunk';
import storage from 'redux-persist/lib/storage';
import rootReducer from './index';

const persistConfig = { key: 'root', storage: storage };

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store: any = configureStore({
    reducer: persistedReducer,
    devTools: process.env.NODE_ENV !== 'production',
    middleware: (): any => [thunk]
});

export const persistor = persistStore(store);
