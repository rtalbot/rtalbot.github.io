const MAX_GROUPS = 10;
const MIN_GROUPS = 2;
const ALPHA = 0.05;

let groupCount = 3;
let chart = null;
let lastResults = null;

const sampleDatasets = {
    coffee: {
        name: 'Coffee Brewing Methods',
        description: 'Taste scores (0-100) for coffee brewed using different methods',
        groups: [
            { name: 'French Press', data: [78, 82, 80, 85, 79, 83, 81] },
            { name: 'Pour Over', data: [85, 88, 86, 90, 87, 89, 88] },
            { name: 'Drip Machine', data: [72, 75, 71, 76, 73, 74, 72] }
        ]
    },
    plants: {
        name: 'Plant Growth by Fertilizer Type',
        description: 'Plant height (cm) after 30 days with different fertilizers',
        groups: [
            { name: 'Organic', data: [15, 18, 16, 19, 17, 16, 18, 17] },
            { name: 'Chemical', data: [22, 25, 23, 26, 24, 25, 23, 24] },
            { name: 'Control (no fertilizer)', data: [12, 14, 13, 15, 12, 13, 14] },
            { name: 'Slow-Release', data: [20, 21, 19, 22, 20, 21, 20] }
        ]
    },
    exercise: {
        name: 'Exercise Program Results',
        description: 'Weight loss (kg) after 8 weeks of different exercise programs',
        groups: [
            { name: 'HIIT', data: [5.2, 6.1, 5.8, 6.5, 5.5, 6.2, 5.9] },
            { name: 'Cardio', data: [4.1, 4.8, 4.5, 5.0, 4.3, 4.7, 4.6] },
            { name: 'Strength Training', data: [3.5, 4.2, 3.8, 4.5, 3.9, 4.0, 3.7] },
            { name: 'Yoga', data: [2.8, 3.2, 3.0, 3.5, 2.9, 3.1, 3.0] }
        ]
    },
    teaching: {
        name: 'Teaching Methods',
        description: 'Test scores (%) for students taught with different methods',
        groups: [
            { name: 'Interactive', data: [85, 88, 92, 87, 90, 89, 86, 91] },
            { name: 'Lecture Only', data: [75, 78, 76, 80, 77, 79, 76] },
            { name: 'Hybrid', data: [82, 84, 83, 86, 85, 84, 83, 85] }
        ]
    },
    plantgrowth: {
        name: 'PlantGrowth (classic R dataset)',
        description: 'Dried plant weight (g) under a control and two treatments. The textbook answer is F(2, 27) = 4.846, p = 0.0159, and Tukey HSD finds only trt2 vs trt1 significant (p = 0.012), so you can check this calculator against it.',
        groups: [
            { name: 'ctrl', data: [4.17, 5.58, 5.18, 6.11, 4.50, 4.61, 5.17, 4.53, 5.33, 5.14] },
            { name: 'trt1', data: [4.81, 4.17, 4.41, 3.59, 5.87, 3.83, 6.03, 4.89, 4.32, 4.69] },
            { name: 'trt2', data: [6.31, 5.12, 5.54, 5.50, 5.37, 5.29, 4.92, 6.15, 5.80, 5.26] }
        ]
    }
};

/* ==========================================================================
   Statistics
   ========================================================================== */

function mean(arr) {
    return arr.reduce((a, b) => a + b, 0) / arr.length;
}

// Sample variance (n - 1), the estimate ANOVA itself uses
function sampleVariance(arr) {
    if (arr.length < 2) return NaN;
    const m = mean(arr);
    return arr.reduce((sum, v) => sum + (v - m) * (v - m), 0) / (arr.length - 1);
}

// Linear-interpolation quantile (same as Excel QUANTILE.INC / R type 7)
function quantile(sorted, q) {
    if (sorted.length === 1) return sorted[0];
    const pos = (sorted.length - 1) * q;
    const lo = Math.floor(pos);
    const hi = Math.ceil(pos);
    return sorted[lo] + (sorted[hi] - sorted[lo]) * (pos - lo);
}

// log Gamma, Lanczos approximation (g = 7, n = 9), ~15 significant digits
function gammaLn(x) {
    const cof = [
        0.99999999999980993, 676.5203681218851, -1259.1392167224028,
        771.32342877765313, -176.61502916214059, 12.507343278686905,
        -0.13857109526572012, 9.9843695780195716e-6, 1.5056327351493116e-7
    ];
    if (x < 0.5) {
        return Math.log(Math.PI / Math.abs(Math.sin(Math.PI * x))) - gammaLn(1 - x);
    }
    x -= 1;
    let a = cof[0];
    const t = x + 7.5;
    for (let i = 1; i < 9; i++) {
        a += cof[i] / (x + i);
    }
    return 0.5 * Math.log(2 * Math.PI) + (x + 0.5) * Math.log(t) - t + Math.log(a);
}

// Regularized incomplete beta I_x(a, b)
function incompleteBeta(x, a, b) {
    if (x <= 0) return 0;
    if (x >= 1) return 1;

    const bt = Math.exp(
        gammaLn(a + b) - gammaLn(a) - gammaLn(b) +
        a * Math.log(x) + b * Math.log(1 - x)
    );

    if (x < (a + 1) / (a + b + 2)) {
        return bt * betaCF(x, a, b) / a;
    } else {
        return 1 - bt * betaCF(1 - x, b, a) / b;
    }
}

