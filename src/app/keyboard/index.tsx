import BackspaceIcon from '@mui/icons-material/Backspace';
import { SvgIcon } from '@mui/material';
import { FC, MouseEvent } from 'react';
import styled from 'styled-components';
import { v4 as uuid } from 'uuid';

type PropsType = {
	handleSymbol: (key: string) => void;
	handleEnter: () => void;
	handleBackspace: () => void;
	notFoundKeys: Set<string>;
	hardMode: boolean;
};

const Keyboard: FC<PropsType> = ({
	handleBackspace,
	handleEnter,
	handleSymbol,
	notFoundKeys,
	hardMode,
}) => {
	const alphabet = ['QWERTYUIOP', 'ASDFGHJKL', 'ZXCVBNM'];

	const handleCLick = (event: MouseEvent<HTMLDivElement>) => {
		const elem = event.target as HTMLDivElement;
		const span = elem.childNodes[0] as HTMLSpanElement;
		if (!notFoundKeys.has(span.innerText) || !hardMode) {
			handleSymbol(span.innerText);
		}
	};

	return (
		<Root>
			<div className='keyboard-wrapper'>
				{alphabet.map((row, i) => (
					<div key={i} className='keyboard-row'>
						{i === 2 && (
							<div className='keyboard-symbol enter-button' onClick={handleEnter}>
								<span>Enter</span>
							</div>
						)}
						{[...row].map((symbol) => {
							return (
								<div
									key={symbol}
									className={
										notFoundKeys.has(symbol.toUpperCase()) && hardMode
											? 'keyboard-symbol keyboard-disabled'
											: 'keyboard-symbol'
									}
									onClick={handleCLick}
								>
									<span>{symbol}</span>
								</div>
							);
						})}
						{i === 2 && (
							<div
								key='backspace'
								className='keyboard-symbol backspace-button'
								onClick={handleBackspace}
							>
								<SvgIcon component={BackspaceIcon} />
							</div>
						)}
					</div>
				))}
			</div>
		</Root>
	);
};

const Root = styled.div`
	display: flex;
	justify-content: center;
	align-self: center;
	padding-bottom: 15px;

	.keyboard-wrapper {
		display: flex;
		flex-wrap: nowrap;
		flex-direction: column;

		.keyboard-row {
			display: flex;
			justify-content: center;

			.enter-button {
				width: 70px !important;
			}

			.backspace-button {
				width: 70px !important;
			}

			.keyboard-symbol {
				width: 43px;
				height: 58px;
				font-size: 14px;
				font-weight: 600;
				background: #818384;
				color: white;
				display: flex;
				margin: 3px 3px;
				justify-content: center;
				align-items: center;
				border-radius: 5px;
				user-select: none;
				cursor: pointer;

				span {
					pointer-events: none;
				}
			}

			.keyboard-disabled {
				background-color: #404040 !important;
				cursor: default;
			}
		}
	}
`;

export default Keyboard;
