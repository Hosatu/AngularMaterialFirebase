import { TreeModel } from '../models/tree.model';
import * as _ from 'lodash';

export abstract class TreeRenderer {
    protected history: {type: string, args: any[]}[] = [];
    protected fontSize = 10;
    protected fontFamily = 'Arial';
    protected fontColor = 'black';
    protected minimalMarginHorizontal = 20;
    protected minimalMarginVertical = 40;
    protected width;
    protected height;
    protected nodes: TreeModel[];

    abstract createNode(root: string, x: number, y: number, model: TreeModel, transition);
    abstract createConnection(topNode: TreeModel, bottomNode: TreeModel, child, transition);
    abstract createArrow(lineData: {x: number, y: number}[]);
    abstract createValueNodeConnection(node: TreeModel, transition);
    abstract hideElement(element, transition);
    abstract dimnishElement(element, transition);
    abstract shiftElement(el, shiftX: number, shiftY: number, transition);
    abstract shiftEdge(el, shiftX: number, shiftY: number, transition);
    abstract shiftPath(el, points: {x: number, y: number}[], transition);
    abstract getX(node: TreeModel);
    abstract getY(node: TreeModel);
    abstract getCharSize();
    abstract resizeCanvas(width: number, height: number);

    render(tree: TreeModel, anchor: {x: number, y: number} = {x: 50, y: 50}) {

    }

    public newNode(root: string, position: [number, number], value: string = null) {
        let [x, y] = position;
        let model = new TreeModel(root, value);
        let element = this.createNode(root, x, y, model, undefined);
        model.representation.root = element;
        if (value !== null) {
            let valueElement = this.createNode(value, x, y + this.minimalMarginVertical, model, undefined);
            model.representation.value = valueElement;
            this.createValueNodeConnection(model, undefined);
        }
        this.history.push({type: 'NEW', args: [root, position]});
        return model;
    }

    public merge(root: string, base: TreeModel, merged: TreeModel) {
        let rootNode = this.renderMerge(root, merged, base);
        this.canvasBoundaryCheck(rootNode);
        this.checkOtherTrees(rootNode);
        this.history.push({type: 'MERGE', args: [root, base, merged]});
        return rootNode;
    }

    public mergeIn(head: string, root: string, tree: TreeModel, value: string = null) {
        let node = this.newNode(head, this.getCoordinatesNextTo(head, tree), value);
        let rootNode = this.renderMerge(root, node, tree);
        this.canvasBoundaryCheck(rootNode);
        this.checkOtherTrees(rootNode);
        this.history.push({type: 'MERGEIN', args: [head, root]});
    }

    public move(root: string, tree: TreeModel, orig: TreeModel, trace: string | null = null) {
        let copy = TreeModel.copy(orig);
        this.renderCopy(copy);
        this.moveCopy(copy, orig, tree, undefined);
        this.rerenderOriginal(orig, trace);
        this.checkOverlap(copy, tree);
        let rootNode = this.renderMerge(root, copy, tree);
        this.canvasBoundaryCheck(rootNode);
        if (trace) {
            this.rerenderMovement(copy, !(trace === 'keep'));
        }
        this.canvasBoundaryCheck(rootNode);
        this.checkOtherTrees(rootNode);
        this.history.push({type: 'MOVE', args: [root, tree, orig, trace]});
        return rootNode;
    }

    public rerenderMovement(tree: TreeModel, copyMovement: boolean) {
        if (tree.trace && tree.trace.root) {
            console.log(tree.root, 'MOVE RERENDER');
            tree.representation.movementGoal = this.renderMovement(tree.trace, tree);
            tree.trace.representation.movementStart = tree.representation.movementGoal;
        }
        if (copyMovement && tree.left) {
            this.rerenderMovement(tree.left, copyMovement);
        }
        if (copyMovement && tree.right) {
            this.rerenderMovement(tree.right, copyMovement);
        }
    }