// Continued fraction for the incomplete beta (modified Lentz)
function betaCF(x, a, b) {
    const maxIterations = 1000;
    const epsilon = 1e-15;
    const tiny = 1e-300;
    const qab = a + b;
    const qap = a + 1;
    const qam = a - 1;
    let c = 1;
    let d = 1 - qab * x / qap;

    if (Math.abs(d) < tiny) d = tiny;
    d = 1 / d;
    let h = d;

    for (let m = 1; m <= maxIterations; m++) {
        const m2 = 2 * m;
        let aa = m * (b - m) * x / ((qam + m2) * (a + m2));
        d = 1 + aa * d;
        if (Math.abs(d) < tiny) d = tiny;
        c = 1 + aa / c;
        if (Math.abs(c) < tiny) c = tiny;
        d = 1 / d;
        h *= d * c;

        aa = -(a + m) * (qab + m) * x / ((a + m2) * (qap + m2));
        d = 1 + aa * d;
        if (Math.abs(d) < tiny) d = tiny;
        c = 1 + aa / c;
        if (Math.abs(c) < tiny) c = tiny;
        d = 1 / d;
        const del = d * c;
        h *= del;

        if (Math.abs(del - 1) < epsilon) break;
    }

    return h;
}

// P(F > f) for the F distribution. Computed directly rather than as
// 1 - CDF, so very small p-values keep their precision.
function fUpperTail(f, df1, df2) {
    if (!isFinite(f)) return 0;
    if (f <= 0) return 1;
    const x = df2 / (df2 + df1 * f);
    return incompleteBeta(x, df2 / 2, df1 / 2);
}

// Two-sided critical t value, by bisection on the t tail
function tCritical(alpha, df) {
    const tail = t => incompleteBeta(df / (df + t * t), df / 2, 0.5); // P(|T| > t)
    let lo = 0;
    let hi = 1000;
    for (let i = 0; i < 200; i++) {
        const mid = (lo + hi) / 2;
        if (tail(mid) > alpha) lo = mid; else hi = mid;
    }
    return (lo + hi) / 2;
}

// Standard normal CDF (West 2005, double precision)
function pnorm(z) {
    const x = Math.abs(z);
    let c = 0;
    if (x <= 37) {
        const e = Math.exp(-x * x / 2);
        if (x < 7.07106781186547) {
            let n = 3.52624965998911e-02 * x + 0.700383064443688;
            n = n * x + 6.37396220353165;
            n = n * x + 33.912866078383;
            n = n * x + 112.079291497871;
            n = n * x + 221.213596169931;
            n = n * x + 220.206867912376;
            let d = 8.83883476483184e-02 * x + 1.75566716318264;
            d = d * x + 16.064177579207;
            d = d * x + 86.7807322029461;
            d = d * x + 296.564248779674;
            d = d * x + 637.333633378831;
            d = d * x + 793.826512519948;
            d = d * x + 440.413735824752;
            c = e * n / d;
        } else {
            let f = x + 0.65;
            f = x + 4 / f;
            f = x + 3 / f;
            f = x + 2 / f;
            f = x + 1 / f;
            c = e / f / 2.506628274631;
        }
    }
    return z > 0 ? 1 - c : c;
}

// Probability integral of the range for cc normal means (helper for ptukey).
// Port of wprob() from R's ptukey.c (Copenhaver & Holland 1988).
function wprob(w, rr, cc) {
    const nleg = 12;
    const ihalf = 6;
    const C1 = -30;
    const C2 = -50;
    const C3 = 60;
    const bb = 8;
    const wlar = 3;
    const xleg = [
        0.981560634246719250690549090149, 0.904117256370474856678465866119,
        0.769902674194304687036893833213, 0.587317954286617447296702418941,
        0.367831498998180193752691536644, 0.125233408511468915472441369464
    ];
    const aleg = [
        0.047175336386511827194615961485, 0.106939325995318430960254718194,
        0.160078328543346226334652529543, 0.203167426723065921749064455810,
        0.233492536538354808760849898925, 0.249147045813402785000562436043
    ];

    const qsqz = w * 0.5;
    if (qsqz >= bb) return 1.0;

    let prW = 2 * pnorm(qsqz) - 1;
    prW = prW >= Math.exp(C2 / cc) ? Math.pow(prW, cc) : 0;

    const wincr = w > wlar ? 2 : 3;
    let blb = qsqz;
    const binc = (bb - qsqz) / wincr;
    let bub = blb + binc;
    let einsum = 0;
    const cc1 = cc - 1;

    for (let wi = 1; wi <= wincr; wi++) {
        let elsum = 0;
        const a = 0.5 * (bub + blb);
        const b = 0.5 * (bub - blb);

        for (let jj = 1; jj <= nleg; jj++) {
            let j;
            let xx;
            if (ihalf < jj) {
                j = nleg - jj + 1;
                xx = xleg[j - 1];
            } else {
                j = jj;
                xx = -xleg[j - 1];
            }
            const ac = a + b * xx;
            const qexpo = ac * ac;
            if (qexpo > C3) break;

            const pplus = 2 * pnorm(ac);
            const pminus = 2 * pnorm(ac - w);
            let rinsum = pplus * 0.5 - pminus * 0.5;
            if (rinsum >= Math.exp(C1 / cc1)) {
                rinsum = aleg[j - 1] * Math.exp(-0.5 * qexpo) * Math.pow(rinsum, cc1);
                elsum += rinsum;
            }
        }
        elsum *= (2 * b * cc) / Math.sqrt(2 * Math.PI);
        einsum += elsum;
        blb = bub;
        bub += binc;
    }

    prW += einsum;
    if (prW <= Math.exp(C1 / rr)) return 0;
    prW = Math.pow(prW, rr);
    return prW >= 1 ? 1 : prW;
}

