
!(function(win) {

// ------------------------------------------------------------------------------------------------------------------ //
    // Helper methods
// ------------------------------------------------------------------------------------------------------------------ //

    /**
     * Simple Method that can auto generate random string with specific length
     *
     * @private
     * @param {Number|null} size for generated string, default size is 5
     * @returns {string} random generated string
     */
    let _generateRandomString = function (size) {
        let text = "";
        let possibleStart = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz_";
        let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_";
        size = typeof size === 'number' ? (size > 0 ? size : 5) : 5;
        text += possibleStart.charAt(Math.floor(Math.random() * possibleStart.length));
        for(let k = 1; k < size; k++) {
            text += possible.charAt(Math.floor(Math.random() * possible.length));
        }
        return text;
    };

// ------------------------------------------------------------------------------------------------------------------ //
    // DblLNode CLASS
// ------------------------------------------------------------------------------------------------------------------ //

    /**
     * DblLNode class that will represent our node element and will hold our data
     *
     * @class DblLNode
     */
    class DblLNode {
        constructor (data) {
            this.id = _generateRandomString(8);
            this.data = data;
            this.prev = null;
            this.next = null;
            this.parentList = null;
        }
    }


// ------------------------------------------------------------------------------------------------------------------ //
    // DblLNodeList CLASS
// ------------------------------------------------------------------------------------------------------------------ //

    /**
     * DblLNodeList class that will manage and hold node elements
     *
     * @class DblLNodeList
     */
    class DblLNodeList {

        /**
         * 'DblLNodeList' constructor, called on object creation
         */
        constructor() {
            this.headNode = null;
            this.tailNode = null;
            this.count = 0;
            this._iterator = null;
            this._startedIteration = false;

            /**
             * DblLNodeList id. Will get provided id or generate random 8 character string id
             * @type {*|String}
             */
            this.id = _generateRandomString(8);
        }

        /**
         * Check if provided node object is valid 'DblLNodeList' object
         *
         * @param {DblLNode} node - argument to check
         * @returns {boolean} - true if provided argument is not null and of type 'DblLNode'
         */
        static isValidNode(node) {
            return !!node && node instanceof DblLNode;
        }

        /**
         * Is this double linked list empty - has no node elements
         *
         * @returns {boolean} - true if list has no elements
         */
        isEmpty() {
            return this.headNode === this.tailNode && this.tailNode === null;
        }

        /**
         * Check if provided node exist as a chained node in this list
         *
         * @param {DblLNode} node - provided node to check
         * @returns {boolean} - true if node exist as a part of the list
         */
        exist (node) {
            if (!DblLNodeList.isValidNode(node)) {
                console.log("[exist][Error] Provided 'node' object is invalid!");
                return false;
            }
            if (node.parentList !== this || this.isEmpty()) {
                return false;
            }
            let iterator = this.headNode;
            while (iterator !== null) {
                if (iterator === node) {
                    return true;
                }
                iterator = iterator.next;
            }
            return false;
        }

        /**
         * Create new 'DblLNode' object and add it to list
         *
         * @param data
         * @returns {DblLNode} - return new created and added node element
         */
        create (data) {
            if (this._startedIteration) {
                console.log("[create][Error] Can't do action while iteration process is active! Please stop iteration and then call tree action again!");
                return null;
            }
            let node = new DblLNode(data);
            this.push(node);
            return node;
        }

        /**
         * Create and add array of 'DblLNode' elements
         *
         * @param {Array<Object>} dataArr - array of objects that describe node elements
         * @param {Function|null} callback - method to call after all node elements are created
         * @param {Boolean} returnArrayNodes - array of new created node elements or 'DblLNodeList' reference
         * @returns {Array<DblLNode>|DblLNodeList} returnArrayNodes - array of new created node elements or self reference
         */
        createBatch (dataArr, callback, returnArrayNodes) {
            if (this._startedIteration) {
                console.log("[createBatch][Error] Can't do action while iteration process is active! Please stop iteration and then call tree action again!");
                return null;
            }
            callback = typeof callback === "function" ? callback : function () {};
            if (returnArrayNodes === true) {
                let nodeArr = [];
                if (Array.isArray(dataArr)) {
                    for (let k = 0; k < dataArr.length; ++k) {
                        nodeArr.push(this.create(dataArr[k]));
                        callback(nodeArr[nodeArr.length-1]);
                    }
                } else if (!!dataArr) {
                    nodeArr.push(this.create(dataArr));
                    callback(nodeArr[nodeArr.length-1]);
                }
                return nodeArr;
            } else {
                if (Array.isArray(dataArr)) {
                    for (let k = 0; k < dataArr.length; ++k) {
                        let node = this.create(dataArr[k]);
                        callback(node);
                    }
                } else if (!!dataArr) {
                    let node = this.create(dataArr);
                    callback(node);
                }
                return this;
            }
        }

        /**
         * Add new node element at the end of the list
         *
         * @param {DblLNode} node - nod element to add
         * @returns {DblLNode|null} - if all good will return provided node element or null
         */
        push (node) {
            if (this._startedIteration) {
                console.log("[push][Error] Can't do action while iteration process is active! Please stop iteration and then call tree action again!");
                return null;
            }
            if (Array.isArray(node)) {
                for (let k = 0; k < node.length; ++k) {
                    this.push(node[k]);
                }
                return node;
            }
            if (!DblLNodeList.isValidNode(node)) {
                console.log("[push][Error] Provided 'node' object is invalid!");
                return null;
            }
            if (node === this.tailNode) {
                return node;
            }
            if (!!node.parentList) {
                node.parentList.remove(node);
            }
            if (this.isEmpty()) {
                this.headNode = node;
                this.tailNode = node;
                node.prev = null;
                node.next = null;
            } else {
                node.prev = this.tailNode;
                this.tailNode.next = node;
                node.next = null;
                this.tailNode = node;
            }
            node.parentList = this;
            this.count++;
            return node;
        }

        /**
         * Insert node element at the beginning of the list, as first element in the list
         *
         * @param {DblLNode} node - node element to insert
         * @returns {DblLNode|null} - if all good will return provided node element or null
         */
        insert (node) {
            if (this._startedIteration) {
                console.log("[insert][Error] Can't do action while iteration process is active! Please stop iteration and then call tree action again!");
                return null;
            }
            if (Array.isArray(node)) {
                for (let k = 0; k < node.length; ++k) {
                    this.insert(node[k]);
                }
                return node;
            }
            if (!DblLNodeList.isValidNode(node)) {
                console.log("[insert][Error] Provided 'node' object is invalid!");
                return null;
            }
            if (node === this.headNode) {
                return node;
            }
            if (!!node.parentList) {
                node.parentList.remove(node);
            }
            if (this.isEmpty()) {
                this.headNode = node;
                this.tailNode = node;
                node.prev = null;
                node.next = null;
            } else {
                node.next = this.headNode;
                this.headNode.prev = node;
                node.prev = null;
                this.headNode = node;
            }
            node.parentList = this;
            this.count++;
            return node;
        }

        /**
         * Insert provided node before the second provided node 'nodeBefore'
         *
         * @param {DblLNode} node - node element we want to insert
         * @param {DblLNode} nodeBefore - node element we will insert before
         * @returns {DblLNode|null} - if all good will return provided node element or null
         */
        insertBefore (node, nodeBefore) {
            if (this._startedIteration) {
                console.log("[insertBefore][Error] Can't do action while iteration process is active! Please stop iteration and then call tree action again!");
                return null;
            }
            if (Array.isArray(node)) {
                for (let k = 0; k < node.length; ++k) {
                    this.insertBefore(node[k], nodeBefore);
                }
                return node;
            }
            if (!DblLNodeList.isValidNode(node)) {
                console.log("[insertBefore][Error] Provided 'node' object is invalid!");
                return null;
            }
            if (node === nodeBefore) {
                return node;
            }
            if (DblLNodeList.isValidNode(nodeBefore) && nodeBefore.parentList !== this) {
                console.log("[insertBefore][Error] Can't insert node before element from other list!");
                return null;
            }
            if (node.parentList !== null) {
                node.parentList.remove(node);
            }
            if (!nodeBefore || nodeBefore === this.headNode || this.isEmpty()) {
                return this.insert(node);
            } else {
                node.next = nodeBefore;
                node.prev = nodeBefore.prev;
                nodeBefore.prev.next = node;
                nodeBefore.prev = node;
                if (nodeBefore === this.headNode) {
                    this.headNode = node;
                }
            }
            node.parentList = this;
            this.count++;
            return node;
        }

        /**
         * Insert provided node element after second provided node element 'nodeAfter'
         *
         * @param {DblLNode} node - node element we want to insert
         * @param {DblLNode} nodeAfter - node element we will insert after
         * @returns {DblLNode|null} - if all good will return provided node element or null
         */
        insertAfter (node, nodeAfter) {
            if (this._startedIteration) {
                console.log("[insertAfter][Error] Can't do action while iteration process is active! Please stop iteration and then call tree action again!");
                return null;
            }
            if (Array.isArray(node)) {
                for (let k = 0; k < node.length; ++k) {
                    this.insertAfter(node[k], nodeAfter);
                }
                return node;
            }
            if (!DblLNodeList.isValidNode(node)) {
                console.log("[insertAfter][Error] Provided 'node' object is invalid!");
                return null;
            }
            if (node === nodeAfter) {
                return node;
            }
            if (DblLNodeList.isValidNode(nodeAfter) && nodeAfter.parentList !== this) {
                console.log("[insertAfter][Error] Can't insert node after element from other list!");
                return null;
            }
            if (node.parentList !== null) {
                node.parentList.remove(node);
            }
            if (!nodeAfter || nodeAfter === this.tailNode || this.isEmpty()) {
                return this.push(node);
            } else {
                node.prev = nodeAfter;
                node.next = nodeAfter.next;
                nodeAfter.next.prev = node;
                nodeAfter.next = node;
                if (nodeAfter === this.tailNode) {
                    this.tailNode = node;
                }
            }
            node.parentList = this;
            this.count++;
            return node;
        }

        /**
         * Insert provided node at specific index
         *
         * @param {DblLNode} node - node element we want to insert
         * @param {Number} index - on which position we will put provided node
         * @returns {DblLNode|null} return provided element if all good or null
         */
        insertAt (node, index) {
            if (this._startedIteration) {
                console.log("[Error] Can't do action while iteration process is active! Please stop iteration and then call tree action again!");
                return null;
            }
            if (Array.isArray(node)) {
                for (let k = 0; k < node.length; ++k) {
                    this.insertAt(node[k], index);
                }
                return node;
            }
            if (!DblLNodeList.isValidNode(node)) {
                console.log("[insertAt][Error] Provided 'node' object is invalid!");
                return null;
            }
            let elemNode = this.elementAt(index);
            return !!elemNode ? this.insertBefore(node, elemNode) : null;
        }

        /**
         * Get current index position of provided node element
         *
         * @param {DblLNode} node - node element we want to get index position
         * @returns {number} - return -1 if node not found or index of current node position
         */
        indexOf (node) {
            if (!DblLNodeList.isValidNode(node) || node.parentList !== this || this.isEmpty()) {
                return -1;
            }
            let k = 0;
            let iterator = this.headNode;
            while (iterator !== null) {
                if (iterator === node) {
                    return k;
                }
                k++;
                iterator = iterator.next;
            }
            return -1;
        }

        /**
         * Get node element by data value
         *
         * @param {*} data - any data type
         * @returns {DblLNode|null} retrun DblLNode if found or null if not found
         */
        elementByData (data) {
            let iterator = this.headNode;
            while (iterator !== null) {
                if (iterator.data === data) {
                    return iterator;
                }
                iterator = iterator.next;
            }
            return null;
        }

        /**
         * Get all node elements by provided data value
         *
         * @param {*} data - any data type
         * @returns {Array<DblLNode>|null} retrun array of DblLNode or null if no node is found
         */
        elementByDataAll (data) {
            let res = [];
            let iterator = this.headNode;
            while (iterator !== null) {
                if (iterator.data === data) {
                    res.push(iterator);
                }
                iterator = iterator.next;
            }
            return res.length > 0 ? res : null;
        }

        /**
         * Get node element at specific position
         *
         * @param {Number} index - on what index position we want to get node element
         * @returns {DblLNode|null} return node element if found or null
         */
        elementAt (index) {
            if (typeof index !== "number" || index < 0 || this.isEmpty()) {
                return null;
            }
            let k = 0;
            let iterator = this.headNode;
            while (iterator !== null) {
                if (k == index) {
                    return iterator;
                }
                k++;
                iterator = iterator.next;
            }
            return null;
        }

        /**
         * Get and remove (from the list) latest node element
         *
         * @returns {DblLNode|null} latest node element or null
         */
        pop () {
            if (this._startedIteration) {
                console.log("[Error] Can't do action while iteration process is active! Please stop iteration and then call tree action again!");
                return null;
            }
            return this.remove(this.tailNode);
        }

        /**
         * Get and remove (from the list) first node element
         *
         * @returns {DblLNode|null} first node element or null
         */
        shift () {
            if (this._startedIteration) {
                console.log("[Error] Can't do action while iteration process is active! Please stop iteration and then call tree action again!");
                return null;
            }
            return this.remove(this.headNode);
        }

        /**
         * Remove node from list
         *
         * @param {DblLNode|Array<DblLNode>} node - provided node element we want to remove
         * @returns {DblLNode|null} return removed node element or null
         */
        remove (node) {
            if (this._startedIteration) {
                console.log("[Error] Can't do action while iteration process is active! Please stop iteration and then call tree action again!");
                return null;
            }
            if (Array.isArray(node)) {
                for (let k = 0; k < node.length; ++k) {
                    this.remove(node[k]);
                }
                return node;
            }
            if (!DblLNodeList.isValidNode(node)) {
                console.log("[remove][Error] Provided 'node' object is invalid!");
                return null;
            }
            if (this.isEmpty() || node.parentList !== this) {
                return null;
            }
            if (this.headNode === node && this.tailNode === node) {
                this.headNode = null;
                this.tailNode = null;
            } else if (this.headNode === node) {
                this.headNode = node.next;
                this.headNode.prev = null;
            } else if (this.tailNode === node) {
                this.tailNode = node.prev;
                this.tailNode.next = null;
            } else {
                node.prev.next = node.next;
                node.next.prev = node.prev;
            }
            node.parentList = null;
            node.next = null;
            node.prev = null;
            this.count--;
            return node;
        }

        /**
         * Remove node element at specific index position
         *
         * @param {Number} index - position to remove element at
         * @returns {DblLNode|null} return removed node element or null
         */
        removeAt (index) {
            if (this._startedIteration) {
                console.log("[Error] Can't do action while iteration process is active! Please stop iteration and then call tree action again!");
                return null;
            }
            let node = this.elementAt(index);
            if (!!node) {
                return this.remove(node);
            }
            return null;
        }

        /**
         * Remove all node elements from list
         *
         * @param {Boolean|null} returnArrayNodes - do you want to have array of removed nodes
         * @returns {Array<DblLNode>|DblLNodeList} - return array of removed elements or self reference
         */
        removeAll (returnArrayNodes) {
            let iterator = this.headNode;
            let prevNode = null;
            if (returnArrayNodes === true) {
                let resArr = [];
                while (iterator !== null) {
                    prevNode = iterator;
                    iterator = iterator.next;
                    resArr.push(prevNode);
                    this.remove(prevNode);
                }
                return resArr
            } else {
                while (iterator !== null) {
                    prevNode = iterator;
                    iterator = iterator.next;
                    this.remove(prevNode);
                }
            }
            return this;
        }

        /**
         * Reverse the order of elements so first will become last and the last will be first (including all other elements)
         *
         * @returns {DblLNodeList} - return self reference
         */
        reverse () {
            if (this.isEmpty() || this.headNode === this.tailNode) {
                return this;
            }
            let head = this.headNode;
            let tail = this.tailNode;
            let pom = null;
            while (head !== tail) {
                if (head.prev === null) {
                    head.prev = tail;
                    tail.next = head;
                    tail = tail.prev;
                } else {
                    pom = tail.prev;
                    head.prev.next = tail;
                    tail.prev = head.prev;
                    tail.next = head;
                    head.prev = tail;
                    tail = pom;
                }
            }
            pom = this.headNode;
            this.headNode = this.tailNode;
            this.tailNode = pom;
            this.headNode.prev = null;
            this.tailNode.next = null;
            return this;
        }

        /**
         * Iterate all node elements and call provided callback method with current node element
         *
         * @param {Function} callback - callback method that will be called on each node iteration
         * @returns {DblLNodeList} - return self reference
         */
        each (callback) {
            if (typeof callback !== "function" || this.isEmpty()) {
                return this;
            }
            let iterator = this.headNode;
            while (iterator !== null) {
                let res = callback(iterator);
                if (res === true) {
                    return this;
                }
                iterator = iterator.next;
            }
            return this;
        }

        /**
         * Call this method to start manuel node elements iteration
         *
         * @returns {boolean} - true if iteration can start, false otherwise
         */
        startIteration () {
            if (this.isEmpty()) {
                return false;
            }
            this._iterator = this.headNode;
            this._startedIteration = true;
            return true;
        }

        /**
         * Call this method to stop manuel iteration
         *
         * @returns {DblLNodeList} - return self reference
         */
        stopIteration () {
            this._iterator = null;
            this._startedIteration = false;
            return this;
        }

        /**
         * Do we have more node elements for iteration
         *
         * @returns {boolean} - true if we have more node elements for iteration
         */
        haveNext () {
            return this._startedIteration && !!this._iterator;
        }

        /**
         * Get next node element
         *
         * @returns {DblLNode} - return next element we iterate
         */
        nextElement () {
            if (!this._startedIteration || !this._iterator) {
                return null;
            }
            let next = this._iterator;
            this._iterator = this._iterator.next;
            return next;
        }

        /**
         * Return node list in array representation
         *
         * @returns {Array<DblLNode>} - return array of node elements
         */
        toArray () {
            if (this.isEmpty()) {
                return [];
            }
            let res = [];
            let iterator = this.headNode;
            while (iterator !== null) {
                res.push(iterator);
                iterator = iterator.next;
            }
            return res;
        }

        /**
         * Return array representation of node elements data
         *
         * @returns {Array<Object>} - return array of node elements data
         */
        toArrayData () {
            if (this.isEmpty()) {
                return [];
            }
            let res = [];
            let iterator = this.headNode;
            while (iterator !== null) {
                res.push(iterator.data);
                iterator = iterator.next;
            }
            return res;
        }
    }

    win.DblLNode = DblLNode; // jshint ignore:line
    win.DblLNodeList = DblLNodeList; // jshint ignore:line

    let exports = {DblLNodeList, DblLNode};

// Expose to CJS & AMD
    if ((typeof define)[0] === 'f') define(function() { return exports; });
    else if ((typeof module)[0] === 'o') module.exports = exports;

})( typeof window !== 'undefined' ? window : this);

