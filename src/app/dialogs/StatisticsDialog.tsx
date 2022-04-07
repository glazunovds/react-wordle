import {
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogContentText,
	DialogTitle,
} from '@mui/material';
import * as React from 'react';
import { FC } from 'react';

type PropsType = {
	openStats: boolean;
	handleClose: () => void;
	winGame: boolean | null;
	handleShare: () => void;
	played: number;
	wins: number;
	winrate: string;
};
const StatisticsDialog: FC<PropsType> = ({
	openStats,
	handleClose,
	winGame,
	handleShare,
	played,
	wins,
	winrate,
}) => {
	return (
		<Dialog open={openStats} onClose={handleClose} className='win-dialog dialog'>
			<DialogTitle>
				{winGame !== null ? (winGame ? 'Харош' : 'Луз') : 'Статистика'}
			</DialogTitle>
			<DialogContent>
				<DialogContentText>Всего игр: {played}</DialogContentText>
				<DialogContentText>Побед: {wins}</DialogContentText>
				<DialogContentText>Winrate: {winrate}</DialogContentText>
			</DialogContent>
			<DialogActions>
				<Button onClick={handleShare}>Share</Button>
				<Button onClick={handleClose}>Close</Button>
			</DialogActions>
		</Dialog>
	);
};

export default StatisticsDialog;