// CDF of the studentized range distribution, P(Q < q) for k groups and
// df error degrees of freedom. Port of ptukey() from R.
function ptukey(q, k, df) {
    if (q <= 0) return 0;
    if (!isFinite(q)) return 1;
    if (df > 25000) return wprob(q, 1, k);

    const nlegq = 16;
    const ihalfq = 8;
    const eps1 = -30;
    const eps2 = 1e-14;
    const xlegq = [
        0.989400934991649932596154173450, 0.944575023073232576077988415535,
        0.865631202387831743880467897712, 0.755404408355003033895101194847,
        0.617876244402643748446671764049, 0.458016777657227386342419442984,
        0.281603550779258913230460501460, 0.950125098376374401853193354250e-1
    ];
    const alegq = [
        0.271524594117540948517805724560e-1, 0.622535239386478928628438369944e-1,
        0.951585116824927848099251076022e-1, 0.124628971255533872052476282192,
        0.149595988816576732081501730547, 0.169156519395002538189312079030,
        0.182603415044923588866763667969, 0.189450610455068496285396723208
    ];

    const f2 = df * 0.5;
    let f2lf = f2 * Math.log(df) - df * Math.LN2 - gammaLn(f2);
    const f21 = f2 - 1;
    const ff4 = df * 0.25;
    let ulen;
    if (df <= 100) ulen = 1;
    else if (df <= 800) ulen = 0.5;
    else if (df <= 5000) ulen = 0.25;
    else ulen = 0.125;
    f2lf += Math.log(ulen);

    let ans = 0;
    for (let i = 1; i <= 50; i++) {
        let otsum = 0;
        const twa1 = (2 * i - 1) * ulen;

        for (let jj = 1; jj <= nlegq; jj++) {
            let j;
            let t1;
            if (ihalfq < jj) {
                j = jj - ihalfq - 1;
                t1 = f2lf + f21 * Math.log(twa1 + xlegq[j] * ulen) - (xlegq[j] * ulen + twa1) * ff4;
            } else {
                j = jj - 1;
                t1 = f2lf + f21 * Math.log(twa1 - xlegq[j] * ulen) + (xlegq[j] * ulen - twa1) * ff4;
            }

            if (t1 >= eps1) {
                const qsqz = ihalfq < jj
                    ? q * Math.sqrt((xlegq[j] * ulen + twa1) * 0.5)
                    : q * Math.sqrt((-(xlegq[j] * ulen) + twa1) * 0.5);
                otsum += wprob(qsqz, 1, k) * alegq[j] * Math.exp(t1);
            }
        }

        if (i * ulen >= 1 && otsum <= eps2) break;
        ans += otsum;
    }

    return Math.min(ans, 1);
}

// Critical value of the studentized range (inverse of ptukey)
function qtukey(p, k, df) {
    let lo = 0;
    let hi = 100;
    for (let i = 0; i < 100; i++) {
        const mid = (lo + hi) / 2;
        if (ptukey(mid, k, df) < p) lo = mid; else hi = mid;
    }
    return (lo + hi) / 2;
}

// Tukey HSD (Tukey-Kramer for unequal group sizes)
function tukeyHSD(groups, msW, dfW) {
    const k = groups.length;
    const qCrit = qtukey(1 - ALPHA, k, dfW);
    const comparisons = [];

    for (let i = 0; i < k; i++) {
        for (let j = i + 1; j < k; j++) {
            const a = groups[i];
            const b = groups[j];
            const diff = b.mean - a.mean;
            const se = Math.sqrt((msW / 2) * (1 / a.n + 1 / b.n));
            const q = Math.abs(diff) / se;
            const p = Math.max(0, Math.min(1, 1 - ptukey(q, k, dfW)));
            comparisons.push({
                a: a.name,
                b: b.name,
                diff,
                lower: diff - qCrit * se,
                upper: diff + qCrit * se,
                q,
                p
            });
        }
    }

    return { qCrit, comparisons };
}

