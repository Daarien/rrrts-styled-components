import React, { Context, ReactNode } from 'react';

type func<T> = (name: T) => void;

interface IThemeContext {
	theme: Theme;
	name?: string;
	changeTheme?: func<string>;
}

interface ProviderProps extends IThemeContext {
	children: ReactNode;
}

type Theme = {
	theme: Record<string, any>;
}

export const ThemeContext: Context<IThemeContext> = React.createContext({
	theme: {} as Theme
});

export const ThemeProvider = (props: ProviderProps) => {
	const { name, theme, changeTheme, children } = props;
	return <ThemeContext.Provider value={{ name, theme, changeTheme }}>{children}</ThemeContext.Provider>;
};