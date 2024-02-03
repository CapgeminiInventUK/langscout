import { TraceTreeNode } from '@/models/trace_detail_response';
import { compareTimestamps } from '@/lib/utils/compareTimestampsToNano';

export function buildTreeFromObject(aggregatedObject: TraceTreeNode): TraceTreeNode {
  const rootNode = { ...aggregatedObject, children: [] };
  const flatChildren = aggregatedObject.children;
  flatChildren.sort((a, b) => {
    if (a.depth !== undefined && b.depth !== undefined) {
      // Handle Records that were for when we had execution_order (old format)
      if (a.depth === b.depth) {
        if (a.dotted_order !== undefined && b.dotted_order !== undefined) {
          console.debug('Using Dotted Order to sort');

          const aDottedOrder = a.dotted_order.split('.');
          const bDottedOrder = b.dotted_order.split('.');

          const aLastElement = aDottedOrder.pop();
          const bLastElement = bDottedOrder.pop();

          const aDate = aLastElement!.substring(0, 22)
            .replace(/^(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})(\d{2})(\d{3})(\d{3})Z$/,
              '$1-$2-$3T$4:$5:$6.$7$8Z');
          const bDate = bLastElement!.substring(0, 22)
            .replace(/^(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})(\d{2})(\d{3})(\d{3})Z$/,
              '$1-$2-$3T$4:$5:$6.$7$8Z');

          return compareTimestamps(aDate, bDate);
        } else if (a.execution_order !== undefined && b.execution_order !== undefined) {
          console.debug('Using Execution Order to sort');
          console.log(a.execution_order, b.execution_order);
          return a.execution_order - b.execution_order;
        }
      }
      return a.depth - b.depth;
    }
    return 0;
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
