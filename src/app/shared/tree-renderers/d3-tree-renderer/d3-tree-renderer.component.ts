import { Component, EventEmitter, ViewChild, OnChanges, ElementRef, Input, Output, AfterViewInit } from '@angular/core';
import { D3Service, D3 } from 'd3-ng2-service';
import { D3CreatorService } from '../../services/d3-creator.service';
import { TreeRenderer } from '../tree-renderer';
import { TreeModel } from '../../models/tree.model';
import * as _ from 'lodash';

@Component({
  selector: 'd3-tree-renderer',
  templateUrl: 'd3-tree-renderer.html',
  styleUrls: ['./d3-tree-renderer.css']
})
export class D3TreeRendererComponent extends TreeRenderer implements AfterViewInit, OnChanges {
    private d3: D3;
    @ViewChild('container', {static: false}) container: ElementRef;
    private parentNativeElement: any;
    private rendered = false;
    private parentElement: any;

    @Output() nodeSelected = new EventEmitter();
    @Input() height: any;
    @Input() width: any;
    @Input() initialNodes: string;
    @Input() minimalMarginHorizontal: number;
    @Input() minimalMarginVertical: number;
    @Input() fontSize = 10;
    @Input() fontFamily = 'Courier';
    @Input() fontColor = 'black';

    constructor(
        public element: ElementRef,
        public d3Creator: D3CreatorService
    ) {
        super();
        this.d3 = new D3Service().getD3();
    }

    ngAfterViewInit() {
        const d3 = this.d3;
        this.parentNativeElement = this.container.nativeElement;
        if (this.parentNativeElement !== null) {
            this.parentElement = d3.select(this.parentNativeElement)
            .append('svg').attr('height', this.height).attr('width', this.width);
            this.clear();
            this.rendered = true;
        }
    }

    clear() {
        this.parentElement.remove();
        this.parentElement = this.d3.select(this.parentNativeElement)
        .append('svg').attr('height', this.height).attr('width', this.width);
        this.d3Creator.bindToElement(this.parentElement);
        this.d3Creator.createEndpoint(this.parentElement, 'triangle', 'black');
        const terminals = this.initialNodes.split(',');
        let xPos = this.minimalMarginHorizontal;
        const [ h, w ] = this.getCharSize();
        this.nodes = [];
        for (const terminal of terminals) {
            xPos += w * terminal.length / 2;
            const match = /<([^<>]*)>([^<>]*)?/.exec(terminal);
            console.log(match);
            this.nodes.push(this.newNode(match[1], [xPos, this.minimalMarginVertical - h * 0.55], match[2] ? match[2] : null));
            this.canvasBoundaryCheck(this.nodes[this.nodes.length - 1]);
            xPos += w * terminal.length + this.minimalMarginHorizontal;
        }
    }

    resizeCanvas(width: number, height: number) {
        console.log('RESIZE', width, height);
        this.d3Creator.changeElement(this.parentElement, {
            'attr': {
                'width': width,
                'height': height
            }
        });
    }

    ngOnChanges(changesObj) {
        /*if(this.tree != undefined && this.rendered) {
            this.d3.select(this.parentNativeElement).select('svg').selectAll('*').remove();
            this.render(this.tree);
        }*/
    }

    createArrow(lineData: {x: number, y: number}[]) {
        return this.parentElement.createPath(
            'line', 'black', 1, 'none', this.d3Creator.lineFunction(lineData, 'curveLinear'), 'url(#triangle)'
        );
    }

    hideElement(element, transition = undefined) {
        if (element) {
            element.remove();
        }
    }

    dimnishElement(element, transition = undefined) {
        if (element) {
            element.attr('opacity', 0.3);
        }
    }

    createNode(root: string, x: number, y: number, model: TreeModel, transition = undefined) {
        const node = this.parentElement.createText(
            'xxx', x, y, 0.0, this.fontColor, this.fontFamily, this.fontSize, root
        );
        this.d3Creator.changeElement(node, {
            'attr': {
                'opacity': 1.0
            },
            'on': {
                'click': () => this.onNodeClick(model, node),
                'mouseover': () => this.onNodeOver(model, node),
                'mouseout': () => this.onNodeOut(model, node)
            }
        }, transition);
        return node;
    }