// One-way ANOVA. groups: [{ name, values }]
function computeANOVA(groups) {
    const described = groups.map(g => {
        const sorted = [...g.values].sort((a, b) => a - b);
        const n = sorted.length;
        const m = mean(sorted);
        const v = sampleVariance(sorted);
        return {
            name: g.name,
            values: g.values,
            n,
            mean: m,
            sd: Math.sqrt(v),
            se: Math.sqrt(v / n),
            min: sorted[0],
            q1: quantile(sorted, 0.25),
            median: quantile(sorted, 0.5),
            q3: quantile(sorted, 0.75),
            max: sorted[n - 1]
        };
    });

    const allValues = groups.flatMap(g => g.values);
    const grandMean = mean(allValues);
    const n = allValues.length;
    const k = groups.length;

    const ssB = described.reduce((sum, g) => sum + g.n * Math.pow(g.mean - grandMean, 2), 0);
    const ssW = described.reduce((sum, g) => {
        return sum + g.values.reduce((s, v) => s + Math.pow(v - g.mean, 2), 0);
    }, 0);
    const ssT = allValues.reduce((sum, v) => sum + Math.pow(v - grandMean, 2), 0);

    const dfB = k - 1;
    const dfW = n - k;
    const msB = ssB / dfB;
    const msW = ssW / dfW;

    const fStat = msW > 0 ? msB / msW : (msB > 0 ? Infinity : NaN);
    const pValue = isNaN(fStat) ? NaN : fUpperTail(fStat, dfB, dfW);

    const etaSquared = ssT > 0 ? ssB / ssT : NaN;
    const omegaSquared = ssT > 0 ? Math.max(0, (ssB - dfB * msW) / (ssT + msW)) : NaN;

    // 95% CI for each mean, using the pooled SD (as in the ANOVA model)
    const tCrit = tCritical(ALPHA, dfW);
    described.forEach(g => {
        const half = tCrit * Math.sqrt(msW / g.n);
        g.ciLow = g.mean - half;
        g.ciHigh = g.mean + half;
    });

    const tukey = k >= 3 && msW > 0 ? tukeyHSD(described, msW, dfW) : null;

    return {
        fStat, pValue, dfB, dfW, ssB, ssW, ssT, msB, msW,
        etaSquared, omegaSquared, grandMean, n, k,
        groups: described, tukey
    };
}

/* ==========================================================================
   Input handling
   ========================================================================== */

