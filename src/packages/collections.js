import _ from 'lodash'

const collections = {
    create,
    collect
}

export {
    collections
}

/**
 * Simple alias for create()
 * 
 * @param {object|array} subject Array or object.
 */
function collect(subject) {
    return create(subject)
}

function create(subjectArray) {
    return createCollection(subjectArray)
}

/**
 * Creating the collection holds our subjectArray
 * in the function scope.
 *
 * Each function, once run, returns the public API
 * so subsequent methods can chain off the one
 * before it.
 *
 * Finish the chain with a get() to return the
 * final, transformed value.
 *
 * Example usage:
 *
 * const myCollection = tbuiCollection.create(myArr)
 *
 * myCollection.filter('name', 'Patrick').groupBy('ID').get()
 *
 * This will return all the items in the array with a name === Patrick and group them
 * into an object with the keys set to ID.
 *
 * @param {array} subjectArray The array to form into a collection.
 * @returns {object} Returns the publicAPI which holds our chainable functions.
 */
function createCollection(subjectArray) {

    let collection = subjectArray

    const publicAPI = {
        clone,
        cloneDeep,
        compact,
        valuesIn,
        sortBy,
        reverse,
        diff,
        flatMap,
        uniq,
        groupBy,
        keyBy,
        gather,
        filter,
        take,
        mergeArrays,
        toArray,
        alphaSort,
        flatten,
        flattenSubArrays,
        addToEach,
        insert,
        splice,
        extractToEach,
        map,
        addOrRemoveObj,
        addOrRemove,
        get,
        isObject
    }

    return publicAPI

    /**
     * Ideal for cloning server responses to avoid
     * mutations by reference.
     * 
     * NOT suitable for objects that would include
     * the following:
     * array buffers, buffers, dates, maps, nulls, regexes, 
     * sets, symbols, typed arrays, boolean/number/string objects, 
     * and circular references
     */
    function clone() {
        collection = JSON.parse(JSON.stringify(collection))

        return publicAPI
    }

    /**
     * lodash _.compact wrapper
     */

    function cloneDeep() {
        collection = _.cloneDeep(collection)

        return publicAPI
    }

    function compact() {
        collection = _.compact(collection)

        return publicAPI
    }

    function valuesIn() {
        collection = _.valuesIn(collection)

        return publicAPI
    }

    function sortBy(prop) {

        collection = _.sortBy(collection, item => item[prop])

        return publicAPI
    }

    function reverse() {
        collection = _.reverse(collection)

        return publicAPI
    }

    function diff(...arr) {

        const diffAgainst = _.flatten(arr)

        collection = _.xor( collection, diffAgainst)

        return publicAPI
    }

    function flatMap(fn) {

        collection = _.flatMap(collection, fn)

        return publicAPI
    }

    function uniq() {
        collection = _.uniq(collection)

        return publicAPI
    }

    function flatten() {
        collection = _.flatten(...collection)

        return publicAPI
    }

    /**
     * Group an array into an object with keys set to a common property.
     *
     * @param {string} prop The property by which to group the objects.
     * @param {object} propMap Optional - rename some props as you're grouping.
     * @returns {*} Returns the public API to continue chaining.
     */
    function groupBy(prop, propMap = null) {

        if (isObj(collection)) {

            _nestedGroupBy(collection, prop, propMap)

            return publicAPI
        }

        collection = collection.reduce((carry, item) => {

            let key = item[prop]

            /*
             * rename our property if it's found on the option hash.
             * Not all values we want to groupBy are going to be nice,
             * so we rename them here.
             * */
            if (propMap !== null && propMap[key]) {
                key = propMap[key]
            }

            // initiate the array if this is the first time through for this key
            if (!carry[key]) {
                carry[key] = []
            }

            carry[key].push(item)

            return carry
        }, {})

        return publicAPI
    }

    /**
     * keyBy
     * 
     */
    function keyBy(prop, propMap = null) {

        collection = collection.reduce((carry, item) => {

            let key = item[prop]

            /*
             * rename our property if it's found on the option hash.
             * Not all values we want to groupBy are going to be nice,
             * so we rename them here.
             * */
            if (propMap !== null && propMap[key]) {
                key = propMap[key]
            }

            // initiate the array if this is the first time through for this key
            if (!carry[key]) {
                carry[key] = {}
            }

            carry[key] = item

            return carry
        }, {})

        return publicAPI
    }

    function _nestedGroupBy(data, groupByProp, propMap) {

        // We'll use the object keys to iterate over the obj.
        const props = Object.keys(data)

        // iterate over each prop, and hopefully we find an array.
        collection = props.reduce((finalObj, prop) => {

            if (isObj(collection[prop])) {

                tbscLog($log.error("Obj is too deep. Cannot group by on this collection.", collection))

                return
            }

            /*
             * To a new empty obj we re-add our key / property, and add
             * in the sub objects using the desired groupBy key - groupByProp.
             * */
            finalObj[prop] = collection[prop].reduce((carry, subObj) => {

                // More readable renaming this here:
                let nestedProp = subObj[groupByProp]

                /*
                 * rename our property if it's found on the option hash.
                 * Not all values we want to groupBy are going to be nice,
                 * so we rename them here.
                 * */
                if (propMap !== null && propMap[nestedProp]) {
                    nestedProp = propMap[nestedProp]
                }

                /*
                 * initialize the nested array if this is
                 * the first obj we're adding to it.
                 * */
                if (!carry[nestedProp]) {
                    carry[nestedProp] = []
                }

                carry[nestedProp].push(subObj)

                return carry
            }, {})

            /*
             * this is our newly built obj that maintains our top-level props
             * and nested a new set of objects grouped by a new prop.
             * This replaces our function-scoped collection variable that will
             * ultimately be returned on get()
             * */
            return finalObj

        }, {})

        return publicAPI
    }

    function gather(prop, value) {

        collection = collection.filter((item) => {
            return item[prop] === value
        })

        return publicAPI
    }

    function filter(fn) {
        collection = collection.filter(fn)

        return publicAPI
    }

    function take(count = 1) {

        if (count < 1) {
            collection = collection.slice(count)
        } else {
            collection = collection.slice(0, count)
        }

        return publicAPI
    }

    function mergeArrays(...arr) {
        collection = [...arr, ...collection]

        collection = collection.reduce((carry, item) => {
            if (!item) return carry

            carry = carry.concat(item)

            return carry
        }, [])

        return publicAPI
    }

    /**
     * Create an array from first-level
     * object property values.
     *
     * Useful when you have an object of
     * objects and you need to use array
     * functions to deal with the list.
     *
     * @returns {[]} Returns an array with those props mapped to an array.
     */
    function toArray() {
        var propsArr = Object.keys(collection);

        if (!isObj) {
            console.error('tbuiCollection - collection is already an array.', collection)
            return get()
        }

        collection = propsArr.reduce((newArr, prop) => {
            newArr.push(collection[prop])

            return newArr
        }, [])

        return publicAPI
    }

    function alphaSort() {
        collection = collection.sort((a, b) => {
            if (a.longName < b.longName) return -1
            if (a.longName > b.longName) return 1
            return 0
        })

        return publicAPI
    }

    /**
     * Recursively Flatten a given array found at any depth.
     * 
     * ie: Used to pull out ALL child intel and create a single array with all
     * intel pieces.
     * 
     * @param {string} prop Prop pointing to the src array
     * @param {array} arr Sub array or collection on first pass. 
     */
    function flattenSubArrays(prop, arr = collection) {

        collection = arr.reduce((newArr, item) => {

            // Get all subArrays and add those to newArr, too.
            if (item.hasOwnProperty(prop) && item[prop].length > 0) {
                // recursively call flattenSubArrays to get at ALL subarrays
                flattenSubArrays(prop, item[prop])
                    // take each item of that sub array and add it to our master array.
                    .map(arr => newArr.push(arr))
            }

            // Also push main item onto newArr
            newArr.push(item)

            return newArr

        }, [])

        return publicAPI
    }

    function addToEach(prop, value) {
        collection = collection.map(item => {
            item[prop] = value
            return item
        })

        return publicAPI
    }

    function insert(idx, ...items) {
        
        collection.splice(idx, 0, items)

        collection = _.flatten(collection)

        return publicAPI
    }

    function splice(idx, count, ...items) {
        collection.splice(idx, count)

        items.forEach(item => {
            collection.splice(idx, 0, item)
        })

        return publicAPI
    }

    /**
     * Extract all values from a given array property.
     * 
     * Function will recursively search the array and bring
     * all values to the top level.
     * 
     * @param {string} src The source array property to search.
     * @param {prop} prop The src property which has the desired value
     * @param {string} target The new property to hold the returned array of values
     * @return {object} Returns the publicAPI
     */
    function extractToEach(src, prop, target) {

        collection = collection.map(item => {
            item[target] = item[src].length > 0 ? getProp(item[src]) : ''

            return item

            function getProp(subArray) {
                const result = []

                subArray.forEach(getValue)

                // Call recursively until we're out of sub items.
                function getValue(subItem) {
                    result.push(subItem[prop])

                    if (subItem[src].length > 0) {
                        subItem[src].forEach(getValue)
                    }
                }

                return result
            }
        })

        return publicAPI
    }

    function map(fn) {

        collection = collection.map(fn)

        return publicAPI
    }

    function addOrRemoveObj(obj, prop, value) {

        if (collection.findIndex(item => item[prop] === value) === -1) {
            collection = collection.push(obj)
        } else {
            collection = collection.filter(item => item[prop] === value)
        }

        return publicAPI
    }

    function addOrRemove(selectedItem) {

        if (collection.indexOf(selectedItem) === -1) {
            collection.push(selectedItem)
        } else {
            collection = collection.filter(item => item == selectedItem)
        }

        return publicAPI
    }
    function get() {
        return collection
    }

    function isObject() {

        const toClass = {}.toString

        const test = toClass.call(collection)

        return test.indexOf('Object') !== -1
    }

    /* =============================================
     *
     * PRIVATE FUNCTIONS - You shall not pass.
     *
     * ‘(◣_◢)’
     *
     * {}oo((X))ΞΞΞΞΞΞΞΞΞΞΞΞΞ>
     *
     * =============================================
     * */

    function isObj(data) {

        const toClass = {}.toString

        const test = toClass.call(data)

        return test.indexOf('Object') !== -1
    }

}