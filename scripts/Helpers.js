export const intRandom = (min = false, max = false) => {
    let rand = parseInt(String(Math.random()).split('.').pop());

    if (min === false && max === false) {
        return rand;
    }

    if (min === false && max) {
        min = 0;
    }
    max++;
    let mod = (rand % (max - min));
    return (mod + min);
}