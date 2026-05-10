let groupCount = 3;
let chart = null;

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
    }
};

function toggleSampleMenu() {
    const menu = document.getElementById('sampleMenu');
    const btn = document.getElementById('sample-data-btn');
    const isOpen = menu.classList.toggle('show');
    btn.setAttribute('aria-expanded', isOpen);
    if (isOpen) {
        menu.querySelector('button').focus();
    }
}

function addGroup() {
    if (groupCount >= 6) {
        alert('Maximum 6 groups allowed');
        return;
    }
    groupCount++;
    const container = document.getElementById('groupsContainer');
    const groupDiv = document.createElement('div');
    groupDiv.className = 'group';
    groupDiv.setAttribute('data-group', groupCount);
    groupDiv.innerHTML = `
        <h4 id="group-label-${groupCount}">Group ${groupCount}</h4>
        <textarea aria-labelledby="group-label-${groupCount}" aria-describedby="stats-${groupCount}" placeholder="Enter values (one per line)"></textarea>
        <div class="group-stats" id="stats-${groupCount}" aria-live="polite"></div>
    `;
    container.appendChild(groupDiv);
}

function removeGroup() {
    if (groupCount <= 2) {
        alert('Minimum 2 groups required');
        return;
    }
    const container = document.getElementById('groupsContainer');
    const lastGroup = container.querySelector(`[data-group="${groupCount}"]`);
    if (lastGroup) {
        container.removeChild(lastGroup);
        groupCount--;
    }
}

function loadSampleData(datasetName) {
    const dataset = sampleDatasets[datasetName];
    if (!dataset) return;

    document.getElementById('sampleMenu').classList.remove('show');
    document.getElementById('sample-data-btn').setAttribute('aria-expanded', 'false');

    const container = document.getElementById('groupsContainer');
    container.innerHTML = '';
    groupCount = dataset.groups.length;

    const header = document.querySelector('.card h2');
    const existingInfo = document.querySelector('.dataset-info');
    if (existingInfo) existingInfo.remove();

    const info = document.createElement('div');
    info.className = 'dataset-info';
    info.innerHTML = `<strong>${dataset.name}:</strong> ${dataset.description}`;
    header.parentNode.insertBefore(info, header.nextSibling);

    dataset.groups.forEach((group, index) => {
        const groupDiv = document.createElement('div');
        groupDiv.className = 'group';
        groupDiv.setAttribute('data-group', index + 1);
        groupDiv.innerHTML = `
            <h4 id="group-label-${index + 1}">${group.name}</h4>
            <textarea aria-labelledby="group-label-${index + 1}" aria-describedby="stats-${index + 1}" placeholder="Enter values (one per line)">${group.data.join('\n')}</textarea>
            <div class="group-stats" id="stats-${index + 1}" aria-live="polite"></div>
        `;
        container.appendChild(groupDiv);
        updateGroupStats(index + 1);
    });
}

function clearAll() {
    const textareas = document.querySelectorAll('.group textarea');
    textareas.forEach(textarea => { textarea.value = ''; });
    const stats = document.querySelectorAll('.group-stats');
    stats.forEach(stat => { stat.innerHTML = ''; });
    const datasetInfo = document.querySelector('.dataset-info');
    if (datasetInfo) datasetInfo.remove();
    document.getElementById('resultsSection').classList.add('hidden');
}

function updateGroupStats(groupNum) {
    const group = document.querySelector(`[data-group="${groupNum}"]`);
    if (!group) return;
    const textarea = group.querySelector('textarea');
    const statsDiv = document.getElementById(`stats-${groupNum}`);

    const values = textarea.value.split('\n')
        .map(v => parseFloat(v.trim()))
        .filter(v => !isNaN(v));

    if (values.length === 0) {
        statsDiv.innerHTML = '';
        return;
    }

    const mean = values.reduce((a, b) => a + b, 0) / values.length;
    const variance = values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length;

    statsDiv.innerHTML = `n=${values.length} | mean=${mean.toFixed(2)} | σ²=${variance.toFixed(2)}`;
}

function getGroupData() {
    const groups = document.querySelectorAll('.group');
    const data = [];

    groups.forEach(group => {
        const textarea = group.querySelector('textarea');
        const values = textarea.value.split('\n')
            .map(v => parseFloat(v.trim()))
            .filter(v => !isNaN(v));

        if (values.length > 0) {
            data.push(values);
        }
    });

    return data;
}

function mean(arr) {
    return arr.reduce((a, b) => a + b, 0) / arr.length;
}

function fCDF(f, df1, df2) {
    const x = df2 / (df2 + df1 * f);
    return 1 - incompleteBeta(x, df2 / 2, df1 / 2);
}

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

