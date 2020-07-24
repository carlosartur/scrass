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
    clone() {
        return new this.__class(this);
    }

    /**
     * Use this method as constructor for classes that extends clonable
     * @method  
     */
    init() {
        return this;
    }
}