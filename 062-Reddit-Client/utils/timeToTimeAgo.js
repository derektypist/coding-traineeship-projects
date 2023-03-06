// Function to Calculate time to time Ago
function timeToTimeAgo(ts) {
    // Get Current Time
    let d = new Date();
    // Get Time in Seconds
    let nowTs = Math.floor(d.getTime() / 1000);
    let seconds = nowTs - ts;

    // More than 2 days
    if (seconds > 2 * 24 * 3600) {
        return "A few days ago";
    }

    // 1 day ago
    if (seconds > 24 * 3600) {
        return "yesterday";
    }

    // 1 hour to 12 hours ago
    if (seconds > 12 * 3600) {
        return "12h ago";
    }

    if (seconds > 11 * 3600) {
        return "11h ago";
    }

    if (seconds > 10 * 3600) {
        return "10h ago";
    }

    if (seconds > 9 * 3600) {
        return "9h ago";
    }

    if (seconds > 8 * 3600) {
        return "8h ago";
    }

    if (seconds > 7 * 3600) {
        return "7h ago";
    }

    if (seconds > 6 * 3600) {
        return "6h ago";
    }

    if (seconds > 5 * 3600) {
        return "5h ago";
    }

    if (seconds > 4 * 3600) {
        return "4h ago";
    }

    if (seconds > 3 * 3600) {
        return "3h ago";
    }

    if (seconds > 2 * 3600) {
        return "2h ago";
    }

    if (seconds > 3600) {
        return "1h ago";
    }

    // More than 1 minute but up to 60 minutes
    if (seconds > 60) {
        return Math.floor(seconds / 60) + "m ago";
    }

    // Up to 1 minute
    if (seconds <= 60) {
        return "just now";
    }
}

export default timeToTimeAgo;