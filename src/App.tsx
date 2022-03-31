import EqualizerIcon from '@mui/icons-material/Equalizer';
import SettingsIcon from '@mui/icons-material/Settings';
import {
	Button,
	Checkbox,
	Dialog,
	DialogActions,
	DialogContent,
	DialogContentText,
	DialogTitle,
	List,
	ListItem,
	SvgIcon,
} from '@mui/material';
import useAxios from 'axios-hooks';
import produce from 'immer';
import * as moment from 'moment';
import React, { FC, useCallback, useEffect, useState } from 'react';
import styled from 'styled-components';

import Field from './app/field';
import Keyboard from './app/keyboard';
import { ALL_WORDS, EVERYDAY_WORDS } from './data';

interface Statistics {
	played: number;
	won: number;
}

interface BoardState {
	date: string;
	state: string[][];
}

const App: FC = () => {
	const now = moment().format('DD.MM.YYYY');
	const [field, setField] = useState([
		['', '', '', '', ''],
		['', '', '', '', ''],
		['', '', '', '', ''],
		['', '', '', '', ''],
		['', '', '', '', ''],
		['', '', '', '', ''],
	]);
	const [active, setActive] = useState(0);
	const [blockInput, setBlockInput] = useState(false);
	const [notFoundKeys, setNotFoundKeys] = useState<Set<string>>(new Set());
	const [openStats, setOpenStats] = useState(false);
	const [openSettings, setOpenSettings] = useState(false);
	const [hardMode, setHardMode] = useState(false);
	const [winGame, setWinGame] = useState<boolean | null>(null);

	const handleClickOpen = () => {
		setOpenStats(true);
	};

	const handleClose = () => {
		setOpenStats(false);
	};

	const handleOpenSettings = () => {
		setOpenSettings(true);
	};

	const handleCloseSettings = () => {
		setOpenSettings(false);
	};

	const updateStateToLocalStorage = useCallback(() => {
		const boardState = localStorage.getItem('boardState');
		let parsedState = JSON.parse(boardState ?? JSON.stringify([])) as BoardState[];
		const nowBoardState = parsedState.find((item) => item.date === now);
		if (nowBoardState) {
			parsedState = parsedState.map((item) => {
				if (item.date === now) {
					item.state = field;
				}
				return item;
			});
		} else {
			parsedState.push({ date: now, state: field });
		}
		localStorage.setItem('boardState', JSON.stringify(parsedState));
		localStorage.setItem('hardMode', JSON.stringify(hardMode));
	}, [field, hardMode, now]);

	const updateStatisticsToLocalStorage = useCallback((win: boolean) => {
		//check date before add
		const statistics = localStorage.getItem('statistics');
		const { played, won } = JSON.parse(
			statistics ?? JSON.stringify({ played: 0, won: 0 }),
		) as Statistics;
		localStorage.setItem(
			'statistics',
			JSON.stringify({
				played: played + 1,
				won: win ? won + 1 : won,
			}),
		);
	}, []);

	const getLocalstorageStatistics = () => {
		const statistics = localStorage.getItem('statistics');
		return JSON.parse(statistics ?? JSON.stringify({ played: 0, won: 0 })) as Statistics;
	};

	const getRandomWordleWord = () => {
		const dateDiff = moment('19.06.2021', 'DD.MM.YYYY')
			.startOf('day')
			.diff(moment().startOf('day'));
		return Math.abs(Math.round(dateDiff / 864e5));
	};

	const handleBackspace = useCallback(() => {
		if (blockInput) return;
		setField((oldField) => {
			const notEmptyIndex = oldField[active].join('').length;
			return produce(oldField, (draft) => {
				draft[active][notEmptyIndex - 1] = '';
			});
		});
	}, [active, blockInput]);

	const handleSymbol = useCallback(
		(key: string) => {
			if (blockInput) return;
			setField((oldField) => {
				return produce(oldField, (draft) => {
					const emptyIndex = draft[active].findIndex((value) => value === '');
					if (emptyIndex !== -1) {
						draft[active][emptyIndex] = key;
					}
				});
			});
		},
		[active, blockInput],
	);

	const handleEnter = useCallback(() => {
		if (blockInput) return;
		const newWord = EVERYDAY_WORDS[getRandomWordleWord()];
		console.log(newWord);
		const getRowByWord = (word: string): Element | undefined => {
			return [...document.querySelectorAll('.field-row')].find(
				(row) =>
					word === (row as HTMLDivElement).innerText.split('\n').join('').toLowerCase(),
			);
		};

		const processWord = (word: string) => {
			const processedArr = word.split('').map((symb, index) => {
				return {
					positionMatch: newWord[index] === symb,
					exists: newWord.indexOf(symb) > -1,
				};
			});
			const wordRow = getRowByWord(word);
			let timeout = 0;
			if (wordRow) {
				[...wordRow.children].forEach((child, index) => {
					const wordElement = child as HTMLDivElement;
					setTimeout(() => {
						wordElement.classList.add('my-animation');
						if (processedArr[index].positionMatch) {
							wordElement.classList.add('correct-symbol');
						} else {
							wordElement.classList.remove('correct-symbol');
						}
						if (processedArr[index].exists) {
							wordElement.classList.add('existing-symbol');
						} else {
							wordElement.classList.remove('existing-symbol');
						}
						if (!processedArr[index].exists && !processedArr[index].positionMatch) {
							wordElement.classList.add('not-found-symbol');
							setNotFoundKeys((oldNotFoundKeys) => {
								return produce(oldNotFoundKeys, (draft) => {
									draft.add(word[index].toUpperCase());
								});
							});
						} else {
							wordElement.classList.remove('not-found-symbol');
						}
					}, timeout);
					timeout += 350;
				});
			}
		};

		const setRowInvalid = (word: string, invalid: boolean) => {
			const rowWithWord = getRowByWord(word);
			if (!rowWithWord) return;
			if (invalid) {
				rowWithWord.classList.remove('invalid-row');
				setTimeout(() => {
					rowWithWord.classList.add('invalid-row');
				}, 50);
			} else {
				rowWithWord.classList.remove('invalid-row');
			}
			return rowWithWord;
		};
		if (active === 6) return;
		const word1 = field[active].join('').toLowerCase();
		// last word
		if (active === 5 && (ALL_WORDS.includes(word1) || EVERYDAY_WORDS.includes(word1))) {
			updateStatisticsToLocalStorage(false);
			setWinGame(false);
			setBlockInput(true);
			setTimeout(() => {
				handleClickOpen();
			}, 2200);
		}
		// win
		if (word1 === newWord) {
			updateStatisticsToLocalStorage(true);
			setWinGame(true);
			setBlockInput(true);
			setTimeout(() => {
				handleClickOpen();
			}, 2200);
		}
		if (ALL_WORDS.includes(word1) || EVERYDAY_WORDS.includes(word1)) {
			setActive(active + 1);
			setRowInvalid(word1, false);
			processWord(word1);
			updateStateToLocalStorage();
		} else {
			setRowInvalid(word1, true);
		}
		setField((actualField) => {
			const word = actualField[active].join('').toLowerCase();
			// word already exists
			if (
				field.map((row) => row.join('').toLowerCase()).filter((row) => row === word)
					.length > 1
			) {
				setRowInvalid(word, true);
				return actualField;
			}
			// not enough length
			if (word.length !== 5) {
				return actualField;
			}
			return actualField;
		});
	}, [blockInput, active, field, updateStateToLocalStorage, updateStatisticsToLocalStorage]);

	useEffect(() => {
		const boardState = localStorage.getItem('boardState');
		const parsedState = JSON.parse(boardState ?? JSON.stringify([])) as BoardState[];
		const nowBoardState = parsedState.find((item) => item.date === now);

		const newWord = EVERYDAY_WORDS[getRandomWordleWord()];
		console.log(newWord, new Date());

		if (nowBoardState) {
			setField(nowBoardState.state);
			nowBoardState.state = nowBoardState.state.filter((row) => row.join('') !== '');
			let index = 0;
			const interval = setInterval(() => {
				window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
				index += 1;
				if (index === nowBoardState.state.length) clearInterval(interval);
			}, 50 * 5);
		}
	}, [now]);

	useEffect(() => {
		const handleKeyDownEvent = (event: KeyboardEvent) => {
			if (active === 6) return;
			if (/\b[a-zA-Z]\b/.test(event.key)) {
				const key = event.key.toUpperCase();
				if (!notFoundKeys.has(key) || !hardMode) {
					handleSymbol(key);
				}
			} else if (event.key === 'Backspace') {
				handleBackspace();
			} else if (event.key === 'Enter') {
				handleEnter();
			}
		};
		window.addEventListener('keydown', handleKeyDownEvent);
		return () => {
			window.removeEventListener('keydown', handleKeyDownEvent);
		};
	}, [handleSymbol, handleBackspace, handleEnter, notFoundKeys, hardMode, active]);

	return (
		<Root>
			<div className='header'>
				<div className='title'>Всратый Wordle</div>
				<div className='links'>
					<div className='result'>
						<SvgIcon
							component={EqualizerIcon}
							type='button'
							className='button-icon'
							onClick={handleClickOpen}
						/>
					</div>
					<div className='settings'>
						<SvgIcon
							component={SettingsIcon}
							type='button'
							className='button-icon'
							onClick={handleOpenSettings}
						/>
					</div>
				</div>
			</div>
			<Wrapper>
				<Field field={field} />
				<div className='fill-remaining-space' />
				<Keyboard
					handleSymbol={handleSymbol}
					handleEnter={handleEnter}
					handleBackspace={handleBackspace}
					notFoundKeys={notFoundKeys}
					hardMode={hardMode}
				/>
				<Dialog open={openStats} onClose={handleClose} className='win-dialog dialog'>
					<DialogTitle>
						{winGame !== null ? (winGame ? 'Харош' : 'Луз') : 'Статистика'}
					</DialogTitle>
					<DialogContent>
						<DialogContentText>
							Всего игр: {getLocalstorageStatistics().played}
						</DialogContentText>
						<DialogContentText>
							Побед: {getLocalstorageStatistics().won}
						</DialogContentText>
						<DialogContentText>
							Winrate:{' '}
							{Math.round(
								(getLocalstorageStatistics().won /
									getLocalstorageStatistics().played) *
									100,
							)}{' '}
							%
						</DialogContentText>
					</DialogContent>
					<DialogActions>
						<Button onClick={handleClose}>Close</Button>
					</DialogActions>
				</Dialog>
				<Dialog
					open={openSettings}
					onClose={handleCloseSettings}
					className='settings-dialog dialog'
				>
					<DialogTitle>Settings</DialogTitle>
					<DialogContent>
						<List>
							<ListItem>
								<DialogContentText>Hard mode</DialogContentText>
								<Checkbox
									checked={hardMode}
									onChange={(event) => {
										setHardMode(event.target.checked);
									}}
								/>
							</ListItem>
							<ListItem>
								<DialogContentText>Dark mode</DialogContentText>
								<Checkbox />
							</ListItem>
						</List>
					</DialogContent>
					<DialogActions>
						<Button onClick={handleCloseSettings}>Close</Button>
					</DialogActions>
				</Dialog>
			</Wrapper>
		</Root>
	);
};

