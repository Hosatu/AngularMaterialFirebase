import { Injectable } from '@angular/core';
import { D3Service, D3 } from 'd3-ng2-service';
import * as _ from 'lodash';

@Injectable()
export class D3CreatorService {
    public d3: D3;
    public api = {
        'createElement': this.createElement,
        'changeElement': this.changeElement,
        'createMultiCircle': this.createMultiCircle,
        'createCircle': this.createCircle,
        'createLine': this.createLine,
        'createText': this.createText,
        'createLinearGradient': this.createLinearGradient,
        'createRadialGradient': this.createRadialGradient,
        'createGlowFilter': this.createGlowFilter,
        'createPath': this.createPath,
        'shiftPath': this.shiftPath,
        'shiftEdge': this.shiftEdge,
        'shiftElement': this.shiftElement,
        'getX': this.getX,
        'getY': this.getY,
        'changeStroke': this.changeStroke,
        'changeFill': this.changeFill,
        'bindToElement': this.bindToElement
    };

    constructor() {
        this.d3 = new D3Service().getD3();
    }

    getX(el) {
        return parseFloat(this.d3.select(el.node()).attr('x'));
    }

    getY(el) {
        return parseFloat(this.d3.select(el.node()).attr('y'));
    }

    shiftElement(el: any, shiftX: number, shiftY: number, transition = undefined) {
        this.changeElement(el, {
            'attr': {
                'x': this.getX(el) + shiftX,
                'y': this.getY(el) + shiftY
            }
        }, transition);
    }

    shiftEdge(edgeEl: any, shiftX: number, shiftY: number, transition = undefined) {
       this.changeElement(edgeEl, {
            'attr': {
                'x1': parseFloat(edgeEl.attr('x1')) + shiftX,
                'y1': parseFloat(edgeEl.attr('y1')) + shiftY,
                'x2': parseFloat(edgeEl.attr('x2')) + shiftX,
                'y2': parseFloat(edgeEl.attr('y2')) + shiftY
            }
        }, transition);
    }

    shiftPath(path: any, points: {x: number, y: number}[], transition = undefined) {
        this.changeElement(path, {
            'attr': {
                'd': this.lineFunction(points, 'curveLinear')
            }
        });
    }

    bindToElement(element) {
        for (const methodName in this.api) {
            if (this.api.hasOwnProperty(methodName)) {
                const curried = (el) => (...args) => this.api[methodName](el, ...args); // _.curry(this.api[methodName]);
                element[methodName] = curried(element);
                element.api = _.cloneDeep(this.api);
            }
        }
    }

    lineFunction(data: {x: number, y: number}[], method) {
        return (this.d3.line<{x: number, y: number}>().x((d) => d.x).y((d) => d.y).curve(this.d3[method]))(data);
    }

    areaFunction(data: {x: number, y: number}[], base, method) {
        return (this.d3.area<{x: number, y: number}>()
                .x(function(d) { return d.x; })
                .y0(base)
                .y1(function(d) { return d.y; })
                .curve(this.d3[method]))(data);
    }

    arcFunction(data: {inner: number, outer: number, start: number, end: number}) {
        return (this.d3.arc<{inner: number, outer: number, start: number, end: number}>()
                .innerRadius(function(d) { return d.inner; })
                .outerRadius(function(d) { return d.outer; })
                .startAngle(function(d) { return d.start; })
                .endAngle(function(d) { return d.end; }))(data);
    }

    createElement(container, type, attrs, last = true) {
        const element = last ? container.append(type) : container.insert(type, ':first-child');
        this.changeElement(element, attrs);
        this.bindToElement(element);
        return element;
    }

    changeElement(element, settings, transition = undefined) {
        let newElement = element;
        if (transition !== undefined) {
            newElement = element.transition();
            for (const attr in transition) {
                if (attr === 'ease') {
                    newElement = newElement[attr](this.d3[transition[attr]]);
                } else {
                    newElement = newElement[attr](transition[attr]);
                }
            }
        }
        for (const settingName in settings) {
            if (_.isPlainObject(settings[settingName])) {
                for (const key in settings[settingName]) {
                    if (settings[settingName].hasOwnProperty(key)) {
                        newElement = newElement[settingName](key, settings[settingName][key]);
                    }
                }
            }	else {
                newElement = newElement[settingName](settings[settingName]);
            }

        }
        return element;
    }

