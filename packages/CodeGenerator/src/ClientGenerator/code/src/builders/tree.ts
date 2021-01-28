import { useSelector } from 'react-redux';
import Graph from 'graph-data-structure';

import { Store } from '../types/store';
import { TreeNode } from '../types/tree';

export const useBuildTree = (): TreeNode[] => {
  const { widgets, pages, layouts } = useSelector((state: Store) => ({
    widgets: state.widget.config,
    pages: state.page.config,
    layouts: state.layout.config,
  }));

  const all = { ...pages, ...layouts, ...widgets };

  const elementGraph = Graph();
  Object.keys(all).forEach((k) => elementGraph.addNode(k));
  Object.values({ ...widgets, ...layouts }).forEach((v) => elementGraph.addEdge(v.parent, v.id));

  const buildTree = (node: string): TreeNode => {
    const element = all[node];
    const children = elementGraph.adjacent(node);
    return {
      id: element.id,
      name: element.name,
      type: element.type,
      position: element.type === 'page' ? 0 : element.position,
      children: children.map(buildTree).sort((a, b) => (a.position > b.position ? 1 : -1)),
    };
  };

  const elementTree: TreeNode[] = Object.keys(pages).map(buildTree);

  return elementTree;

  // return elementTree.map((node, idx) => ({
  //   id: node.id,
  //   name: pages[node.id].name,
  //   default: idx === 0,
  //   component: React.createElement(
  //     PageBuilder,
  //     pages[node.id], widgets, layouts, node),
  // }));
};