import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
	Node,
	Handle,
	Position,
	useStoreState,
	useStoreActions,
	NodeProps,
} from 'react-flow-renderer';
import { useMeasure, usePrevious } from 'react-use';
import { useFlowNodeData } from './hooks';

const GroupNode: React.FC<NodeProps> = (props: any) => {
	const { id, data } = props;
	const { children } = data ?? {};

	const nodes = useStoreState((state) => state.nodes);
	const updateNodePosDiff = useStoreActions(
		(actions) => actions.updateNodePosDiff
	);

	const { position, isDragging } = useFlowNodeData(id);
	const { x: currentX = 0, y: currentY = 0 } = position;

	const previousX = usePrevious(currentX) ?? 0;
	const previousY = usePrevious(currentY) ?? 0;

	const childNodes = useMemo<Node[]>(() => {
		const childNodes = [] as Node[];

		for (let i = 0; i < nodes.length; i++) {
			if (children.includes(nodes[i].id)) childNodes.push(nodes[i]);
			if (childNodes.length === children.length) break;
		}

		return childNodes;
	}, [nodes.length, children.length]);

	useEffect(() => {
		const shiftX = currentX - (previousX ?? 0);
		const shiftY = currentY - (previousY ?? 0);
		if (!isDragging || !childNodes?.length || !(shiftX || shiftY)) return;

		childNodes.forEach((node) => {
			const relativeX = node.position.x - previousX;
			const relativeY = node.position.y - previousY;
			const updatedAbsoluteX = currentX + relativeX;
			const updatedAbsoluteY = currentY + relativeY;
			const diffX = updatedAbsoluteX - node.position.x;
			const diffY = updatedAbsoluteY - node.position.y;

			updateNodePosDiff({
				id: node.id,
				diff: {
					x: diffX,
					y: diffY,
				},
				isDragging: false,
			});
		});
	}, [
		isDragging,
		childNodes,
		previousX,
		previousY,
		currentX,
		currentY,
		updateNodePosDiff,
	]);

	return (
		<div
			id={`groupNode-${id}`}
			style={{
				height: 10,
				width: props.data?.width ?? 100,
				border: '1px solid #979797',
				borderBottom: 'none',
			}}
		>
			<Handle
				type="source"
				position={Position.Top}
				style={{ background: 'transparent', border: 0, top: 0 }}
			/>
		</div>
	);
};

export default GroupNode;
