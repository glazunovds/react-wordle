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
} from '@mui/material';
import * as React from 'react';
import { FC } from 'react';

type Props = {
	openSettings: boolean;
	handleCloseSettings: () => void;
	hardMode: boolean;
	setHardMode: (hardMode: boolean) => void;
};
const EndGameDialog: FC<Props> = ({ openSettings, handleCloseSettings, hardMode, setHardMode }) => {
	return (
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
				</List>
			</DialogContent>
			<DialogActions>
				<Button onClick={handleCloseSettings}>Close</Button>
			</DialogActions>
		</Dialog>
	);
};

export default EndGameDialog;
