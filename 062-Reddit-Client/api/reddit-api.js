// Set Up Constant
const url = "https://www.reddit.com";

// Subreddit names for Side Menu
export const fetchSubredditNames = async () => {
    const endpoint = `${url}/subreddits.json`;
    const response = await fetch(endpoint);
    const jsonResponse = await response.json();
    return jsonResponse.data.children.map((subreddit) => subreddit.data);
};

// Fetch Posts
export const fetchPostsHot = async (subreddit) => {
    let endpoint;
    if (subreddit) {
        endpoint = `${url}/${subreddit}/hot.json`;
    } else {
        endpoint = `${url}/hot.json`;
    }

    const response = await fetch(endpoint);
    const jsonResponse = await response.json();

    return jsonResponse.data.children;
};

export const fetchPostsNew = async (subreddit) => {
    let endpoint;
    if (subreddit) {
        endpoint = `${url}/${subreddit}/new.json`;
    } else {
        endpoint = `${url}/new.json`;
    }

    const response = await fetch(endpoint);
    const jsonResponse = await response.json();

    return jsonResponse.data.children;
};

export const fetchPostsTop = async (subreddit) => {
    let endpoint;
    if (subreddit) {
        endpoint = `${url}/${subreddit}/top.json`;
    } else {
        endpoint = `${url}/top.json`;
    }

    const response = await fetch(endpoint);
    const jsonResponse = await response.json();

    return jsonResponse.data.children;
};

// Fetch Search Results
export const fetchSearchResults = async (searchTerm) => {
    const endpoint = `${url}/search.json?q=${searchTerm}`;
    const response = await fetch(endpoint);
    const jsonResponse = await response.json();

    return jsonResponse.data.children;
};

// Subreddit Info for About Card
export const fetchSubredditAbout = async (subreddit) => {
    const endpoint = `${url}/${subreddit}/about.json`;
    const response = await fetch(endpoint);
    const jsonResponse = await response.json();

    return jsonResponse.data;
};

// User Avatar
export const fetchUserAvatar = async (user) => {
    const endpoint = `https://www.reddit.com/user/${user}/about.json`;
    const response = await fetch(endpoint);
    const jsonResponse = await response.json();

    return jsonResponse.data;
};

// Fetch Comments
export const fetchComments = async (permalink) => {
    const endpoint = `${url}/${permalink}/.json`;
    const response = await fetch(endpoint);
    const jsonResponse = await response.json();

    return jsonResponse[1].data.children.map((comment) => comment.data);
};