// Pull numbers out of free text: one per line, or separated by commas,
// tabs, spaces or semicolons. Thousands separators like 1,234 are not
// supported (the comma is read as a separator).
function parseValues(text) {
    const tokens = String(text).split(/[\s,;]+/).filter(t => t.length > 0);
    const values = [];
    const invalid = [];
    tokens.forEach(token => {
        const cleaned = token.replace(/^[(\[]|[)\]]$/g, '');
        if (/^[-+]?(\d+\.?\d*|\.\d+)(e[-+]?\d+)?$/i.test(cleaned)) {
            values.push(parseFloat(cleaned));
        } else {
            invalid.push(token);
        }
    });
    return { values, invalid };
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function formatNumber(value, digits = 4) {
    if (value === Infinity) return '∞';
    if (!isFinite(value)) return '–';
    return value.toFixed(digits);
}

function formatP(p) {
    if (!isFinite(p)) return '–';
    if (p < 0.0001) return '< 0.0001';
    return p.toFixed(4);
}

function formatPStatement(p) {
    return p < 0.0001 ? 'p < 0.0001' : `p = ${p.toFixed(4)}`;
}

function createGroupElement(index, name, values) {
    const groupDiv = document.createElement('div');
    groupDiv.className = 'group';
    groupDiv.setAttribute('data-group', index);
    groupDiv.innerHTML = `
        <input type="text" class="group-name" id="group-label-${index}" aria-label="Name of group ${index}">
        <textarea aria-labelledby="group-label-${index}" aria-describedby="stats-${index}" placeholder="${index === 1 ? 'Enter values (one per line)&#10;e.g.&#10;23&#10;25&#10;27' : 'Enter values (one per line)'}" spellcheck="false"></textarea>
        <div class="group-stats" id="stats-${index}" aria-live="polite"></div>
    `;
    groupDiv.querySelector('.group-name').value = name || `Group ${index}`;
    if (values && values.length) {
        groupDiv.querySelector('textarea').value = values.join('\n');
    }
    return groupDiv;
}

function setGroups(groups) {
    const container = document.getElementById('groupsContainer');
    container.innerHTML = '';
    groupCount = groups.length;
    groups.forEach((group, i) => {
        container.appendChild(createGroupElement(i + 1, group.name, group.data));
        updateGroupStats(i + 1);
    });
    updateGroupButtons();
}

function updateGroupButtons() {
    document.getElementById('add-group-btn').disabled = groupCount >= MAX_GROUPS;
    document.getElementById('remove-group-btn').disabled = groupCount <= MIN_GROUPS;
}

function showDatasetInfo(title, description) {
    removeDatasetInfo();
    const info = document.createElement('div');
    info.className = 'dataset-info';
    info.innerHTML = `<strong>${escapeHtml(title)}:</strong> ${escapeHtml(description)}`;
    const anchor = document.getElementById('data-intro');
    anchor.parentNode.insertBefore(info, anchor.nextSibling);
}

function removeDatasetInfo() {
    const existingInfo = document.querySelector('.dataset-info');
    if (existingInfo) existingInfo.remove();
}

function showInputMessage(message, type = 'warning') {
    const box = document.getElementById('inputMessage');
    if (!message) {
        box.className = 'hidden';
        box.textContent = '';
        return;
    }
    box.className = `alert alert-${type}`;
    box.textContent = message;
}

function toggleSampleMenu() {
    const menu = document.getElementById('sampleMenu');
    const btn = document.getElementById('sample-data-btn');
    const isOpen = menu.classList.toggle('show');
    btn.setAttribute('aria-expanded', isOpen);
    if (isOpen) {
        menu.querySelector('button').focus();
    }
}

function closeSampleMenu() {
    document.getElementById('sampleMenu').classList.remove('show');
    document.getElementById('sample-data-btn').setAttribute('aria-expanded', 'false');
}

function addGroup() {
    if (groupCount >= MAX_GROUPS) return;
    groupCount++;
    const container = document.getElementById('groupsContainer');
    const groupDiv = createGroupElement(groupCount, `Group ${groupCount}`);
    container.appendChild(groupDiv);
    groupDiv.querySelector('textarea').focus();
    updateGroupButtons();
}

function removeGroup() {
    if (groupCount <= MIN_GROUPS) return;
    const container = document.getElementById('groupsContainer');
    const lastGroup = container.querySelector(`[data-group="${groupCount}"]`);
    if (lastGroup) {
        container.removeChild(lastGroup);
        groupCount--;
    }
    updateGroupButtons();
}

function loadSampleData(datasetName) {
    const dataset = sampleDatasets[datasetName];
    if (!dataset) return;

    closeSampleMenu();
    setGroups(dataset.groups);
    showDatasetInfo(dataset.name, dataset.description);
    showInputMessage(null);
    document.getElementById('resultsSection').classList.add('hidden');
}

function clearAll() {
    document.querySelectorAll('.group textarea').forEach(textarea => { textarea.value = ''; });
    document.querySelectorAll('.group-stats').forEach(stat => { stat.innerHTML = ''; });
    removeDatasetInfo();
    showInputMessage(null);
    document.getElementById('resultsSection').classList.add('hidden');
}

function updateGroupStats(groupNum) {
    const group = document.querySelector(`[data-group="${groupNum}"]`);
    if (!group) return;
    const textarea = group.querySelector('textarea');
    const statsDiv = document.getElementById(`stats-${groupNum}`);

    const { values, invalid } = parseValues(textarea.value);
    const ignored = invalid.length > 0
        ? ` <span class="ignored" title="${escapeHtml(invalid.slice(0, 5).join(', '))}">· ${invalid.length} ignored</span>`
        : '';

    if (values.length === 0) {
        statsDiv.innerHTML = invalid.length > 0 ? `No numbers found${ignored}` : '';
        return;
    }

    const m = mean(values);
    const sd = Math.sqrt(sampleVariance(values));

    statsDiv.innerHTML = `n=${values.length} · mean=${m.toFixed(2)} · SD=${isFinite(sd) ? sd.toFixed(2) : '–'}${ignored}`;
}

function getGroupData() {
    const data = [];
    document.querySelectorAll('#groupsContainer .group').forEach((group, i) => {
        const { values } = parseValues(group.querySelector('textarea').value);
        const name = group.querySelector('.group-name').value.trim() || `Group ${i + 1}`;
        if (values.length > 0) {
            data.push({ name, values });
        }
    });
    return data;
}

/* ==========================================================================
   Paste from a spreadsheet
   ========================================================================== */

// Turn pasted cells into groups. Accepts either
//   wide: one column per group (optional header row of names), or
//   long: two columns "group, value" (e.g. a tidy data export).
function parsePastedTable(text) {
    const lines = String(text).replace(/\r\n?/g, '\n').split('\n').filter(l => l.trim().length > 0);
    if (lines.length === 0) return { error: 'Nothing to read. Paste cells copied from a spreadsheet.' };

    const delimiter = lines.some(l => l.includes('\t')) ? '\t'
        : lines.some(l => l.includes(',')) ? ','
        : lines.some(l => l.includes(';')) ? ';'
        : /\s+/;
    const rows = lines.map(l => l.split(delimiter).map(c => c.trim().replace(/^"(.*)"$/, '$1')));
    const isNum = c => /^[-+]?(\d+\.?\d*|\.\d+)(e[-+]?\d+)?$/i.test(c);
    const width = Math.max(...rows.map(r => r.length));

    // Long format: exactly two columns, first one labels, second numbers
    if (width === 2) {
        const body = rows.filter(r => r.length === 2 && isNum(r[1]));
        const labelled = body.filter(r => r[0] !== '' && !isNum(r[0]));
        if (body.length > 0 && labelled.length === body.length) {
            const order = [];
            const byName = {};
            body.forEach(([name, value]) => {
                if (!byName[name]) {
                    byName[name] = [];
                    order.push(name);
                }
                byName[name].push(parseFloat(value));
            });
            if (order.length >= 2) {
                return { groups: order.map(name => ({ name, data: byName[name] })), format: 'long' };
            }
        }
    }

    // Wide format
    const hasHeader = rows[0].some(c => c !== '' && !isNum(c));
    const header = hasHeader ? rows[0] : [];
    const body = hasHeader ? rows.slice(1) : rows;
    let skipped = 0;
    const groups = [];
    for (let col = 0; col < width; col++) {
        const data = [];
        body.forEach(r => {
            const cell = r[col] !== undefined ? r[col] : '';
            if (cell === '') return;
            if (isNum(cell)) data.push(parseFloat(cell)); else skipped++;
        });
        if (data.length > 0) {
            groups.push({ name: header[col] || `Group ${groups.length + 1}`, data });
        }
    }

    if (groups.length === 0) return { error: 'No numeric columns found in the pasted cells.' };
    return { groups, format: 'wide', skipped };
}

function applyPaste() {
    const text = document.getElementById('pasteInput').value;
    const result = parsePastedTable(text);
    const status = document.getElementById('pasteStatus');

    if (result.error) {
        status.className = 'paste-status paste-error';
        status.textContent = result.error;
        return;
    }

    let groups = result.groups;
    let note = '';
    if (groups.length > MAX_GROUPS) {
        note = ` Only the first ${MAX_GROUPS} columns were used.`;
        groups = groups.slice(0, MAX_GROUPS);
    }
    if (groups.length < MIN_GROUPS) {
        status.className = 'paste-status paste-error';
        status.textContent = 'Found only one group. Paste at least two columns (or a group/value table).';
        return;
    }

    setGroups(groups);
    removeDatasetInfo();
    showInputMessage(null);
    document.getElementById('resultsSection').classList.add('hidden');

    const skipped = result.skipped ? ` ${result.skipped} non-numeric cell${result.skipped !== 1 ? 's were' : ' was'} ignored.` : '';
    status.className = 'paste-status paste-ok';
    status.textContent = `Loaded ${groups.length} groups (${result.format === 'long' ? 'group/value rows' : 'one column per group'}).${skipped}${note}`;
}

/* ==========================================================================
   Calculate and display
   ========================================================================== */

function calculateANOVA() {
    const data = getGroupData();

    if (data.length < 2) {
        showInputMessage('Enter numbers for at least 2 groups.');
        return;
    }

    const n = data.reduce((sum, g) => sum + g.values.length, 0);
    if (n - data.length < 1) {
        showInputMessage('Not enough data: at least one group needs 2 or more values so there is variation within groups to compare against.');
        return;
    }

    const results = computeANOVA(data);

    if (!(results.msW > 0)) {
        showInputMessage('Every group has identical values inside it (no within-group variation), so the F ratio is undefined. Check the data.');
        return;
    }

    showInputMessage(null);
    lastResults = results;
    displayResults(results);
}

function displayResults(results) {
    document.getElementById('resultsSection').classList.remove('hidden');

    document.getElementById('fStatistic').textContent = formatNumber(results.fStat);
    document.getElementById('pValue').textContent = formatP(results.pValue);
    document.getElementById('dfValue').textContent = `${results.dfB}, ${results.dfW}`;
    document.getElementById('etaValue').textContent = formatNumber(results.etaSquared, 3);
    document.getElementById('etaInterpretation').textContent =
        `${(results.etaSquared * 100).toFixed(1)}% of the variation is explained by group (${effectLabel(results.etaSquared)} effect). ω² = ${formatNumber(results.omegaSquared, 3)}`;

    const conclusionDiv = document.getElementById('conclusionAlert');
    const reportLine = `F(${results.dfB}, ${results.dfW}) = ${results.fStat.toFixed(2)}, ${formatPStatement(results.pValue)}, η² = ${results.etaSquared.toFixed(3)}`;
    if (results.pValue < ALPHA) {
        conclusionDiv.className = 'alert alert-success';
        conclusionDiv.innerHTML = `
            <strong>Significant result.</strong>
            With ${formatPStatement(results.pValue)} &lt; ${ALPHA}, we reject the null hypothesis:
            at least one group mean differs from the others.
            ${results.tukey ? 'The Tukey HSD test below shows which pairs differ.' : ''}
            <div class="report-line">${escapeHtml(reportLine)}</div>
        `;
    } else {
        conclusionDiv.className = 'alert alert-warning';
        conclusionDiv.innerHTML = `
            <strong>Not significant.</strong>
            With ${formatPStatement(results.pValue)} ≥ ${ALPHA}, we fail to reject the null hypothesis.
            There is not enough evidence to conclude that the group means differ.
            <div class="report-line">${escapeHtml(reportLine)}</div>
        `;
    }

    const tableBody = document.getElementById('anovaTableBody');
    tableBody.innerHTML = `
        <tr>
            <td>Between Groups</td>
            <td>${formatNumber(results.ssB)}</td>
            <td>${results.dfB}</td>
            <td>${formatNumber(results.msB)}</td>
            <td>${formatNumber(results.fStat)}</td>
            <td>${formatP(results.pValue)}</td>
        </tr>
        <tr>
            <td>Within Groups</td>
            <td>${formatNumber(results.ssW)}</td>
            <td>${results.dfW}</td>
            <td>${formatNumber(results.msW)}</td>
            <td>-</td>
            <td>-</td>
        </tr>
        <tr>
            <td><strong>Total</strong></td>
            <td><strong>${formatNumber(results.ssT)}</strong></td>
            <td><strong>${results.dfB + results.dfW}</strong></td>
            <td>-</td>
            <td>-</td>
            <td>-</td>
        </tr>
    `;

    document.getElementById('descriptivesBody').innerHTML = results.groups.map(g => `
        <tr>
            <td>${escapeHtml(g.name)}</td>
            <td>${g.n}</td>
            <td>${formatNumber(g.mean, 3)}</td>
            <td>${g.n > 1 ? formatNumber(g.sd, 3) : '–'}</td>
            <td>${formatNumber(g.ciLow, 3)} to ${formatNumber(g.ciHigh, 3)}</td>
            <td>${formatNumber(g.min, 2)}</td>
            <td>${formatNumber(g.median, 2)}</td>
            <td>${formatNumber(g.max, 2)}</td>
        </tr>
    `).join('');

    displayTukey(results);
    createVisualization(results);

    document.getElementById('ssActual').style.display = 'block';
    document.getElementById('ssActual').innerHTML = `${results.ssT.toFixed(4)} = ${results.ssB.toFixed(4)} + ${results.ssW.toFixed(4)}`;

    document.getElementById('dfActual').style.display = 'block';
    document.getElementById('dfActual').innerHTML = `df_between = ${results.k} - 1 = ${results.dfB}, df_within = ${results.n} - ${results.k} = ${results.dfW}`;

    document.getElementById('msActual').style.display = 'block';
    document.getElementById('msActual').innerHTML = `MS_between = ${results.ssB.toFixed(4)} / ${results.dfB} = ${results.msB.toFixed(4)}<br>MS_within = ${results.ssW.toFixed(4)} / ${results.dfW} = ${results.msW.toFixed(4)}`;

    document.getElementById('fActual').style.display = 'block';
    document.getElementById('fActual').innerHTML = `F = ${results.msB.toFixed(4)} / ${results.msW.toFixed(4)} = ${formatNumber(results.fStat)}`;

    document.getElementById('etaActual').style.display = 'block';
    document.getElementById('etaActual').innerHTML = `η² = ${results.ssB.toFixed(4)} / ${results.ssT.toFixed(4)} = ${results.etaSquared.toFixed(4)}`;

    document.getElementById('resultsSection').scrollIntoView({ behavior: 'smooth' });
}

function effectLabel(eta) {
    // Cohen's (1988) rough benchmarks for eta squared
    if (eta >= 0.14) return 'large';
    if (eta >= 0.06) return 'medium';
    if (eta >= 0.01) return 'small';
    return 'negligible';
}

function displayTukey(results) {
    const card = document.getElementById('tukeyCard');
    if (!results.tukey) {
        card.classList.add('hidden');
        return;
    }
    card.classList.remove('hidden');

    const anySignificant = results.tukey.comparisons.some(c => c.p < ALPHA);
    document.getElementById('tukeySummary').textContent = anySignificant
        ? `Pairs marked "Yes" differ at the ${ALPHA} level, after adjusting for making ${results.tukey.comparisons.length} comparisons.`
        : `No pair of groups differs at the ${ALPHA} level after adjusting for multiple comparisons.`;

    document.getElementById('tukeyBody').innerHTML = results.tukey.comparisons.map(c => `
        <tr class="${c.p < ALPHA ? 'sig-row' : ''}">
            <td>${escapeHtml(c.b)} − ${escapeHtml(c.a)}</td>
            <td>${formatNumber(c.diff, 3)}</td>
            <td>${formatNumber(c.lower, 3)} to ${formatNumber(c.upper, 3)}</td>
            <td>${formatP(c.p)}</td>
            <td>${c.p < ALPHA ? '<strong>Yes</strong>' : 'No'}</td>
        </tr>
    `).join('');
}

function cssVar(name, fallback) {
    const value = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
    return value || fallback;
}

// Individual points (jittered) for each group, with the group mean and its
// 95% confidence interval drawn on top
function createVisualization(results) {
    const canvas = document.getElementById('visualization');
    const ctx = canvas.getContext('2d');

    if (chart) {
        chart.destroy();
    }

    const textPrimary = cssVar('--c-text-primary', '#FCF5E4');
    const textSecondary = cssVar('--c-text-secondary', '#869395');
    const gridColor = 'rgba(128, 128, 128, 0.2)';

    const palette = [
        '#ff597d', '#4c9aff', '#8be367', '#ffa500', '#b388ff',
        '#2ec4c4', '#f78fb3', '#c0ca33', '#ff8a65', '#90a4ae'
    ];

    const names = results.groups.map(g => g.name);

    // Deterministic jitter so redraws don't move the points
    const jitter = (i, j) => {
        const r = Math.sin((i + 1) * 12.9898 + (j + 1) * 78.233) * 43758.5453;
        return (r - Math.floor(r)) * 0.36 - 0.18;
    };

    const pointSets = results.groups.map((g, i) => ({
        label: g.name,
        type: 'scatter',
        data: g.values.map((v, j) => ({ x: i + jitter(i, j), y: v })),
        backgroundColor: palette[i % palette.length] + '99',
        borderColor: palette[i % palette.length],
        borderWidth: 1,
        pointRadius: 4,
        pointHoverRadius: 6
    }));

    const meanSet = {
        label: 'Mean (95% CI)',
        type: 'scatter',
        data: results.groups.map((g, i) => ({ x: i, y: g.mean })),
        pointStyle: 'line',
        pointRadius: 18,
        pointHoverRadius: 20,
        borderWidth: 3,
        borderColor: textPrimary,
        backgroundColor: textPrimary
    };

    const ciPlugin = {
        id: 'anovaCI',
        afterDatasetsDraw(c) {
            const { ctx: g, scales: { x, y } } = c;
            g.save();
            g.strokeStyle = textPrimary;
            g.lineWidth = 2;
            results.groups.forEach((group, i) => {
                const px = x.getPixelForValue(i);
                const top = y.getPixelForValue(group.ciHigh);
                const bottom = y.getPixelForValue(group.ciLow);
                g.beginPath();
                g.moveTo(px, top);
                g.lineTo(px, bottom);
                g.moveTo(px - 7, top);
                g.lineTo(px + 7, top);
                g.moveTo(px - 7, bottom);
                g.lineTo(px + 7, bottom);
                g.stroke();
            });
            g.restore();
        }
    };

    canvas.setAttribute('aria-label',
        'Chart of each group\'s values with its mean and 95% confidence interval. ' +
        results.groups.map(g => `${g.name}: mean ${g.mean.toFixed(2)}`).join('; ') + '.');

    chart = new Chart(ctx, {
        type: 'scatter',
        data: { datasets: [...pointSets, meanSet] },
        plugins: [ciPlugin],
        options: {
            responsive: true,
            maintainAspectRatio: false,
            animation: false,
            plugins: {
                title: {
                    display: true,
                    text: 'Values by group, with mean and 95% CI',
                    color: textPrimary,
                    font: { size: 15, weight: 'bold' }
                },
                legend: { display: false },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.85)',
                    titleColor: '#fff',
                    bodyColor: '#fff',
                    padding: 10,
                    displayColors: false,
                    callbacks: {
                        title: function(items) {
                            const item = items[0];
                            const index = item.dataset === meanSet ? item.dataIndex : Math.round(item.parsed.x);
                            return names[index];
                        },
                        label: function(item) {
                            if (item.dataset === meanSet) {
                                const g = results.groups[item.dataIndex];
                                return [
                                    `Mean: ${g.mean.toFixed(3)}`,
                                    `95% CI: ${g.ciLow.toFixed(3)} to ${g.ciHigh.toFixed(3)}`,
                                    `Median: ${g.median.toFixed(3)}`,
                                    `n = ${g.n}`
                                ];
                            }
                            return `Value: ${item.parsed.y}`;
                        }
                    }
                }
            },
            scales: {
                x: {
                    type: 'linear',
                    min: -0.6,
                    max: names.length - 0.4,
                    afterBuildTicks: function(axis) {
                        axis.ticks = names.map((_, i) => ({ value: i }));
                    },
                    ticks: {
                        color: textSecondary,
                        font: { size: 12 },
                        autoSkip: false,
                        maxRotation: 45,
                        callback: function(value) {
                            const name = names[value];
                            if (name === undefined) return '';
                            return name.length > 16 ? name.slice(0, 15) + '…' : name;
                        }
                    },
                    grid: { display: false }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Value',
                        color: textSecondary,
                        font: { size: 13 }
                    },
                    grid: { color: gridColor },
                    ticks: {
                        color: textSecondary,
                        font: { size: 12 }
                    }
                }
            }
        }
    });
}

