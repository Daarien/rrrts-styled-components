import React, { useState } from 'react';
import { Container, Button } from 'reactstrap';
import styled, { ThemeProvider } from './styled';
import './style.scss';

const StyledButton = styled('button', { type: 'button', className: 'btn' })`
	display: inline-block;
	background-color: lightcoral;
	width: 240px;
`;

const StyledComponent = styled(Button)`
	color: white;
	background-color: darkcyan;
	width: 240px;
`;

const StyledComponentWithContext = styled(Button)`
	color: ${({ theme }) => theme.color};
	background-color: ${({ theme }) => theme.bgc};
	width: 240px;
	&:hover {
		color: ${({ theme }) => theme.bgc};
		background-color: ${({ theme }) => theme.color};
	}
`;

const DynamicThemedButton = styled(Button)`
	width: 240px;
	color: ${(theme) => theme.color};
	background-color: ${({ theme }) => theme.bgc};
`;

const themes = {
	'blue': {
		color: 'white',
		bgc: 'blue',
	},
	'purple': {
		color: 'white',
		bgc: 'purple',
	}
}

function App() {
	const [theme, changeTheme] = useState('blue');
	const handleToggleTheme = () => {
		if (theme === 'blue')
			changeTheme('purple');
		else
			changeTheme('blue');
	}

	return <Container>
		<div className='block-of-components'>
			<div>
				<StyledButton>
					Styled Button
				</StyledButton>
			</div>
			<div>
				<StyledComponent variant='primary'>
					Styled Button Component
				</StyledComponent>
			</div>
			<div>
				<ThemeProvider theme={{ color: 'white', bgc: 'navy' }}>
					<StyledComponentWithContext>Styled With Theme</StyledComponentWithContext>
				</ThemeProvider>
			</div>
			<div>
				<ThemeProvider theme={themes[theme]} name={theme}>
					<DynamicThemedButton variant='primary' onClick={handleToggleTheme}>
						DynoThemedButton ({theme})
					</DynamicThemedButton>
				</ThemeProvider>
			</div>
		</div>
	</Container>;
}

export default App;