import { compareTimestamps } from '@/lib/utils/compare-timestamps-to-nano';
import { TraceData } from '@langscout/models';

export function buildTreeFromObject(aggregatedObject: TraceData): TraceData {
  const rootNode = { ...aggregatedObject, child_runs: [] };
  const flatChildren = aggregatedObject.child_runs;
  flatChildren.sort((a, b) => {
    if (a.depth !== undefined && b.depth !== undefined) {
      // Handle Records that were for when we had execution_order (old format)
      if (a.depth === b.depth) {
        if (a.dotted_order !== undefined && b.dotted_order !== undefined) {
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
        }
      }
      return a.depth - b.depth;
    }
    return 0;
  });

  const nodesMap = new Map<string, TraceData>();
  nodesMap.set(aggregatedObject.run_id, rootNode);
  flatChildren.forEach(child => {
    const node = { ...child, child_runs: [] };
    nodesMap.set(child.run_id, node);
  });

  flatChildren.forEach(child => {
    const parentNode: TraceData = nodesMap.get(child.parent_run_id!)!;
    if (parentNode) {
      parentNode.child_runs.push(nodesMap.get(child.run_id)!);
    }
  });
  return rootNode;
}
