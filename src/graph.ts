import { ElkEdge, ElkExtendedEdge, ElkNode } from 'elkjs/lib/elk-api';
import { BusinessStructureNodeProps } from './BusinessStructureNode';

export type EdgeData = {
	visible?: boolean;
	sourceId?: 'parent';
};

export type ExtendEdge = ElkEdge & {
	_temp?: EdgeData;
};

export type ElkNodeExtended = ElkNode & {
	children?: ElkNodeExtended[];
	edges?: ExtendEdge[];
	_temp?: {
		type?: string;
	} & Partial<BusinessStructureNodeProps>;
};

export type ElkExtendedEdgeExtended = ElkExtendedEdge & {
	_temp: {
		visible?: boolean;
		sourcePortId?: 'parent';
	};
};

const BusinessStructureNodeDimensions = Object.freeze({
	width: 100,
	height: 70,
});

export const graph: ElkNodeExtended = {
	id: 'root',
	layoutOptions: {
		'elk.direction': 'DOWN',
	},
	children: [
		{
			_temp: {
				type: 'businessStructure',
				data: {
					label: 'Platinum',
					direction: 'v',
				},
			},
			id: 'n1',
			...BusinessStructureNodeDimensions,
		},
		{
			_temp: {
				type: 'businessStructure',
				data: {
					label: 'Mogalakwena',
					direction: 'v',
				},
			},
			id: 'n2',
			...BusinessStructureNodeDimensions,
		},
		{
			_temp: {
				type: 'group',
			},
			id: 'n3',
			children: [
				{
					id: 'n3-1',
					...BusinessStructureNodeDimensions,
					_temp: { type: 'businessStructure', data: { label: 'Mining' } },
				},
				{
					id: 'n3-2',
					...BusinessStructureNodeDimensions,
					_temp: { type: 'businessStructure', data: { label: 'Processing' } },
				},
				{
					id: 'n3-3',
					...BusinessStructureNodeDimensions,
					_temp: {
						type: 'businessStructure',
						data: { label: 'Waste', icon: 'triangle' },
					},
				},
				{
					id: 'n3-4',
					...BusinessStructureNodeDimensions,
					_temp: { type: 'businessStructure', data: { label: 'Product' } },
				},
			],
			edges: [
				{ id: 'n3-e1', sources: ['n3-1'], targets: ['n3-2'] },
				{ id: 'n3-e2', sources: ['n3-1'], targets: ['n3-3'] },
				{ id: 'n3-e3', sources: ['n3-2'], targets: ['n3-4'] },
			],
		},
		{
			_temp: {
				type: 'group',
			},
			id: 'n4',
			children: [
				{
					id: 'n4-1',
					...BusinessStructureNodeDimensions,
					_temp: { type: 'businessStructure', data: { label: 'Drilling' } },
				},
				{
					id: 'n4-2',
					...BusinessStructureNodeDimensions,
					_temp: { type: 'businessStructure', data: { label: 'Load' } },
				},
				{
					id: 'n4-3',
					...BusinessStructureNodeDimensions,
					_temp: {
						type: 'businessStructure',
						data: { label: 'Drill Stocks', icon: 'triangle' },
					},
				},
				{
					id: 'n4-4',
					...BusinessStructureNodeDimensions,
					_temp: { type: 'businessStructure', data: { label: 'Haul' } },
				},
			],
			edges: [
				{
					id: 'n4-e0',
					sources: ['n3-1'],
					targets: ['n4'],
					_temp: { sourcePortId: 'parent' },
				},
				{ id: 'n4-e1', sources: ['n4-1'], targets: ['n4-2'] },
				{ id: 'n4-e2', sources: ['n4-1'], targets: ['n4-3'] },
				{ id: 'n4-e3', sources: ['n4-2'], targets: ['n4-4'] },
				{ id: 'n4-e4', sources: ['n4-3'], targets: ['n4-2'] },
			],
		},
		{
			_temp: {
				type: 'group',
			},
			id: 'n5',
			children: [
				{
					id: 'n5-1',
					...BusinessStructureNodeDimensions,
					_temp: { type: 'businessStructure', data: { label: 'Crushing' } },
				},
				{
					id: 'n5-2',
					...BusinessStructureNodeDimensions,
					_temp: { type: 'businessStructure', data: { label: 'Milling' } },
				},
				{
					id: 'n5-3',
					...BusinessStructureNodeDimensions,
					_temp: { type: 'businessStructure', data: { label: 'Milling 2' } },
				},
				{
					id: 'n5-4',
					...BusinessStructureNodeDimensions,
					_temp: { type: 'businessStructure', data: { label: 'Floatation' } },
				},
			],
			edges: [
				{
					id: 'n5-e0',
					sources: ['n3-2'],
					targets: ['n5'],
					_temp: { sourcePortId: 'parent' },
				},
				{ id: 'n5-e0.2', sources: ['n4-4'], targets: ['n5-1'] },
				{ id: 'n5-e1', sources: ['n5-1'], targets: ['n5-2'] },
				{ id: 'n5-e2', sources: ['n5-1'], targets: ['n5-3'] },
				{ id: 'n5-e3', sources: ['n5-2'], targets: ['n5-4'] },
				{ id: 'n5-e4', sources: ['n5-3'], targets: ['n5-4'] },
			],
		},
	],
	edges: [
		{ id: 'e1', sources: ['n1'], targets: ['n2'] },
		{ id: 'e2', sources: ['n2'], targets: ['n3'] },
		{ id: 'e3', sources: ['n3'], targets: ['n4'], _temp: { visible: false } },
		{ id: 'e5', sources: ['n3'], targets: ['n5'], _temp: { visible: false } },
	],
};
