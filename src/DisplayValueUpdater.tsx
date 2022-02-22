import React, { useRef, useState } from 'react';
import { useSetRecoilState } from 'recoil';
import { nodeValueFamily } from './store';
import './styles.css';

const DisplayValueUpdater: React.FC<{}> = () => {
	const [id, setId] = useState('');
	const setValue = useSetRecoilState(nodeValueFamily(id));

	const inputValueRef = useRef<HTMLInputElement | null>(null);

	const handleClick = () => {
		const value = inputValueRef.current?.value;
		setValue(value);
	};

	return (
		<div className="value-updater">
			<input
				className="value-updater__input"
				placeholder="id"
				onChange={(event) => setId(event.target.value)}
			/>
			<input
				className="value-updater__input"
				ref={inputValueRef}
				placeholder="value"
			/>
			<button className="value-updater__button" onClick={handleClick}>
				Commit
			</button>
		</div>
	);
};

export default DisplayValueUpdater;