const Root = styled.div`
	height: 100%;

	.header {
		height: 70px;
		display: flex;
		justify-content: center;
		align-items: center;
		font-size: 36px;
		border-bottom: 1px solid #3a3a3a;
		font-weight: bold;
		.title {
			flex: 1 1;
			justify-content: center;
			display: flex;
			padding-left: 80px;
		}
		.links {
			display: flex;
			width: 65px;
			padding-right: 15px;
			justify-content: space-between;
			align-items: center;
			.button-icon:hover {
				cursor: pointer;
				transform: scale(1.1);
			}
		}
	}
`;
const Wrapper = styled.div`
	display: flex;
	flex-direction: column;
	height: calc(100% - 71px);
	.win-dialog .MuiPaper-root {
		border-radius: 8px;
		border: 1px solid #1a1a1a;
		background-color: #121213;
		color: white;
		box-shadow: 0 4px 23px 0 rgb(0 0 0 / 20%);
	}
	.fill-remaining-space {
		flex-grow: 1;
	}
	.invalid-row {
		animation-name: Shake;
		animation-duration: 600ms;
	}
	.win {
		animation-name: Bounce;
		animation-duration: 1000ms;
	}

	.field-row .existing-symbol {
		background: #b59f3b;
	}
	.field-row .not-found-symbol {
		background: #3a3a3c;
	}
	.field-row .correct-symbol {
		background: #538d4e;
	}
	@keyframes Bounce {
		0%,
		20% {
			transform: translateY(0);
		}
		40% {
			transform: translateY(-30px);
		}
		50% {
			transform: translateY(5px);
		}
		60% {
			transform: translateY(-15px);
		}
		80% {
			transform: translateY(2px);
		}
		100% {
			transform: translateY(0);
		}
	}

	@keyframes Shake {
		10%,
		90% {
			transform: translateX(-1px);
		}

		20%,
		80% {
			transform: translateX(2px);
		}

		30%,
		50%,
		70% {
			transform: translateX(-4px);
		}

		40%,
		60% {
			transform: translateX(4px);
		}
	}
	.my-animation {
		animation-name: CardAnimation;
		animation-duration: 600ms;
		animation-timing-function: ease-in;
		transition: background-color 1s ease;
	}
	@keyframes CardAnimation {
		0% {
			transform: scale(0.8);
			opacity: 0;
			background: #121213 !important;
		}

		9% {
			transform: scale(1.1);
			opacity: 1;
			background: #121213 !important;
		}
		10% {
			transform: rotateX(0);
			background: #121213 !important;
		}
		55% {
			transform: rotateX(-90deg);
			background: #121213 !important;
		}
		56% {
			transform: rotateX(-90deg);
			background: #121213 !important;
		}
		100% {
			transform: rotateX(0);
		}
	}
	.flip-out {
		animation-name: FlipOut;
		animation-duration: 250ms;
		animation-timing-function: ease-in;
	}
	@keyframes FlipOut {
		0% {
			transform: rotateX(-90deg);
		}
		100% {
			transform: rotateX(0);
		}
	}
`;

export default App;
