import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppShell } from '@mantine/core';
import { Navbar } from '../components/Navbar';
import { routes } from './utils';

export const Router = () => {
    return (
        <BrowserRouter>
            <AppShell
                p='md'
                navbar={{
                    width: 300,
                    breakpoint: 'sm',
                    collapsed: { mobile: false },
                }}
            >
                <AppShell.Navbar>
                    <Navbar />
                </AppShell.Navbar>
                <AppShell.Main>
                    <Routes>
                        {routes.map((route) => (
                            <Route
                                path={route.url}
                                key={route.url}
                                element={route.component}
                            />
                        ))}
                    </Routes>
                </AppShell.Main>
            </AppShell>
        </BrowserRouter>
    );
};
