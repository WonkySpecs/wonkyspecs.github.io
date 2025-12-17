const inputIds = [
    "deck-size-input",
    "hits-in-deck-input",
    "cards-seen-input",
    "desired-hits-input"
];

function areInputValuesValid(N, hits, draws, desired) {
    if (isNaN(N) || isNaN(hits) || isNaN(draws) || isNaN(desired)) return false;
    if (hits > N || draws > N || desired > draws || desired > hits) return false
    if (N - hits < draws - desired) return false;
    return true;
}

function recalculate() {
    const N = parseInt(document.getElementById(inputIds[0]).value);
    const hits = parseInt(document.getElementById(inputIds[1]).value);
    const draws = parseInt(document.getElementById(inputIds[2]).value);
    const desired = parseInt(document.getElementById(inputIds[3]).value);

    if (!areInputValuesValid(N, hits, draws, desired)) {
        setOutputs(emptyOutputValues)
        return;
    };

    const results = [];
    for (let i = desired; i <= Math.min(hits, draws); i++) {
        results.push(foo(N, hits, draws, i));
    }
    setOutputs(formatOutputs(desired, results));
}

const emptyOutputValues = {
    "exact-output": ["Exact", "-"],
    "greater-output": ["More than", "-"],
    "greater-equal-output": ["At least","-"],
    "lesser-output": ["Less than", "-"]
}

function formatOutputs(desired, results) {
    if ((results ?? []).length === 0) {
        return emptyOutputValues;
    }

    const exact = results[0];
    const greater = results
        .slice(1)
        .reduce((a, b) => a + b, 0);

    return {
        "exact-output": [`Exactly ${desired}`, formatNumber(exact)],
        "greater-output": [`More than ${desired}`, formatNumber(greater)],
        "greater-equal-output": [`At least ${desired}`, formatNumber(greater + exact)],
        "lesser-output": [`Less than ${desired}`, formatNumber(1 - exact - greater)]
    }
}

function setOutputs(outputValues) {
    for (const id in outputValues) {
        document.getElementById(id + "-label").textContent = outputValues[id][0] + ":";
        document.getElementById(id + "-value").textContent = outputValues[id][1] + "%";
    }
}

function formatNumber(n) {
    return (n * 100).toPrecision(4);
}

function foo(N, hits, draws, desired) {
    const firstTop = binomial(hits, desired);
    const secondTop = binomial(N - hits, draws - desired);
    const bottom = binomial(N, draws);

    const numerator = firstTop[0] * secondTop[0] * bottom[1];
    const denominator = firstTop[1] * secondTop[1] * bottom[0];
    return numerator / denominator;
}

function binomial(a, b) {
    return [factorial(a), factorial(b) * factorial(a - b)];
}

const factMem = {
    "0": 1,
    "1": 1,
    "2": 2,
}
function factorial(a) {
    if (a in factMem) return factMem[a];
    const res = a * factorial(a - 1);
    factMem[a] = res;
    return res;
}

window.onload = w => {
    const deckSizes = [40, 60, 100];
    for (const n of deckSizes) {
        const e = document.getElementById(`${n}-button`);
        e.onclick = () => {
            document.getElementById("deck-size-input").value = n
            recalculate();
        };
    }

    for (const id of inputIds) {
        const e = document.getElementById(id);
        e.oninput = ev => {
            recalculate();
        }
    }
}
