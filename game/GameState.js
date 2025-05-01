export const GameState = {
    inventory: [], // Persistent inventory
    score: 0, // Persistent score
    health: 100, // Example of a shared property
    addItem(item) {
        this.inventory.push(item);
    },
    removeItem(item) {
        const index = this.inventory.indexOf(item);
        if (index > -1) {
            this.inventory.splice(index, 1);
        }
    },
    updateScore(amount) {
        this.score += amount;
    }
};