document.addEventListener("DOMContentLoaded", function () {

    console.log("CyberIntel AI dashboard loaded.");

    initializeThreatChart();

    animateDashboard();

});


function animateDashboard() {

    const cards = document.querySelectorAll(
        ".stat-card, .panel, .welcome-card"
    );

    cards.forEach((card, index) => {

        card.style.opacity = "0";

        card.style.transform = "translateY(10px)";

        setTimeout(() => {

            card.style.transition =
                "opacity 0.4s ease, transform 0.4s ease";

            card.style.opacity = "1";

            card.style.transform = "translateY(0)";

        }, index * 70);

    });

}


function initializeThreatChart() {

    const canvas =
        document.getElementById("threatChart");

    if (!canvas || typeof Chart === "undefined") {
        return;
    }


    new Chart(canvas, {

        type: "line",

        data: {

            labels: [
                "Mon",
                "Tue",
                "Wed",
                "Thu",
                "Fri",
                "Sat",
                "Sun"
            ],

            datasets: [

                {
                    label: "Threats Detected",

                    data: [
                        18,
                        25,
                        21,
                        34,
                        28,
                        41,
                        35
                    ],

                    borderColor: "#35a7ff",

                    backgroundColor:
                        "rgba(53,167,255,0.08)",

                    tension: 0.4,

                    fill: true,

                    pointRadius: 3

                }

            ]

        },

        options: {

            responsive: true,

            maintainAspectRatio: false,

            plugins: {

                legend: {
                    display: false
                }

            },

            scales: {

                y: {

                    beginAtZero: true,

                    grid: {
                        color:
                            "rgba(255,255,255,0.05)"
                    },

                    ticks: {
                        color: "#8ea2b8",
                        font: {
                            size: 9
                        }
                    }

                },

                x: {

                    grid: {
                        display: false
                    },

                    ticks: {
                        color: "#8ea2b8",
                        font: {
                            size: 9
                        }
                    }

                }

            }

        }

    });

}
