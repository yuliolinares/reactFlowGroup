import { atomFamily, selectorFamily } from 'recoil';
import { ElkNodeExtended, graph } from './graph';

export interface NodeState {
	id: string;
	value?: string;
}

export type NodeStateMap = Map<string, NodeState>;

function extractChildIds(node: ElkNodeExtended): NodeState[] {
	const childNodes: NodeState[] =
		(node.children as ElkNodeExtended[] | undefined)?.flatMap((child) =>
			extractChildIds(child)
		) ?? [];

	return [{ id: node.id, value: '' }, ...childNodes];
}

const defaultNodeStates = new Map(
	extractChildIds(graph).map((item) => [item.id, item])
);

export const nodeStateFamily = atomFamily({
	key: 'nodeStateFamily',
	default: (id: string) => defaultNodeStates.get(id),
});

export const nodeValueFamily = selectorFamily({
	key: 'nodeValueFamily',
	get: (id: string) => ({ get }) => get(nodeStateFamily(id))?.value,
	set: (id: string) => ({ set, get }, value) => {
		const state = {
			id: '',
			...get(nodeStateFamily(id)),
			value: value as string,
		};
		set(nodeStateFamily(id), state);
	},
});
