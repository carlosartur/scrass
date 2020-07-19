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

export const range = (start, end, step = 1) => {
    let reverse = false;
    if (start > end) {
        let aux = end;
        end = start;
        start = aux;
        reverse = true;
    }

    let range = [...Array(end - start + 1).keys()]
        .filter(item => item % step === 0)
        .map(item => item + start);

    return reverse ? range.reverse() : range;
}