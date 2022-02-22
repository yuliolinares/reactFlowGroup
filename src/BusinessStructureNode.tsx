import React, { useCallback, useMemo } from 'react';
import {
	Handle,
	Node,
	NodeProps,
	Position,
	useStoreActions,
	useStoreState,
} from 'react-flow-renderer';
import { useDebounce } from 'react-use';
import { useRecoilValue } from 'recoil';
import { useFlowNodeData } from './hooks';
import { nodeStateFamily } from './store';

const getIcon = (icon: 'circle' | 'triangle') => {
	switch (icon) {
		case 'triangle':
			return (
				<svg viewBox="0 0 24 24" width={24} height={24}>
					<path
						d="M 12,1 L 1,21 L 23,21 z"
						fill="#aaa"
						strokeWidth={1}
						stroke="#434343"
					/>
				</svg>
			);
		default:
			return (
				<svg viewBox="0 0 24 24" width={24} height={24}>
					<circle cx={12} cy={12} r={11} fill="darkblue" />
				</svg>
			);
	}
};

const getGroupBounds = (nodes?: Node[]) => {
	if (!nodes) return {};
	const top: number[] = [];
	const right: number[] = [];
	const bottom: number[] = [];
	const left: number[] = [];

	nodes?.forEach((node) => {
		top.push(node.__rf.position.y);
		right.push(node.__rf.position.x + node.__rf.width);
		bottom.push(node.__rf.position.y + node.__rf.height);
		left.push(node.__rf.position.x);
	});

	return {
		top: Math.min(...top),
		right: Math.max(...right),
		bottom: Math.max(...bottom),
		left: Math.min(...left),
	};
};

const NodeContent: React.FC<{
	id: string;
	icon: 'circle' | 'triangle';
	label?: string;
}> = ({ id, icon, label }) => {
	const state = useRecoilValue(nodeStateFamily(id));

	return (
		<div>
			{getIcon(icon)}
			<div>{id}</div>
			<div>{state?.value}</div>
		</div>
	);
};

export const BusinessStructureNodeDimensions = Object.freeze({
	width: 100,
	height: 70,
});

export interface BusinessStructureNodeProps extends NodeProps {
	data: {
		label?: string;
		direction?: 'h' | 'v';
		icon?: 'circle' | 'triangle';
		parentId?: string;
	};
}

export default (props: BusinessStructureNodeProps) => {
	const { id, data } = props;
	const { label, direction = 'h', icon = 'circle', parentId } = data ?? {};
	const positions =
		direction === 'h'
			? [Position.Left, Position.Right]
			: [Position.Top, Position.Bottom];

	const stylePositionTarget = direction === 'h' ? { left: 0 } : { top: 0 };
	const stylePositionSource = direction === 'h' ? { right: 0 } : { bottom: 0 };

	const updateNodePos = useStoreActions((actions) => actions.updateNodePos);

	const nodes = useStoreState<Node[]>((state) => state.nodes);

	const parentNode = useMemo(() => {
		if (!parentId) return;
		return nodes.find((n) => n.id === parentId);
	}, [nodes, parentId]);

	const siblingNodes = useMemo(() => {
		const siblingNodes = [] as Node[];

		if (parentNode) {
			for (let i = 0; i < nodes.length; i++) {
				if (parentNode.data.children.includes(nodes[i].id))
					siblingNodes.push(nodes[i]);
				if (siblingNodes.length === parentNode?.data?.children.length) break;
			}
		}

		return siblingNodes;
	}, [nodes, parentNode]);

	const { isDragging } = useFlowNodeData(id);

	React.useEffect(() => {
		if (!isDragging || !parentNode) return;

		// TODO: Use config
		const margin = 10;

		// Update group size
		const groupBounds = getGroupBounds(siblingNodes);
		if (!groupBounds) return;

		if (groupBounds.left === undefined || groupBounds.right === undefined)
			return;
		const parentElement = document.getElementById(`groupNode-${parentNode.id}`);
		if (!parentElement) return;

		parentElement.style.width = `${
			groupBounds.right - groupBounds.left + margin * 2
		}px`;

		updateNodePos({
			id: parentNode.id,
			pos: {
				x: groupBounds.left - margin,
				y: groupBounds.top - margin,
			},
		});
	}, [isDragging, siblingNodes, parentNode, updateNodePos]);

	return (
		<>
			<Handle
				type="target"
				position={positions[0]}
				style={{ background: 'transparent', border: 0, ...stylePositionTarget }}
			/>
			<div
				style={{
					...BusinessStructureNodeDimensions,
					textAlign: 'center',
					fontSize: 12,
					padding: 5,
					boxSizing: 'border-box',
					border: '1px solid #ccc',
					borderRadius: 4,
				}}
			>
				<NodeContent id={id} label={label} icon={icon} />
			</div>
			<Handle
				type="source"
				position={positions[1]}
				style={{ background: 'transparent', border: 0, ...stylePositionSource }}
			/>
			<Handle
				id="parent"
				type="source"
				position={Position.Bottom}
				style={{ background: 'transparent', border: 0, bottom: 0 }}
			/>
		</>
	);
};
