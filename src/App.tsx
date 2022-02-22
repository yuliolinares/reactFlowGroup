import * as React from 'react';
import './styles.css';
import Diagram from './Diagram';
import DisplayValueUpdater from './DisplayValueUpdater';
import { RecoilRoot } from 'recoil';

export default function App() {
	return (
		<RecoilRoot>
			<div className="diagram-container">
				<Diagram />
				<DisplayValueUpdater />
			</div>
		</RecoilRoot>
	);
}