    public shift(tree: TreeModel, shiftX: number, shiftY: number, transition = undefined) {
        this.shiftElement(tree.representation.root, shiftX, shiftY, transition);
        if (tree.value) {
            this.shiftElement(tree.representation.value, shiftX, shiftY, transition);
            this.shiftEdge(tree.representation.valueEdge, shiftX, shiftY, transition);
        }
        if (_.has(tree.representation, 'leftEdge'))    {
            this.shiftEdge(tree.representation.leftEdge, shiftX, shiftY, transition);
        }
        if (_.has(tree.representation, 'rightEdge'))    {
            this.shiftEdge(tree.representation.rightEdge, shiftX, shiftY, transition);
        }
        if (tree.left != null) {
            this.shift(tree.left, shiftX, shiftY, transition);
        }
        if (tree.right != null) {
            this.shift(tree.right, shiftX, shiftY, transition);
        }
        if (_.has(tree.representation, 'movementGoal')) {
            this.shiftPath(tree.representation.movementGoal, this.getConnectionPoints(tree.trace, tree), transition);
        }
        if (_.has(tree.representation, 'movementStart')) {
            this.shiftPath(tree.representation.movementStart, this.getConnectionPoints(tree, tree.traceOf), transition);
        }
    }

    protected renderMovement(original: TreeModel, copy: TreeModel) {
        let lineData = this.getConnectionPoints(original, copy);
        return this.createArrow(lineData);
    }

    protected rerenderOriginal(original: TreeModel, trace: string | null = null) {
        if (trace) {
            if (trace === 'keep') {
                this.dimnishTree(original);
            } else {
                let parent = original.parent;
                original.parent = null;
                this.hideTree(original);
                original.left = null;
                original.right = null;
                original.value = null;
                original.representation.value = null;
                original.representation.valueEdge = null;
                original.parent = parent;
                original.root = trace;
                let traceEl = this.createNode(trace, this.getX(original), this.getY(original), original, undefined);
                original.representation.root = traceEl;
            }
        }   else {
            this.hideElement(original.representation.parentEdge, undefined);
            this.hideTree(original);
        }
    }

    protected moveCopy(copy: TreeModel, original: TreeModel, from: TreeModel, transition = undefined) {
        let [new_x, new_y] = this.getCoordinatesNextTo(copy.root, from);
        this.shift(
            copy,
            new_x - this.getX(original),
            new_y - this.getY(original),
            transition
        );
    }

    protected renderMerge(root: string, l: TreeModel, r: TreeModel): TreeModel {
        let left = l;
        let right = r;
        if (this.getX(left) > this.getX(right)) {
            left = r;
            right = l;
        }
        this.checkOverlap(left, right);
        let [rootNode_x, rootNode_y] = this.mergeNodeCoords(left, right);
        let shift_x = 0;
        let shift_y = 0;
        let parentEdge = null;
        if (right.parent) {
            parentEdge = right.representation.parentEdge;
            shift_y = this.minimalMarginVertical;
            shift_x = (this.getX(right) - rootNode_x);
        }
        let rootNode = TreeModel.merge(root, right, left);
        rootNode.representation.root = this.createNode(root, rootNode_x, rootNode_y, rootNode, undefined);
        if (parentEdge ! = null) {
            rootNode.representation.parentEdge = parentEdge;
        }
        this.createConnection(rootNode, left, 'leftEdge', undefined);
        if (left !== right) {
            this.createConnection(rootNode, right, 'rightEdge', undefined);
        }
        this.shift(rootNode, shift_x, shift_y);
        return rootNode;
    }

