import * as _ from 'lodash';

export class TreeModel {

  parent: TreeModel | null;
  root: string | null;
  value: string | null;
  representation: any = {};
  left: TreeModel | null = null;
  right: TreeModel | null = null;
  trace: TreeModel | null = null;
  traceOf: TreeModel | null = null;

  static merge(root: string, right: TreeModel, left: TreeModel | null = null): TreeModel {
    const mergedTree = new TreeModel(root);
    mergedTree.right = right;
    mergedTree.left = left;
    if (right.parent) {
      if (right.parent.left === right) {
        right.parent.left = mergedTree;
      } else {
        right.parent.right = mergedTree;
      }
      mergedTree.parent = right.parent;
    }
    left.parent = mergedTree;
    right.parent = mergedTree;
    return mergedTree;
  }

  static copy(original: TreeModel): TreeModel {
    const copy = _.cloneDeep(original);
    copy.trace = original;
    original.traceOf = copy;
    return copy;
  }

  static move(root: string, tree: TreeModel, original: TreeModel, trace: string | null = null) {
    const copy = TreeModel.copy(original);
    original.root = trace == null ? null : trace;
    return TreeModel.merge(root, tree, copy);
  }

  getRoot() {
    return !this.parent ? this : this.parent.getRoot();
  }

  containsTrace() {
    const leftTrace = this.left ? this.left.containsTrace() : false;
    const rightTrace = this.right ? this.right.containsTrace() : false;
    return !!this.traceOf || leftTrace || rightTrace;
  }

  export() {
    if (this.value) {
      return this.value;
    }
    return '[' + this.left.export() + ',' + this.right.export() + ']';
  }

  constructor(root: string, value?: string) {
    this.root = root;
    this.value = value;
  }

}
