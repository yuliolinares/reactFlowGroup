import { useStoreState } from 'react-flow-renderer';

export const useFlowNodeData = (id?: string) => {
	const nodes = useStoreState((state) => state.nodes);
	if (!id) return {};

	const node = nodes.find((n) => n.id === id);
	return node?.__rf ?? {};
};