    protected renderCopy(copy: TreeModel) {
        delete copy.representation.parentEdge;
        delete copy.representation.movementGoal;
        if (copy.root === null) {
            return;
        }
        copy.representation.root = this.createNode(copy.root, this.getX(copy), this.getY(copy), copy, undefined)
        if (copy.value) {
            copy.representation.value = this.createNode(copy.value, this.getX(copy), this.getY(copy) + this.minimalMarginVertical, copy, undefined);
            copy.representation.valueEdge = this.createValueNodeConnection(copy, undefined);
        }
        if (copy.left) {
            copy.representation.leftEdge = this.createConnection(copy, copy.left, 'leftEdge', undefined);
            copy.left.representation.parentEdge = copy.representation.leftEdge;
            this.renderCopy(copy.left);
        }
        if (copy.right) {
            copy.representation.rightEdge = this.createConnection(copy, copy.right, 'rightEdge', undefined);
            copy.right.representation.parentEdge = copy.representation.rightEdge;
            this.renderCopy(copy.right);
        }
    }

    getCoordinatesNextTo(coordinatesFor: string, rightNeighbour: TreeModel): [number, number] {
        let [ h, w ] = this.getTextDimension(coordinatesFor, this.fontSize, this.fontFamily);
        let moved_x = this.getX(rightNeighbour) - w / 2 - this.minimalMarginHorizontal;
        let moved_y = this.getY(rightNeighbour);
        return [moved_x, moved_y];
    }

    mergeNodeCoords(left: TreeModel, right: TreeModel): [number, number] {
        let x = (this.getX(left) + this.getX(right)) / 2;
        let y = Math.min(this.getY(left), this.getY(right)) - this.minimalMarginVertical;
        return [x, y];
    }

    getConnectionPoints(from: TreeModel, to: TreeModel) {
        let [ t, l, b, r ] = this.getTreeBounds(to);
        let [ , , fromBottom, ] = this.getTreeBounds(from, false);
        console.log(from, fromBottom, this.getY(from))
        return [
            {
                x: this.getX(from),
                y: fromBottom + 3
            },
            {
                x: this.getX(from),
                y: Math.max(fromBottom, b + 8) + 6
            },
            {
                x: Math.min(l - 8, this.getX(to) - (this.getCharSize()[1] * to.root.length) - 8),
                y: Math.max(fromBottom, b + 8) + 6
            },
            {
                x: Math.min(l - 8, this.getX(to) - (this.getCharSize()[1] * to.root.length) - 8),
                y: this.getY(to) - this.getCharSize()[0] / 4
            },
            {
                x: this.getX(to) - (this.getCharSize()[1] * to.root.length / 2) - 3,
                y: this.getY(to) - this.getCharSize()[0] / 4
            }
        ];
    }

    protected hideTree(tree: TreeModel, transition = undefined) {
        this.hideElement(tree.representation.root, transition);
        if (tree.value) {
            this.hideElement(tree.representation.value, transition);
            this.hideElement(tree.representation.valueEdge, transition);
        }
        if (tree.parent) {
            this.hideElement(tree.representation.parentEdge, transition);
        }
        if (tree.trace) {
            this.hideElement(tree.representation.movementGoal, transition);
        }
        if (tree.left) {
            this.hideElement(tree.representation.leftEdge, transition);
            this.hideTree(tree.left);
        }
        if (tree.right) {
            this.hideElement(tree.representation.rightEdge, transition);
            this.hideTree(tree.right);
        }
    }

    protected dimnishTree(tree: TreeModel, transition = undefined) {
        this.dimnishElement(tree.representation.root, transition);
        if (tree.value) {
            this.dimnishElement(tree.representation.value, transition);
            this.dimnishElement(tree.representation.valueEdge, transition);
        }
        if (tree.trace) {
            this.dimnishElement(tree.representation.movementGoal, transition);
        }
        if (tree.left) {
            this.dimnishElement(tree.representation.leftEdge, transition);
            this.dimnishTree(tree.left);
        }
        if (tree.right) {
            this.dimnishElement(tree.representation.rightEdge, transition);
            this.dimnishTree(tree.right);
        }
    }

