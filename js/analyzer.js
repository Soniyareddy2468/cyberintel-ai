function analyzeEmail() {

    const sender =
        document.getElementById("senderEmail").value.trim();

    const subject =
        document.getElementById("emailSubject").value.trim();

    const content =
        document.getElementById("emailContent").value.trim();


    if (!sender || !subject || !content) {

        alert(
            "Please enter sender email, subject and email content."
        );

        return;
    }


    const button =
        document.getElementById("analyzeButton");

    const loading =
        document.getElementById("loadingState");

    const result =
        document.getElementById("analysisResult");


    button.disabled = true;

    button.style.opacity = "0.6";

    loading.classList.remove("hidden");

    result.classList.add("hidden");


    setTimeout(() => {

        const analysis =
            performDemoAnalysis(
                sender,
                subject,
                content
            );


        displayAnalysis(
            sender,
            analysis
        );


        loading.classList.add("hidden");

        result.classList.remove("hidden");

        button.disabled = false;

        button.style.opacity = "1";


        result.scrollIntoView({
            behavior: "smooth"
        });


    }, 1500);

}


/*
    DEMO DETECTION ENGINE

    This will later be replaced by:

    fetch("https://YOUR-BACKEND/api/analyze-email")

    The current version allows the GitHub Pages
    frontend to work without a backend.
*/

function performDemoAnalysis(
    sender,
    subject,
    content
) {

    const fullText =
        `${sender} ${subject} ${content}`
            .toLowerCase();


    const phishingKeywords = [

        "urgent",
        "verify",
        "verification",
        "password",
        "account",
        "suspended",
        "blocked",
        "login",
        "sign in",
        "click here",
        "confirm",
        "security alert",
        "update your account",
        "reset",
        "payment",
        "invoice",
        "bank",
        "winner",
        "gift",
        "immediately"

    ];


    let keywordCount = 0;


    phishingKeywords.forEach(keyword => {

        if (fullText.includes(keyword)) {
            keywordCount++;
        }

    });


    const urlMatches =
        content.match(
            /(https?:\/\/[^\s]+)/gi
        ) || [];


    const ipMatches =
        content.match(
            /\b(?:\d{1,3}\.){3}\d{1,3}\b/g
        ) || [];


    const suspiciousDomains = [

        ".tk",
        ".ml",
        ".ga",
        ".cf",
        ".gq",
        "bit.ly",
        "tinyurl",
        "login-",
        "verify-",
        "secure-"

    ];


    let suspiciousUrls = 0;


    urlMatches.forEach(url => {

        suspiciousDomains.forEach(domain => {

            if (
                url.toLowerCase().includes(domain)
            ) {
                suspiciousUrls++;
            }

        });

    });


    const freeMailProviders = [

        "gmail.com",
        "yahoo.com",
        "outlook.com",
        "hotmail.com"

    ];


    const senderDomain =
        sender.includes("@")
            ? sender.split("@")[1].toLowerCase()
            : "";


    let senderRisk = 15;


    if (
        freeMailProviders.includes(
            senderDomain
        )
    ) {
        senderRisk += 20;
    }


    if (
        sender.includes("-security") ||
        sender.includes("support-") ||
        sender.includes("admin-")
    ) {
        senderRisk += 25;
    }


    let socialScore =
        Math.min(
            keywordCount * 7,
            95
        );


    let urlScore =
        Math.min(
            urlMatches.length * 20 +
            suspiciousUrls * 30,
            100
        );


    let phishingScore =
        Math.min(
            keywordCount * 6 +
            suspiciousUrls * 15 +
            urlMatches.length * 5,
            100
        );


    let riskScore =
        Math.round(
            (
                phishingScore * 0.4 +
                urlScore * 0.2 +
                senderRisk * 0.15 +
                socialScore * 0.25
            )
        );


    riskScore =
        Math.max(
            1,
            Math.min(
                riskScore,
                100
            )
        );


    let level;

    let description;

    let recommendation;

    let action;


    if (riskScore >= 75) {

        level = "HIGH RISK";

        description =
            "Multiple indicators suggest that this email may represent a phishing or social-engineering threat.";

        recommendation =
            "Quarantine the email, investigate the indicators of compromise and notify the security administrator.";

        action = "QUARANTINE";

    }

    else if (riskScore >= 45) {

        level = "MEDIUM RISK";

        description =
            "The email contains several suspicious characteristics that require additional investigation.";

        recommendation =
            "Warn the recipient and perform additional threat-intelligence checks before allowing interaction.";

        action = "WARN";

    }

    else {

        level = "LOW RISK";

        description =
            "No major threat indicators were detected by the current demonstration rules.";

        recommendation =
            "Allow the message while continuing normal security monitoring.";

        action = "ALLOW";

    }


    return {

        riskScore,

        level,

        description,

        recommendation,

        action,

        phishingScore,

        urlScore,

        senderRisk:
            Math.min(senderRisk, 100),

        socialScore,

        urlCount:
            urlMatches.length,

        ipCount:
            ipMatches.length,

        keywordCount

    };

}


function displayAnalysis(
    sender,
    analysis
) {

    document.getElementById(
        "resultScore"
    ).textContent =
        analysis.riskScore;


    document.getElementById(
        "riskLevel"
    ).textContent =
        analysis.level;


    document.getElementById(
        "riskDescription"
    ).textContent =
        analysis.description;


    document.getElementById(
        "recommendation"
    ).textContent =
        analysis.recommendation;


    document.getElementById(
        "phishingScore"
    ).textContent =
        analysis.phishingScore + "%";


    document.getElementById(
        "urlScore"
    ).textContent =
        analysis.urlScore + "%";


    document.getElementById(
        "senderScore"
    ).textContent =
        analysis.senderRisk + "%";


    document.getElementById(
        "socialScore"
    ).textContent =
        analysis.socialScore + "%";


    document.getElementById(
        "phishingProgress"
    ).style.width =
        analysis.phishingScore + "%";


    document.getElementById(
        "urlProgress"
    ).style.width =
        analysis.urlScore + "%";


    document.getElementById(
        "senderProgress"
    ).style.width =
        analysis.senderRisk + "%";


    document.getElementById(
        "socialProgress"
    ).style.width =
        analysis.socialScore + "%";


    document.getElementById(
        "iocSender"
    ).textContent =
        sender;


    document.getElementById(
        "iocUrls"
    ).textContent =
        analysis.urlCount;


    document.getElementById(
        "iocIps"
    ).textContent =
        analysis.ipCount;


    document.getElementById(
        "iocKeywords"
    ).textContent =
        analysis.keywordCount;


    const actionBadge =
        document.getElementById(
            "actionBadge"
        );


    actionBadge.textContent =
        analysis.action;


    actionBadge.className =
        "badge";


    if (analysis.riskScore >= 75) {

        actionBadge.classList.add(
            "badge-danger"
        );

    }

    else if (analysis.riskScore >= 45) {

        actionBadge.classList.add(
            "badge-warning"
        );

    }

    else {

        actionBadge.classList.add(
            "badge-safe"
        );

    }


    const circle =
        document.getElementById(
            "resultScoreCircle"
        );


    if (analysis.riskScore >= 75) {

        circle.style.borderColor =
            "rgba(255,92,112,0.45)";

    }

    else if (analysis.riskScore >= 45) {

        circle.style.borderColor =
            "rgba(246,173,85,0.45)";

    }

    else {

        circle.style.borderColor =
            "rgba(54,211,153,0.45)";

    }

}
