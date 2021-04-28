
export class GameDifficultySettings {
    public Junior = new GameDifficultySetting(8, 8, 10);
    public Senior = new GameDifficultySetting(16, 16, 40);
    public Master = new GameDifficultySetting(32, 16, 99);
}

export class GameDifficultySetting {
    constructor(public x: number, public y: number, public bombs: number) {
    }
}