class CallSystem {
    constructor(ids) {
        this.ids = ids; 
    }

    nextId() {
        return this.ids.shift(); 
    }

    hasNext() {
        return this.ids.length > 0; 
    }
}
