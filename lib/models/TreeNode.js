"use strict";
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spread = (this && this.__spread) || function () {
    for (var ar = [], i = 0; i < arguments.length; i++) ar = ar.concat(__read(arguments[i]));
    return ar;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TreeNode = void 0;
var reactive_1 = require("@formily/reactive");
var shared_1 = require("@designable/shared");
var events_1 = require("../events");
var registry_1 = require("../registry");
var internals_1 = require("../internals");
var TreeNodes = new Map();
var CommonDesignerPropsMap = new Map();
var removeNode = function (node) {
    if (node.parent) {
        node.parent.children = node.parent.children.filter(function (child) { return child !== node; });
    }
};
var resetNodesParent = function (nodes, parent) {
    var resetDepth = function (node) {
        node.depth = node.parent ? node.parent.depth + 1 : 0;
        node.children.forEach(resetDepth);
    };
    var shallowReset = function (node) {
        node.parent = parent;
        node.root = parent.root;
        resetDepth(node);
    };
    var deepReset = function (node) {
        shallowReset(node);
        resetNodesParent(node.children, node);
    };
    return nodes.map(function (node) {
        if (node === parent)
            return node;
        if (!parent.isSourceNode) {
            if (node.isSourceNode) {
                node = node.clone(parent);
                resetDepth(node);
            }
            else if (!node.isRoot && node.isInOperation) {
                node.root.operation.selection.remove(node);
                removeNode(node);
                shallowReset(node);
            }
            else {
                deepReset(node);
            }
        }
        else {
            deepReset(node);
        }
        if (!TreeNodes.has(node.id)) {
            TreeNodes.set(node.id, node);
            CommonDesignerPropsMap.set(node.componentName, node.designerProps);
        }
        return node;
    });
};
var resetParent = function (node, parent) {
    return resetNodesParent([node], parent)[0];
};
var resolveDesignerProps = function (node, props) {
    if (shared_1.isFn(props))
        return props(node);
    return props;
};
var TreeNode = /** @class */ (function () {
    function TreeNode(node, parent) {
        this.depth = 0;
        this.hidden = false;
        this.componentName = 'NO_NAME_COMPONENT';
        this.sourceName = '';
        this.props = {};
        this.children = [];
        if (node instanceof TreeNode) {
            return node;
        }
        this.id = node.id || shared_1.uid();
        if (parent) {
            this.parent = parent;
            this.depth = parent.depth + 1;
            this.root = parent.root;
            TreeNodes.set(this.id, this);
        }
        else {
            this.root = this;
            this.operation = node.operation;
            this.isSelfSourceNode = node.isSourceNode || false;
            TreeNodes.set(this.id, this);
        }
        if (node) {
            this.from(node);
        }
        this.makeObservable();
    }
    TreeNode.prototype.makeObservable = function () {
        reactive_1.define(this, {
            componentName: reactive_1.observable.ref,
            props: reactive_1.observable,
            hidden: reactive_1.observable.ref,
            children: reactive_1.observable.shallow,
            designerProps: reactive_1.observable.computed,
            designerLocales: reactive_1.observable.computed,
            wrap: reactive_1.action,
            prepend: reactive_1.action,
            append: reactive_1.action,
            insertAfter: reactive_1.action,
            insertBefore: reactive_1.action,
            remove: reactive_1.action,
            setProps: reactive_1.action,
            setChildren: reactive_1.action,
            setComponentName: reactive_1.action,
        });
    };
    Object.defineProperty(TreeNode.prototype, "designerProps", {
        get: function () {
            var _this = this;
            var behaviors = registry_1.GlobalRegistry.getDesignerBehaviors(this);
            var designerProps = behaviors.reduce(function (buf, pattern) {
                if (!pattern.designerProps)
                    return buf;
                Object.assign(buf, resolveDesignerProps(_this, pattern.designerProps));
                return buf;
            }, {});
            return designerProps;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TreeNode.prototype, "designerLocales", {
        get: function () {
            var behaviors = registry_1.GlobalRegistry.getDesignerBehaviors(this);
            var designerLocales = behaviors.reduce(function (buf, pattern) {
                if (!pattern.designerLocales)
                    return buf;
                internals_1.mergeLocales(buf, pattern.designerLocales);
                return buf;
            }, {});
            return designerLocales;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TreeNode.prototype, "previous", {
        get: function () {
            if (this.parent === this || !this.parent)
                return;
            return this.parent.children[this.index - 1];
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TreeNode.prototype, "next", {
        get: function () {
            if (this.parent === this || !this.parent)
                return;
            return this.parent.children[this.index + 1];
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TreeNode.prototype, "siblings", {
        get: function () {
            var _this = this;
            if (this.parent) {
                return this.parent.children.filter(function (node) { return node !== _this; });
            }
            return [];
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TreeNode.prototype, "index", {
        get: function () {
            if (this.parent === this || !this.parent)
                return 0;
            return this.parent.children.indexOf(this);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TreeNode.prototype, "descendants", {
        get: function () {
            return this.children.reduce(function (buf, node) {
                return buf.concat(node).concat(node.descendants);
            }, []);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TreeNode.prototype, "isRoot", {
        get: function () {
            return this === this.root;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TreeNode.prototype, "isInOperation", {
        get: function () {
            var _a;
            return !!((_a = this.root) === null || _a === void 0 ? void 0 : _a.operation);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TreeNode.prototype, "lastChild", {
        get: function () {
            return this.children[this.children.length - 1];
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TreeNode.prototype, "firstChild", {
        get: function () {
            return this.children[0];
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TreeNode.prototype, "isSourceNode", {
        get: function () {
            return this.root.isSelfSourceNode;
        },
        enumerable: false,
        configurable: true
    });
    TreeNode.prototype.getPrevious = function (step) {
        if (step === void 0) { step = 1; }
        return this.parent.children[this.index - step];
    };
    TreeNode.prototype.getAfter = function (step) {
        if (step === void 0) { step = 1; }
        return this.parent.children[this.index + step];
    };
    TreeNode.prototype.getSibling = function (index) {
        if (index === void 0) { index = 0; }
        return this.parent.children[index];
    };
    TreeNode.prototype.getParents = function (node) {
        var _node = node || this;
        return (_node === null || _node === void 0 ? void 0 : _node.parent) ? [_node.parent].concat(this.getParents(_node.parent))
            : [];
    };
    TreeNode.prototype.getParentByDepth = function (depth) {
        if (depth === void 0) { depth = 0; }
        var parent = this.parent;
        if ((parent === null || parent === void 0 ? void 0 : parent.depth) === depth) {
            return parent;
        }
        else {
            return parent === null || parent === void 0 ? void 0 : parent.getParentByDepth(depth);
        }
    };
    TreeNode.prototype.getMessage = function (token) {
        return registry_1.GlobalRegistry.getDesignerMessage(token, this.designerLocales);
    };
    TreeNode.prototype.isMyAncestor = function (node) {
        if (node === this || this.parent === node)
            return false;
        return node.contains(this);
    };
    TreeNode.prototype.isMyParent = function (node) {
        return this.parent === node;
    };
    TreeNode.prototype.isMyParents = function (node) {
        if (node === this)
            return false;
        return this.isMyParent(node) || this.isMyAncestor(node);
    };
    TreeNode.prototype.isMyChild = function (node) {
        return node.isMyParent(this);
    };
    TreeNode.prototype.isMyChildren = function (node) {
        return node.isMyParents(this);
    };
    TreeNode.prototype.takeSnapshot = function (type) {
        var _a;
        if ((_a = this.root) === null || _a === void 0 ? void 0 : _a.operation) {
            this.root.operation.snapshot(type);
        }
    };
    TreeNode.prototype.triggerMutation = function (event, callback, defaults) {
        var _a;
        if ((_a = this.root) === null || _a === void 0 ? void 0 : _a.operation) {
            var result = this.root.operation.dispatch(event, callback) || defaults;
            this.takeSnapshot(event === null || event === void 0 ? void 0 : event.type);
            return result;
        }
        else if (shared_1.isFn(callback)) {
            return callback();
        }
    };
    TreeNode.prototype.find = function (finder) {
        if (finder(this)) {
            return this;
        }
        else {
            var finded_1 = undefined;
            this.eachChildren(function (node) {
                if (finder(node)) {
                    finded_1 = node;
                    return false;
                }
            });
            return finded_1;
        }
    };
    TreeNode.prototype.findAll = function (finder) {
        var results = [];
        if (finder(this)) {
            results.push(this);
        }
        this.eachChildren(function (node) {
            if (finder(node)) {
                results.push(node);
            }
        });
        return results;
    };
    TreeNode.prototype.distanceTo = function (node) {
        if (this.root !== node.root) {
            return Infinity;
        }
        if (this.parent !== node.parent) {
            return Infinity;
        }
        return Math.abs(this.index - node.index);
    };
    TreeNode.prototype.crossSiblings = function (node) {
        if (this.parent !== node.parent)
            return [];
        var minIndex = Math.min(this.index, node.index);
        var maxIndex = Math.max(this.index, node.index);
        var results = [];
        for (var i = minIndex + 1; i < maxIndex; i++) {
            results.push(this.parent.children[i]);
        }
        return results;
    };
    TreeNode.prototype.allowSibling = function (nodes) {
        var _a, _b, _c;
        if (((_b = (_a = this.designerProps) === null || _a === void 0 ? void 0 : _a.allowSiblings) === null || _b === void 0 ? void 0 : _b.call(_a, this, nodes)) === false)
            return false;
        return (_c = this.parent) === null || _c === void 0 ? void 0 : _c.allowAppend(nodes);
    };
    TreeNode.prototype.allowDrop = function (parent) {
        if (!shared_1.isFn(this.designerProps.allowDrop))
            return true;
        return this.designerProps.allowDrop(parent);
    };
    TreeNode.prototype.allowAppend = function (nodes) {
        var _this = this;
        var _a, _b, _c;
        if (!((_a = this.designerProps) === null || _a === void 0 ? void 0 : _a.droppable))
            return false;
        if (((_c = (_b = this.designerProps) === null || _b === void 0 ? void 0 : _b.allowAppend) === null || _c === void 0 ? void 0 : _c.call(_b, this, nodes)) === false)
            return false;
        if (nodes.some(function (node) { return !node.allowDrop(_this); }))
            return false;
        if (this.root === this)
            return true;
        return true;
    };
    TreeNode.prototype.allowClone = function () {
        var _a;
        if (this === this.root)
            return false;
        return (_a = this.designerProps.cloneable) !== null && _a !== void 0 ? _a : true;
    };
    TreeNode.prototype.allowDrag = function () {
        var _a;
        if (this === this.root && !this.isSourceNode)
            return false;
        return (_a = this.designerProps.draggable) !== null && _a !== void 0 ? _a : true;
    };
    TreeNode.prototype.allowResize = function () {
        if (this === this.root && !this.isSourceNode)
            return false;
        var resizable = this.designerProps.resizable;
        if (!resizable)
            return false;
        if (resizable.width && resizable.height)
            return ['x', 'y'];
        if (resizable.width)
            return ['x'];
        return ['y'];
    };
    TreeNode.prototype.allowTranslate = function () {
        if (this === this.root && !this.isSourceNode)
            return false;
        var translatable = this.designerProps.translatable;
        if ((translatable === null || translatable === void 0 ? void 0 : translatable.x) && (translatable === null || translatable === void 0 ? void 0 : translatable.y))
            return true;
        return false;
    };
    TreeNode.prototype.allowDelete = function () {
        var _a;
        if (this === this.root)
            return false;
        return (_a = this.designerProps.deletable) !== null && _a !== void 0 ? _a : true;
    };
    TreeNode.prototype.findById = function (id) {
        var _a;
        if (!id)
            return;
        if (this.id === id)
            return this;
        if (((_a = this.children) === null || _a === void 0 ? void 0 : _a.length) > 0) {
            return TreeNodes.get(id);
        }
    };
    TreeNode.prototype.contains = function () {
        var _this = this;
        var nodes = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            nodes[_i] = arguments[_i];
        }
        return nodes.every(function (node) {
            if (node === _this ||
                (node === null || node === void 0 ? void 0 : node.parent) === _this ||
                (node === null || node === void 0 ? void 0 : node.getParentByDepth(_this.depth)) === _this) {
                return true;
            }
            return false;
        });
    };
    TreeNode.prototype.eachChildren = function (callback) {
        if (shared_1.isFn(callback)) {
            for (var i = 0; i < this.children.length; i++) {
                var node = this.children[i];
                if (callback(node) === false)
                    return;
                node.eachChildren(callback);
            }
        }
    };
    TreeNode.prototype.resetNodesParent = function (nodes, parent) {
        var _this = this;
        return resetNodesParent(nodes.filter(function (node) { return node !== _this; }), parent);
    };
    TreeNode.prototype.setProps = function (props) {
        var _this = this;
        return this.triggerMutation(new events_1.UpdateNodePropsEvent({
            target: this,
            source: null,
        }), function () {
            Object.assign(_this.props, props);
        });
    };
    TreeNode.prototype.setComponentName = function (componentName) {
        this.componentName = componentName;
    };
    TreeNode.prototype.prepend = function () {
        var _this = this;
        var nodes = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            nodes[_i] = arguments[_i];
        }
        if (nodes.some(function (node) { return node.contains(_this); }))
            return [];
        var originSourceParents = nodes.map(function (node) { return node.parent; });
        var newNodes = this.resetNodesParent(nodes, this);
        if (!newNodes.length)
            return [];
        return this.triggerMutation(new events_1.PrependNodeEvent({
            originSourceParents: originSourceParents,
            target: this,
            source: newNodes,
        }), function () {
            _this.children = newNodes.concat(_this.children);
            return newNodes;
        }, []);
    };
    TreeNode.prototype.append = function () {
        var _this = this;
        var nodes = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            nodes[_i] = arguments[_i];
        }
        if (nodes.some(function (node) { return node.contains(_this); }))
            return [];
        var originSourceParents = nodes.map(function (node) { return node.parent; });
        var newNodes = this.resetNodesParent(nodes, this);
        if (!newNodes.length)
            return [];
        return this.triggerMutation(new events_1.AppendNodeEvent({
            originSourceParents: originSourceParents,
            target: this,
            source: newNodes,
        }), function () {
            _this.children = _this.children.concat(newNodes);
            return newNodes;
        }, []);
    };
    TreeNode.prototype.wrap = function (wrapper) {
        var _this = this;
        if (wrapper === this)
            return;
        var parent = this.parent;
        return this.triggerMutation(new events_1.WrapNodeEvent({
            target: this,
            source: wrapper,
        }), function () {
            resetParent(_this, wrapper);
            resetParent(wrapper, parent);
            return wrapper;
        });
    };
    TreeNode.prototype.insertAfter = function () {
        var _this = this;
        var _a;
        var nodes = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            nodes[_i] = arguments[_i];
        }
        var parent = this.parent;
        if (nodes.some(function (node) { return node.contains(_this); }))
            return [];
        if ((_a = parent === null || parent === void 0 ? void 0 : parent.children) === null || _a === void 0 ? void 0 : _a.length) {
            var originSourceParents = nodes.map(function (node) { return node.parent; });
            var newNodes_1 = this.resetNodesParent(nodes, parent);
            if (!newNodes_1.length)
                return [];
            return this.triggerMutation(new events_1.InsertAfterEvent({
                originSourceParents: originSourceParents,
                target: this,
                source: newNodes_1,
            }), function () {
                parent.children = parent.children.reduce(function (buf, node) {
                    if (node === _this) {
                        return buf.concat([node]).concat(newNodes_1);
                    }
                    else {
                        return buf.concat([node]);
                    }
                }, []);
                return newNodes_1;
            }, []);
        }
        return [];
    };
    TreeNode.prototype.insertBefore = function () {
        var _this = this;
        var _a;
        var nodes = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            nodes[_i] = arguments[_i];
        }
        var parent = this.parent;
        if (nodes.some(function (node) { return node.contains(_this); }))
            return [];
        if ((_a = parent === null || parent === void 0 ? void 0 : parent.children) === null || _a === void 0 ? void 0 : _a.length) {
            var originSourceParents = nodes.map(function (node) { return node.parent; });
            var newNodes_2 = this.resetNodesParent(nodes, parent);
            if (!newNodes_2.length)
                return [];
            return this.triggerMutation(new events_1.InsertBeforeEvent({
                originSourceParents: originSourceParents,
                target: this,
                source: newNodes_2,
            }), function () {
                parent.children = parent.children.reduce(function (buf, node) {
                    if (node === _this) {
                        return buf.concat(newNodes_2).concat([node]);
                    }
                    else {
                        return buf.concat([node]);
                    }
                }, []);
                return newNodes_2;
            }, []);
        }
        return [];
    };
    TreeNode.prototype.insertChildren = function (start) {
        var _this = this;
        var _a;
        var nodes = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            nodes[_i - 1] = arguments[_i];
        }
        if (nodes.some(function (node) { return node.contains(_this); }))
            return [];
        if ((_a = this.children) === null || _a === void 0 ? void 0 : _a.length) {
            var originSourceParents = nodes.map(function (node) { return node.parent; });
            var newNodes_3 = this.resetNodesParent(nodes, this);
            if (!newNodes_3.length)
                return [];
            return this.triggerMutation(new events_1.InsertChildrenEvent({
                originSourceParents: originSourceParents,
                target: this,
                source: newNodes_3,
            }), function () {
                _this.children = _this.children.reduce(function (buf, node, index) {
                    if (index === start) {
                        return buf.concat(newNodes_3).concat([node]);
                    }
                    return buf.concat([node]);
                }, []);
                return newNodes_3;
            }, []);
        }
        return [];
    };
    TreeNode.prototype.setChildren = function () {
        var _this = this;
        var nodes = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            nodes[_i] = arguments[_i];
        }
        var originSourceParents = nodes.map(function (node) { return node.parent; });
        var newNodes = this.resetNodesParent(nodes, this);
        return this.triggerMutation(new events_1.UpdateChildrenEvent({
            originSourceParents: originSourceParents,
            target: this,
            source: newNodes,
        }), function () {
            _this.children = newNodes;
            return newNodes;
        }, []);
    };
    /**
     * @deprecated
     * please use `setChildren`
     */
    TreeNode.prototype.setNodeChildren = function () {
        var nodes = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            nodes[_i] = arguments[_i];
        }
        return this.setChildren.apply(this, __spread(nodes));
    };
    TreeNode.prototype.remove = function () {
        var _this = this;
        return this.triggerMutation(new events_1.RemoveNodeEvent({
            target: this,
            source: null,
        }), function () {
            removeNode(_this);
            TreeNodes.delete(_this.id);
        });
    };
    TreeNode.prototype.clone = function (parent) {
        var newNode = new TreeNode({
            id: shared_1.uid(),
            componentName: this.componentName,
            sourceName: this.sourceName,
            props: reactive_1.toJS(this.props),
            children: [],
        }, parent ? parent : this.parent);
        newNode.children = resetNodesParent(this.children.map(function (child) {
            return child.clone(newNode);
        }), newNode);
        return this.triggerMutation(new events_1.CloneNodeEvent({
            target: this,
            source: newNode,
        }), function () { return newNode; });
    };
    TreeNode.prototype.from = function (node) {
        var _this = this;
        if (!node)
            return;
        return this.triggerMutation(new events_1.FromNodeEvent({
            target: this,
            source: node,
        }), function () {
            var _a, _b, _c;
            if (node.id && node.id !== _this.id) {
                TreeNodes.delete(_this.id);
                TreeNodes.set(node.id, _this);
                _this.id = node.id;
            }
            if (node.componentName) {
                _this.componentName = node.componentName;
            }
            _this.props = (_a = node.props) !== null && _a !== void 0 ? _a : {};
            if (node.hidden) {
                _this.hidden = node.hidden;
            }
            if (node.children) {
                _this.children =
                    ((_c = (_b = node.children) === null || _b === void 0 ? void 0 : _b.map) === null || _c === void 0 ? void 0 : _c.call(_b, function (node) {
                        return new TreeNode(node, _this);
                    })) || [];
            }
        });
    };
    TreeNode.prototype.serialize = function () {
        return {
            id: this.id,
            componentName: this.componentName,
            sourceName: this.sourceName,
            props: reactive_1.toJS(this.props),
            hidden: this.hidden,
            children: this.children.map(function (treeNode) {
                return treeNode.serialize();
            }),
        };
    };
    TreeNode.create = function (node, parent) {
        return new TreeNode(node, parent);
    };
    TreeNode.findById = function (id) {
        return TreeNodes.get(id);
    };
    return TreeNode;
}());
exports.TreeNode = TreeNode;