/* ==========================================================================
   Wiring
   ========================================================================== */

if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', function() {
        document.getElementById('add-group-btn').addEventListener('click', addGroup);
        document.getElementById('remove-group-btn').addEventListener('click', removeGroup);
        document.getElementById('sample-data-btn').addEventListener('click', toggleSampleMenu);
        document.getElementById('clear-all-btn').addEventListener('click', clearAll);
        document.getElementById('calculate-btn').addEventListener('click', calculateANOVA);
        document.getElementById('paste-apply-btn').addEventListener('click', applyPaste);

        // Sample dataset buttons (identified by data-dataset attribute)
        document.querySelectorAll('#sampleMenu [data-dataset]').forEach(function(btn) {
            btn.addEventListener('click', function() {
                loadSampleData(this.getAttribute('data-dataset'));
            });
        });

        // Close sample dropdown when clicking outside
        document.addEventListener('click', function(event) {
            const dropdown = document.querySelector('.sample-data-dropdown');
            if (dropdown && !dropdown.contains(event.target)) {
                closeSampleMenu();
            }
        });

        // Close sample dropdown on Escape key
        document.addEventListener('keydown', function(event) {
            if (event.key === 'Escape') {
                const menu = document.getElementById('sampleMenu');
                if (menu.classList.contains('show')) {
                    closeSampleMenu();
                    document.getElementById('sample-data-btn').focus();
                }
            }
        });

        // Delegated listener for all group textarea inputs (handles static and dynamic groups)
        document.getElementById('groupsContainer').addEventListener('input', function(e) {
            if (e.target.tagName === 'TEXTAREA') {
                const groupEl = e.target.closest('[data-group]');
                if (groupEl) {
                    updateGroupStats(parseInt(groupEl.getAttribute('data-group'), 10));
                }
            }
        });

        // Redraw the chart in the new colours when the site theme changes
        new MutationObserver(function() {
            if (lastResults && !document.getElementById('resultsSection').classList.contains('hidden')) {
                createVisualization(lastResults);
            }
        }).observe(document.documentElement, { attributes: true, attributeFilter: ['style', 'class', 'data-theme'] });

        updateGroupButtons();
    });
}

// Allow the statistics to be tested outside the browser
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { computeANOVA, fUpperTail, ptukey, qtukey, tCritical, parseValues, parsePastedTable };
}
