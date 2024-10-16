function linearRegression(x, y) {
    const n = x.length;
    const sumX = x.reduce((sum, xi) => sum + xi, 0);
    const sumY = y.reduce((sum, yi) => sum + yi, 0);
    const sumXY = x.reduce((sum, xi, i) => sum + xi * y[i], 0);
    const sumX2 = x.reduce((sum, xi) => sum + xi * xi, 0);

    const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
    const intercept = (sumY - slope * sumX) / n;

    const meanX = sumX / n;
    const meanY = sumY / n;

    const sumDiffProd = x.reduce((sum, xi, i) => sum + (xi - meanX) * (y[i] - meanY), 0);
    const sumDiffX2 = x.reduce((sum, xi) => sum + (xi - meanX) * (xi - meanX), 0);
    const sumDiffY2 = y.reduce((sum, yi) => sum + (yi - meanY) * (yi - meanY), 0);

    const r = sumDiffProd / Math.sqrt(sumDiffX2 * sumDiffY2);

    return { slope, intercept, r };
}

let chart;

document.getElementById('dataForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const xValues = document.getElementById('xValues').value.split(',').map(Number);
    const yValues = document.getElementById('yValues').value.split(',').map(Number);

    if (xValues.length !== yValues.length) {
        alert('X and Y values must have the same length.');
        return;
    }

    const result = linearRegression(xValues, yValues);
    console.log(`y = ${result.slope}x + ${result.intercept}`);
    console.log(`r = ${result.r}`);

    const equationElement = document.getElementById('equation');
    const correlationElement = document.getElementById('correlation');

    equationElement.textContent = `Equation: y = ${result.slope}x + ${result.intercept}`;
    correlationElement.textContent = `Correlation Coefficient (r): ${Math.abs(result.r)}`;

    const scatterData = xValues.map((xi, i) => ({ x: xi, y: yValues[i] }));
    const trendlineData = xValues.map(xi => ({ x: xi, y: result.slope * xi + result.intercept }));

    const ctx = document.getElementById('scatterPlot').getContext('2d');

    if (chart) {
        chart.destroy();
    }

    chart = new Chart(ctx, {
        type: 'scatter',
        data: {
            datasets: [
                {
                    label: 'Scatter Dataset',
                    data: scatterData,
                    backgroundColor: 'rgba(75, 192, 192, 1)',
                    borderColor: 'rgba(75, 192, 192, 1)',
                    pointBackgroundColor: 'rgba(255, 99, 132, 1)',
                    pointBorderColor: 'rgba(255, 99, 132, 1)',
                    pointRadius: 5,
                    pointHoverRadius: 7,
                    pointStyle: 'circle'
                },
                {
                    label: 'Trendline',
                    data: trendlineData,
                    type: 'line',
                    fill: false,
                    borderColor: 'rgba(54, 162, 235, 1)',
                    borderWidth: 2,
                    pointRadius: 0,
                    borderDash: [5, 5]
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: `Correlation Coefficient (r): ${Math.abs(result.r)}`,
                    font: {
                        size: 18,
                        weight: 'bold'
                    },
                    color: '#333'
                }
            },
            scales: {
                x: {
                    type: 'linear',
                    position: 'bottom',
                    title: {
                        display: true,
                        text: 'X Axis',
                        font: {
                            size: 14,
                            weight: 'bold'
                        },
                        color: '#333'
                    },
                    grid: {
                        color: 'rgba(200, 200, 200, 0.2)'
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Y Axis',
                        font: {
                            size: 14,
                            weight: 'bold'
                        },
                        color: '#333'
                    },
                    grid: {
                        color: 'rgba(200, 200, 200, 0.2)'
                    }
                }
            }
        }
    });
});