import { Router } from './routes';
import { Provider, createStore } from 'jotai';

const store = createStore();

export const App = () => {
    return (
        <Provider store={store}>
            <Router />
        </Provider>
    );
};
