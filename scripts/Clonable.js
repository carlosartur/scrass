export class Clonable {
    
    /**
     * 
     */
    __class = null;
    
    /**
     * @param {*} obj 
     */
    constructor(obj) {
        Object.assign(this, obj);
        this.__class = new.target;
    }

    /**
     * 
     */
    clone() {
        return new this.__class(this);
    }
}