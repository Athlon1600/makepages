const seattlePopulationData = [
    {"year": 2006, "population": 583017},
    {"year": 2007, "population": 592856},
    {"year": 2008, "population": 603404},
    {"year": 2009, "population": 618420},
    {"year": 2010, "population": 610654},
    {"year": 2011, "population": 623130},
    {"year": 2012, "population": 636557},
    {"year": 2013, "population": 654300},
    {"year": 2014, "population": 670896},
    {"year": 2015, "population": 688247},
    {"year": 2016, "population": 710687},
    {"year": 2017, "population": 729644},
    {"year": 2018, "population": 742889},
    {"year": 2019, "population": 753291},
    {"year": 2020, "population": 740565},
    {"year": 2021, "population": 731757},
    {"year": 2022, "population": 749134},
    {"year": 2023, "population": 755078},
    {"year": 2024, "population": 780995},
    {"year": 2025, "population": 791093},
    {"year": 2026, "population": 801192}
];

document.addEventListener('DOMContentLoaded', function () {

    const filtered = seattlePopulationData.filter((datum) => {
        return datum.year % 2 === 0;
    });

    const years = filtered.map(d => d.year);
    const populationData = filtered.map(d => d.population);

    const ctx = document.getElementById('populationChart').getContext('2d');

    const chartObject = new Chart(ctx, {
        type: 'line',
        data: {
            labels: years,
            datasets: [{
                label: 'Population Estimate',
                data: populationData,
                borderColor: '#1a73e8',
                backgroundColor: 'rgba(26, 115, 232, 0.1)',
                borderWidth: 3,
                pointBackgroundColor: '#1a73e8',
                pointRadius: 3,
                fill: true,
                tension: 0.1 // Slight curve for a smoother line
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            interaction: {
                mode: 'index',
                intersect: false
            },
            plugins: {
                legend: {
                    display: false,
                    position: 'top'
                },
                tooltip: {
                    callbacks: {
                        label: function (context) {
                            let label = context.dataset.label || '';
                            if (context.parsed.y !== null) {
                                label += ': ' + context.parsed.y.toLocaleString();
                            }
                            return label;
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: false,
                    title: {
                        display: true,
                        text: 'Population'
                    },
                    ticks: {
                        callback: function (value) {
                            return value.toLocaleString();
                        }
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'Year'
                    }
                }
            }
        }
    });
});