    getX(node: TreeModel) {
        return this.d3Creator.getX(node.representation.root);
    }

    getY(node: TreeModel) {
        return this.d3Creator.getY(node.representation.root);
    }

    shiftElement(el, shiftX: number, shiftY: number, transition = undefined) {
        this.d3Creator.shiftElement(el, shiftX, shiftY, transition);
    }

    shiftEdge(el, shiftX: number, shiftY: number, transition = undefined) {
        this.d3Creator.shiftEdge(el, shiftX, shiftY, transition);
    }

    shiftPath(el, points: {x: number, y: number}[], transition = undefined) {
        this.d3Creator.shiftPath(el, points, transition);
    }

    onNodeSelected(model: TreeModel, action: string) {
        const colorMapping = {
            'selectFirst': 'yellow',
            'selectSecond': 'orange'
        };
        const [ t, l, b, r ] = this.getTreeBounds(model);
        if (action === 'unselect') {
            model.representation.highlight.remove();
        }   else {
            model.representation.highlight = this.d3Creator.createElement(this.parentElement, 'rect', {
                'attr': {
                    'x': l - 2,
                    'y': t,
                    'width': r - l + 2,
                    'height': b - t
                },
                'style': {
                    'fill': colorMapping[action],
                    'opacity': 0.5
                }
            }, false);
        }
    }

    onNodeClick(model: TreeModel, node) {
        this.nodeSelected.emit(model);
    }

    onNodeOver(model: TreeModel, node) {
        this.d3Creator.changeElement(node, {
            'style': {
                'text-decoration': 'underline'
            }
        });
    }

    onNodeOut(model: TreeModel, node) {
        this.d3Creator.changeElement(node, {
            'style': {
                'text-decoration': 'none'
            }
        });
    }

    createValueNodeConnection(node: TreeModel, transition = undefined) {
        const bottom_x = this.d3Creator.getX(node.representation.value);
        const bottom_y = this.d3Creator.getY(node.representation.value) - 12;
        const top_x = this.d3Creator.getX(node.representation.root);
        const top_y = this.d3Creator.getY(node.representation.root) + 3;
        const line = this.parentElement.createLine(
            'xxx', bottom_x, bottom_x, bottom_y, bottom_y, 1, 'black'
        );
        node.representation.valueEdge = line;
        this.d3Creator.changeElement(line, {
            'attr': {
                'x2': top_x,
                'y2': top_y
            }
        }, transition);
        return line;
    }

    createConnection(topNode: TreeModel, bottomNode: TreeModel, child = 'leftEdge', transition = undefined) {
        const bottom_x = this.getX(bottomNode);
        const bottom_y = this.getY(bottomNode) - 12;
        let top_x = this.getX(topNode) - 3;
        const top_y = this.getY(topNode) + 3;
        const line = this.parentElement.createLine(
            'xxx', bottom_x, bottom_x, bottom_y, bottom_y, 1, 'black'
        );
        bottomNode.representation.parentEdge = line;
        topNode.representation[child] = line;
        if (top_x + 3 < bottom_x) {
            top_x += 6;
        }   else if (top_x + 3 === bottom_x) {
            top_x += 3;
        }
        this.d3Creator.changeElement(line, {
            'attr': {
                'x2': top_x,
                'y2': top_y
            }
        }, transition);
        return line;
    }

    getCharSize() {
        const el = this.parentElement.append('svg').attr('id', 'dummy').append('text')
                       .attr('font-size', this.fontSize + 'px').attr('font-family', this.fontFamily)
                       .text('W').node();
        const width = el.getBBox().width;
        const height = el.getBBox().height;
        el.remove();
        this.parentElement.select('#dummy').remove();
        return [ height, width ];
    }

}
