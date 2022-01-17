export default class Input {
    #type;
    #label;
    #name;
    constructor(type, label, name) {
        if (this.constructor == Input) {
            throw new TypeError('Abstract class "Input" cannot be instantiated directly');
        }
        this.#type = type;
        this.#label = label;
        this.#name = name;
    }

    get_type() {
        return this.#type;
    }

    get_label() {
        return this.#label;
    }

    get_name() {
        return this.#name;
    }

    set_label(label){
        this.#label= label;
    }

    set_name(name){
        this.#name= name;
    }
}