import { FC } from 'react';
import styled from 'styled-components';

type PropsType = {
	field: string[][];
};

const Field: FC<PropsType> = ({ field }) => {
	return (
		<Root className='field-wrapper'>
			{field.map((row, index) => (
				<div key={index} className='field-row'>
					{row.map((item, ind) => (
						<div
							key={(index + 1) * (ind + 1)}
							className={item ? 'field-item not-empty' : 'field-item'}
						>
							{item}
						</div>
					))}
				</div>
			))}
		</Root>
	);
};

const Root = styled.div`
	display: flex;
	align-self: center;
	flex-direction: column;
	padding: 40px 0;

	.field-row {
		display: inline-flex;

		.not-empty {
			border-color: #565758 !important;
		}

		.field-item {
			width: 60px;
			height: 60px;
			background: #121213;
			margin: 2px;
			border: 2px solid #3a3a3a;
			justify-content: center;
			align-items: center;
			display: flex;
			font-size: 24px;
			font-weight: bold;
			user-select: none;
		}
	}
`;

export default Field;
