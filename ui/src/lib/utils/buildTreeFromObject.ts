import { TraceDetailResponseParent } from '@/models/tree/trace_detail_response_tree';
import { TraceTreeNode} from '@/models/trace_detail_response';

export function buildTreeFromObject(aggregatedObject: TraceDetailResponseParent): TraceTreeNode {
  const rootNode = { ...aggregatedObject, children: [] };
  const flatChildren = aggregatedObject.children;
  flatChildren.sort((a, b) => {
    if (a.depth === b.depth) {
      return a.execution_order - b.execution_order;
    }
    return a.depth - b.depth;
  });

  const nodesMap = new Map<string, TraceTreeNode>();
  nodesMap.set(aggregatedObject.run_id, rootNode);
  flatChildren.forEach(child => {
    const node = { ...child, children: [] };
    nodesMap.set(child.run_id, node);
  });

  flatChildren.forEach(child => {
    const parentNode = nodesMap.get(child.parent_run_id)!;
    if (parentNode) {
      parentNode.children.push(nodesMap.get(child.run_id)!);
    }
  });
  return rootNode;
}