function betaCF(x, a, b) {
    const maxIterations = 100;
    const epsilon = 3e-7;
    const qab = a + b;
    const qap = a + 1;
    const qam = a - 1;
    let c = 1;
    let d = 1 - qab * x / qap;

    if (Math.abs(d) < epsilon) d = epsilon;
    d = 1 / d;
    let h = d;

    for (let m = 1; m <= maxIterations; m++) {
        const m2 = 2 * m;
        let aa = m * (b - m) * x / ((qam + m2) * (a + m2));
        d = 1 + aa * d;
        if (Math.abs(d) < epsilon) d = epsilon;
        c = 1 + aa / c;
        if (Math.abs(c) < epsilon) c = epsilon;
        d = 1 / d;
        h *= d * c;

        aa = -(a + m) * (qab + m) * x / ((a + m2) * (qap + m2));
        d = 1 + aa * d;
        if (Math.abs(d) < epsilon) d = epsilon;
        c = 1 + aa / c;
        if (Math.abs(c) < epsilon) c = epsilon;
        d = 1 / d;
        const del = d * c;
        h *= del;

        if (Math.abs(del - 1) < epsilon) break;
    }

    return h;
}

function gammaLn(x) {
    const cof = [
        76.18009172947146, -86.50532032941677,
        24.01409824083091, -1.231739572450155,
        0.1208650973866179e-2, -0.5395239384953e-5
    ];

    let y = x;
    let tmp = x + 5.5;
    tmp -= (x + 0.5) * Math.log(tmp);
    let ser = 1.000000000190015;

    for (let j = 0; j < 6; j++) {
        ser += cof[j] / ++y;
    }

    return -tmp + Math.log(2.5066282746310005 * ser / x);
}

function calculateANOVA() {
    const data = getGroupData();

    if (data.length < 2) {
        alert('Please enter data for at least 2 groups');
        return;
    }

    if (data.some(group => group.length < 2)) {
        alert('Each group must have at least 2 values');
        return;
    }

    const groupMeans = data.map(group => mean(group));

    const allValues = data.flat();
    const grandMean = mean(allValues);
    const n = allValues.length;
    const k = data.length;

    const ssB = data.reduce((sum, group, i) => {
        return sum + group.length * Math.pow(groupMeans[i] - grandMean, 2);
    }, 0);

    const ssW = data.reduce((sum, group, i) => {
        return sum + group.reduce((groupSum, value) => {
            return groupSum + Math.pow(value - groupMeans[i], 2);
        }, 0);
    }, 0);

    const ssT = allValues.reduce((sum, value) => {
        return sum + Math.pow(value - grandMean, 2);
    }, 0);

    const dfB = k - 1;
    const dfW = n - k;

    const msB = ssB / dfB;
    const msW = ssW / dfW;

    const fStat = msB / msW;
    const pValue = 1 - fCDF(fStat, dfB, dfW);

    displayResults({
        fStat, pValue, dfB, dfW, ssB, ssW, ssT, msB, msW,
        groupMeans, grandMean, data
    });
}

function displayResults(results) {
    document.getElementById('resultsSection').classList.remove('hidden');

    document.getElementById('fStatistic').textContent = results.fStat.toFixed(4);
    document.getElementById('pValue').textContent = results.pValue.toFixed(6);
    document.getElementById('dfValue').textContent = `${results.dfB}, ${results.dfW}`;

    const conclusionDiv = document.getElementById('conclusionAlert');
    const alpha = 0.05;
    if (results.pValue < alpha) {
        conclusionDiv.className = 'alert alert-success';
        conclusionDiv.innerHTML = `
            <strong>Significant Result!</strong>
            With p = ${results.pValue.toFixed(6)} < ${alpha}, we reject the null hypothesis.
            There is strong statistical evidence that at least one group mean is significantly different from the others.
        `;
    } else {
        conclusionDiv.className = 'alert alert-warning';
        conclusionDiv.innerHTML = `
            <strong>Not Significant.</strong>
            With p = ${results.pValue.toFixed(6)} ≥ ${alpha}, we fail to reject the null hypothesis.
            There is insufficient evidence to conclude that the group means are different.
        `;
    }

    const tableBody = document.getElementById('anovaTableBody');
    tableBody.innerHTML = `
        <tr>
            <td>Between Groups</td>
            <td>${results.ssB.toFixed(4)}</td>
            <td>${results.dfB}</td>
            <td>${results.msB.toFixed(4)}</td>
            <td>${results.fStat.toFixed(4)}</td>
            <td>${results.pValue.toFixed(6)}</td>
        </tr>
        <tr>
            <td>Within Groups</td>
            <td>${results.ssW.toFixed(4)}</td>
            <td>${results.dfW}</td>
            <td>${results.msW.toFixed(4)}</td>
            <td>-</td>
            <td>-</td>
        </tr>
        <tr>
            <td><strong>Total</strong></td>
            <td><strong>${results.ssT.toFixed(4)}</strong></td>
            <td><strong>${results.dfB + results.dfW}</strong></td>
            <td>-</td>
            <td>-</td>
            <td>-</td>
        </tr>
    `;

    createVisualization(results.data, results.groupMeans, results.grandMean);

    document.getElementById('ssActual').style.display = 'block';
    document.getElementById('ssActual').innerHTML = `${results.ssT.toFixed(4)} = ${results.ssB.toFixed(4)} + ${results.ssW.toFixed(4)}`;

    document.getElementById('dfActual').style.display = 'block';
    document.getElementById('dfActual').innerHTML = `df_between = ${results.dfB}, df_within = ${results.dfW}`;

    document.getElementById('msActual').style.display = 'block';
    document.getElementById('msActual').innerHTML = `MS_between = ${results.ssB.toFixed(4)} / ${results.dfB} = ${results.msB.toFixed(4)}<br>MS_within = ${results.ssW.toFixed(4)} / ${results.dfW} = ${results.msW.toFixed(4)}`;

    document.getElementById('fActual').style.display = 'block';
    document.getElementById('fActual').innerHTML = `F = ${results.msB.toFixed(4)} / ${results.msW.toFixed(4)} = ${results.fStat.toFixed(4)}`;

    document.getElementById('resultsSection').scrollIntoView({ behavior: 'smooth' });
}

