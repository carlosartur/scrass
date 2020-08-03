export class Clonable {

    /**
     * 
     */
    __class = null;

    /**
     * @param {Object} obj 
     */
    constructor(obj) {
        Object.assign(this, obj);
        this.__class = new.target;
    }

    /**
     * @method
     */
    clone(config = {}) {
        let clone = new this.__class(this);
        Object.assign(clone, this, config);
        return clone;
    }

    /**
     * Use this method as constructor for classes that extends clonable
     * @method  
     */
    init() {
        return this;
    }
}