    protected checkOtherTrees(tree: TreeModel, checkOthers = true) {
        let selectedParent = tree.getRoot();
        for (let node of this.nodes) {
            let currentParent = node.getRoot();
            if (currentParent !== selectedParent) {
                let [left, right] = (this.getX(currentParent) < this.getX(selectedParent)) ?
                                    [currentParent, selectedParent] : [selectedParent, currentParent];
                this.checkOverlap(left, right);
                this.canvasBoundaryCheck(left);
                this.canvasBoundaryCheck(right);
            }
            if (checkOthers) {
                this.checkOtherTrees(node, false);
            }
        }
    }

    protected canvasBoundaryCheck(tree: TreeModel) {
        if (tree.parent) {
            return this.canvasBoundaryCheck(tree.parent);
        }
        let [ t, l, ,  ] = this.getTreeBounds(tree);
        if (t < this.minimalMarginVertical) {
            this.shift(tree, 0, -t + this.minimalMarginVertical);
        }
        if (l < this.minimalMarginHorizontal) {
            this.shift(tree, -l + this.minimalMarginHorizontal, 0);
        }
        let [ , , b, r ] = this.getTreeBounds(tree);
        if ( b > this.height - this.minimalMarginVertical) {
            this.height = b + this.minimalMarginVertical;
            this.resizeCanvas(this.width, b + this.minimalMarginVertical);
        }
        if ( r > this.width - this.minimalMarginHorizontal) {
            this.width = r + this.minimalMarginHorizontal;
            this.resizeCanvas(r + this.minimalMarginHorizontal, this.height);
        }
    }

    protected checkOverlap(leftTree: TreeModel, rightTree: TreeModel) {
        let [ t1, l1, b1, r1 ] = this.getTreeBounds(leftTree);
        let [ t2, l2, b2, r2 ] = this.getTreeBounds(rightTree);
        if (r1 + this.minimalMarginHorizontal > l2 ) {
            this.shift(leftTree, -(r1 + this.minimalMarginHorizontal - l2), 0);
        }
    }

    protected getTreeBounds(tree: TreeModel, countTrace = true): [number, number, number, number] {
        let [ h, w ] = this.getTextDimension(tree.root, this.fontSize, this.fontFamily);
        let [ t, l, b, r ] = [
            this.getY(tree) - h,
            this.getX(tree) - w / 2,
            this.getY(tree),
            this.getX(tree) + w / 2
        ];
        if (tree.value) {
            [ h, w ] = this.getTextDimension(tree.value, this.fontSize, this.fontFamily);
            let [ t1, l1, b1, r1 ] = [
                this.getY(tree) - h,
                this.getX(tree) - w / 2,
                this.getY(tree) + this.minimalMarginVertical + (countTrace ? h : 0),
                this.getX(tree) + w / 2
            ];
            t = Math.min(t, t1);
            l = Math.min(l, l1);
            b = Math.max(b, b1);
            r = Math.max(r, r1);
            if (countTrace && (tree.trace || tree.traceOf)) {
                l -= 14;
                b += 14;
            }
            return [t, l, b, r];
        }
        if (tree.left) {
            let [t1, l1, b1, r1] = this.getTreeBounds(tree.left, countTrace);
            t = Math.min(t, t1);
            l = Math.min(l, l1);
            b = Math.max(b, b1);
            r = Math.max(r, r1);
        }
        if (tree.right) {
            let [t1, l1, b1, r1] = this.getTreeBounds(tree.right, countTrace);
            t = Math.min(t, t1);
            l = Math.min(l, l1);
            b = Math.max(b, b1);
            r = Math.max(r, r1);
        }
        if (countTrace && (tree.trace || tree.traceOf)) {
            l -= 14;
            b += 14;
        }
        return [t, l, b, r];
    }

    protected getTextDimension(text: string, fontSize: number, fontFamily: string) {
        let [ h, w ] = this.getCharSize();
        return [ h, text.length * w];
    }

    public getNodes() {
        return this.nodes;
    }

}