function createVisualization(data, groupMeans, grandMean) {
    const ctx = document.getElementById('visualization').getContext('2d');

    if (chart) {
        chart.destroy();
    }

    const colors = [
        'rgba(255, 89, 125, 0.7)',
        'rgba(0, 103, 251, 0.7)',
        'rgba(139, 227, 103, 0.7)',
        'rgba(255, 165, 0, 0.7)',
        'rgba(138, 43, 226, 0.7)',
        'rgba(0, 255, 255, 0.7)'
    ];

    const groupStats = data.map((group, i) => {
        const sorted = [...group].sort((a, b) => a - b);
        const len = sorted.length;
        return {
            min: sorted[0],
            q1: sorted[Math.floor(len * 0.25)],
            median: sorted[Math.floor(len * 0.5)],
            q3: sorted[Math.floor(len * 0.75)],
            max: sorted[len - 1],
            mean: groupMeans[i]
        };
    });

    chart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: data.map((_, i) => `Group ${i + 1}`),
            datasets: [{
                label: 'Group Means',
                data: groupMeans,
                backgroundColor: colors.slice(0, data.length),
                borderColor: colors.slice(0, data.length).map(c => c.replace('0.7', '1')),
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            aspectRatio: 2.5,
            plugins: {
                title: {
                    display: true,
                    text: 'Group Means Comparison',
                    color: 'var(--c-text-primary)',
                    font: { size: 18, weight: 'bold' }
                },
                legend: { display: false },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    titleColor: '#fff',
                    bodyColor: '#fff',
                    borderColor: 'rgba(255, 255, 255, 0.3)',
                    borderWidth: 1,
                    padding: 12,
                    displayColors: false,
                    callbacks: {
                        title: function(context) {
                            return context[0].label;
                        },
                        label: function(context) {
                            const i = context.dataIndex;
                            const stats = groupStats[i];
                            return [
                                `Mean: ${stats.mean.toFixed(2)}`,
                                `Median: ${stats.median.toFixed(2)}`,
                                `Range: ${stats.min.toFixed(2)} - ${stats.max.toFixed(2)}`,
                                `Q1: ${stats.q1.toFixed(2)}`,
                                `Q3: ${stats.q3.toFixed(2)}`
                            ];
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: false,
                    title: {
                        display: true,
                        text: 'Values',
                        color: 'var(--c-text-secondary)',
                        font: { size: 14 }
                    },
                    grid: { color: 'rgba(255, 255, 255, 0.1)' },
                    ticks: {
                        color: 'var(--c-text-secondary)',
                        font: { size: 12 }
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'Groups',
                        color: 'var(--c-text-secondary)',
                        font: { size: 14 }
                    },
                    grid: { display: false },
                    ticks: {
                        color: 'var(--c-text-secondary)',
                        font: { size: 12 }
                    }
                }
            }
        }
    });
}

// Attach all event listeners once DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('add-group-btn').addEventListener('click', addGroup);
    document.getElementById('remove-group-btn').addEventListener('click', removeGroup);
    document.getElementById('sample-data-btn').addEventListener('click', toggleSampleMenu);
    document.getElementById('clear-all-btn').addEventListener('click', clearAll);
    document.getElementById('calculate-btn').addEventListener('click', calculateANOVA);

    // Sample dataset buttons (identified by data-dataset attribute)
    document.querySelectorAll('#sampleMenu [data-dataset]').forEach(function(btn) {
        btn.addEventListener('click', function() {
            loadSampleData(this.getAttribute('data-dataset'));
        });
    });

    // Close sample dropdown when clicking outside
    document.addEventListener('click', function(event) {
        const dropdown = document.querySelector('.sample-data-dropdown');
        const menu = document.getElementById('sampleMenu');
        if (dropdown && !dropdown.contains(event.target)) {
            menu.classList.remove('show');
            document.getElementById('sample-data-btn').setAttribute('aria-expanded', 'false');
        }
    });

    // Close sample dropdown on Escape key
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape') {
            const menu = document.getElementById('sampleMenu');
            if (menu.classList.contains('show')) {
                menu.classList.remove('show');
                document.getElementById('sample-data-btn').setAttribute('aria-expanded', 'false');
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
});
