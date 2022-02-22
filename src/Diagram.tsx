import React from 'react';
import ReactFlow, {
	Controls,
	Edge,
	FlowElement,
	Node,
} from 'react-flow-renderer';

import GroupNode from './GroupNode';
import BusinessStructureNode from './BusinessStructureNode';

import ELK from 'elkjs/lib/elk-api';
import { useAsync } from 'react-use';
import { graph, ElkNodeExtended, ElkExtendedEdgeExtended } from './graph';
const elk = new ELK({
	workerUrl: './elk-worker.min.js',
});

const mapNodeToFlowElements = (
	node: ElkNodeExtended,
	parentId?: string,
	offset?: { x?: number; y?: number }
): FlowElement[] => {
	const position = {
		x: (node.x ?? 0) + (offset?.x ?? 0),
		y: (node.y ?? 0) + (offset?.y ?? 0),
	};

	const element: Node = {
		data: {},
		id: node.id,
		position,
		...node._temp,
	};
	if (parentId) element.data.parentId = parentId;

	if (node._temp?.type === 'group') {
		// @ts-ignore
		element.data.width = node.width;
		// @ts-ignore
		element.data.children = node.children?.map((child) => child.id);
	}

	const edges =
		node.edges?.reduce((_edges, edge) => {
			const _edge = (edge as unknown) as ElkExtendedEdgeExtended;
			if (_edge._temp?.visible !== false) {
				let sourceId = _edge.sources[0];

				if (_edge._temp?.sourcePortId) {
					sourceId += `__${_edge._temp?.sourcePortId}`;
				}

				_edges.push({
					id: _edge.id,
					source: sourceId,
					target: _edge.targets[0],
				});
			}

			return _edges;
		}, [] as Edge[]) ?? [];

	const children =
		node.children?.flatMap((childNode: ElkNodeExtended) =>
			mapNodeToFlowElements(childNode, node.id, { x: node.x, y: node.y ?? 0 })
		) ?? [];

	if (element.id === 'root') return [...edges, ...children];
	return [element, ...edges, ...children];
};

const layoutChart = async (graph: any): Promise<FlowElement[]> => {
	const layout = await elk.layout(graph, {
		layoutOptions: {
			algorithm: 'layered',
			'elk.direction': 'RIGHT',
			'nodePlacement.bk.fixedAlignment': 'BALANCED',
			considerModelOrder: 'NODES_AND_EDGES',
			edgeRouting: 'SPLINES',
			nodeSpacing: '30',

			// @ts-ignore
			'spacing.baseValue': 30,
		},
	});
	console.log(layout);

	return mapNodeToFlowElements(layout);
};

export default () => {
	// console.log('Render diagram');
	const state = useAsync(async () => await layoutChart(graph));

	const elements = state.value ?? [];

	// console.log('elements', elements);

	return (
		<ReactFlow
			elements={elements}
			nodesConnectable={false}
			// onConnect={handleConnect}
			nodesDraggable
			nodeTypes={{
				group: GroupNode,
				businessStructure: BusinessStructureNode,
			}}
			// onNodeDragStart={(event, nodes) => console.log('dragStart', event, nodes)}
			// onNodeDragStop={(event, nodes) => console.log('dragStop', event, nodes)}
		>
			<Controls />
			{/* <MiniMap maskColor="rgba(150,150,150,0.5)" /> */}
		</ReactFlow>
	);
};