    createMultiCircle(container, commonId, cx, cy, radii, fill) {
        const circles = [];
        for (const index in radii) {
            if (radii.hasOwnProperty(index)) {
                const circleLayer = this.createElement(container, 'circle', {
                    'attr': {
                        'cx': cx,
                        'filter': 'url(#circle-glow)',
                        'cy': cy,
                        'r': radii[index],
                        'stroke': 'none',
                        'fill': fill[index],
                        'id': commonId + '_layer' + index
                    }
                });
                circles.push(circleLayer);
            }

        }
        return circles;
    }

    createCircle(container, id, cx, cy, r, fill, stroke) {
        return this.createElement(container, 'circle', {
            'attr': {
                'id': id,
                'cx': cx,
                'cy': cy,
                'r': r,
                'fill': fill,
                'stroke': stroke
            }
        });
    }

    createLine(container, id, x1, x2, y1, y2, strokeWidth, stroke) {
        return this.createElement(container, 'line', {
            'attr': {
                'id': id,
                'x1': x1,
                'x2': x2,
                'y1': y1,
                'y2': y2,
                'stroke-width': strokeWidth,
                'stroke': stroke
            }
        });
    }

    createText(container, id, x, y, opacity, fill, fontFamily, fontSize, text, eventHandlers = {}) {
        return this.createElement(container, 'text', {
            'attr': {
                'id': id,
                'text-anchor': 'middle',
                'x': x,
                'y': y,
                'opacity': opacity,
                'fill': fill,
                'font-family': fontFamily,
                'font-size': fontSize + 'px'
            },
            'text': text,
            'on': eventHandlers
        });
    }

    createLinearGradient(container, gradient) {
        const grad = {'gradient': this.createElement(container, 'linearGradient', {
            'attr': gradient.definition
        }), 'stops': []};
        for (const stop of gradient.stops) {
            grad.stops.push(this.createElement(grad.gradient, 'stop', {
                'attr': stop
            }));
        }
        return grad;
    }

    createRadialGradient(container, gradient) {
        const grad = {'gradient': this.createElement(container, 'radialGradient', {
            'attr': gradient.definition
        }), 'stops': []};
        for (const stop of gradient.stops) {
            grad.stops.push(this.createElement(grad.gradient, 'stop', {
                'attr': stop
            }));
        }
        return grad;
    }

    createGlowFilter(container, id, deviation) {
        const filter: any = {'container': this.createElement(container, 'filter', {
            'attr': {
                'id': id,
                'height': '150%',
                'width': '150%',
                'y': '-50%',
                'x': '-50%',
                'filterUnits': 'userSpaceOnUse'
            }
        })};
        filter.blur = this.createElement(filter.container, 'feGaussianBlur', {
            'attr': {
                'stdDeviation': deviation,
                'result': 'coloredBlur'
            }
        });
        filter.merge = this.createElement(filter.container, 'feMerge', {});
        filter.mergeNodes = [];
        filter.mergeNodes.push(this.createElement(filter.merge, 'feMergeNode', {
            'attr': {
                'in': 'coloredBlur'
            }
        }));
        filter.mergeNodes.push(this.createElement(filter.merge, 'feMergeNode', {
            'attr': {
                'in': 'SourceGraphic'
            }
        }));
        return filter;
    }

    createEndpoint(container, id, fill) {
        return container.append('svg:defs').append('svg:marker')
        .attr('id', id)
        .attr('refX', 3)
        .attr('refY', 3)
        .attr('markerWidth', 20)
        .attr('markerHeight', 20)
        .attr('markerUnits', 'userSpaceOnUse')
        .attr('orient', 'auto')
        .append('path')
        .attr('d', 'M 0 0 6 3 0 6 1.5 3')
        .style('fill', fill);
    }

    createPath(container, id, stroke, strokeWidth, fill, d, markerEnd ) {
        return this.createElement(container, 'path', {
            'attr': {
                'id': id,
                'stroke': stroke,
                'stroke-width': strokeWidth,
                'fill': fill,
                'd': d,
                'marker-end': markerEnd
            }
        });
    }

    changeFill(el, color: string) {
        this.changeElement(el, {
            'attr': {
                'fill': color
            }
        });
    }

    changeStroke(el, color: string) {
        this.changeElement(el, {
            'attr': {
                'stroke': color
            }
        });
    }
}
