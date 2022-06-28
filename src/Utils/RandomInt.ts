
export class RandomInt {
    static getRandomInt() {
        return Math.floor(Math.random());
    }

    static getRandomIntOnInterval(min: number, max: number, includeEnds: boolean = true) {
        let end = 0;
        if (includeEnds) end = 1;
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + end)) + min;
    }
}

