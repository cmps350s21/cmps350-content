// Named Exports
export const add = (x, y) => x + y;
export const multiply = (x, y) => x * y;

// Another way of doing it
//export {add, multiply}

class UserIdGenerator {
    #prefix = 99;
    next() {
        this.#prefix++;
        return `${this.#prefix}${new Date().getFullYear()}`;
    }
}
// Default Export
export default new UserIdGenerator();