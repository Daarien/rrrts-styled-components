import React, { useContext, FunctionComponent, ComponentClass, ReactNode, Context, Ref } from 'react';
import stylis from 'stylis';
import { ThemeContext } from './ThemeProvider';

type f = ({ }: any) => string;
type Arg = string | f;
type ElementType = string | FunctionComponent | ComponentClass;
type Props = {
	className?: string;
	children?: ReactNode;
	ref: Ref<{}>
}

type Styled = (Component: ElementType, attrs?: Record<string, any>, context?: Context<{ theme: {}, name: string }>)
	=> (strings: TemplateStringsArray, ...keys: Arg[])
		=> any;

const styled: Styled = (Component, attrs, context) => (strings, ...keys) => {
	let type = '';
	switch (typeof Component) {
		case 'string': type = Component; break;
		case 'function': type = 'comp'; break;
		default: return null;
	}

	let str = '';
	let shallWeUseContext = false;
	if (keys.some(key => typeof key === 'function'))
		shallWeUseContext = true;

	return React.forwardRef(({ className, ...otherProps }: Props, ref) => {
		if (shallWeUseContext) {
			const themeContext = context ? useContext(context) : useContext(ThemeContext);
			const overallProps = Object.assign({}, { theme: themeContext.theme, themeName: themeContext.name }, otherProps);
			str = keys.reduce((accum: string, cur: Arg, i: number) => accum + inject(cur, overallProps) + strings[i + 1], strings[0]);
		} else {
			str = keys.reduce((accum: string, cur: Arg, i: number) => accum + cur + strings[i + 1], strings[0]);
		}

		const selector = `styled-${type}-${hash()}`;
		const rule = stylis(`.${selector}`, str);

		const style = document.createElement('style');
		style.setAttribute('type', 'text/css');
		style.innerHTML = rule;
		document.head.appendChild(style);

		let fullClassName = '';
		let attrsProps = {};
		if (attrs) {
			const { className, ...otherAttrs } = attrs;
			// className from attrs
			if (className && typeof className === 'string')
				fullClassName += className + ' ';
			Object.assign(attrsProps, otherAttrs);
		}
		// className from props
		if (className) {
			fullClassName += className + ' ';
		}
		fullClassName += selector;

		const newProps = Object.assign({}, attrsProps, otherProps, { className: fullClassName });

		return <Component ref={ref} {...newProps} />;
	});
}

export default styled;

function hash() {
	function s4() {
		return Math.floor((1 + Math.random()) * 0x10000)
			.toString(16)
			.substring(1);
	}
	return s4() + '-' + s4();
}

function inject(value: Arg, props: {}) {
	if (typeof value === 'string')
		return value;
	if (typeof value === 'function')
		return value(props);
	return '';
}