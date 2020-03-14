mood = "happy"
time = "now"
activity = "eat"
friends = ["@DemoShizuka", "@Doraemon"]

timeDict = {
    'past' : {tense: "past"},
    'now' : {tense: "present", progressive: "progressive"},
    'future' : {tense: "future", progressive: "progressive"},
}

activityDict = {
    'eat' : {verb: "go", object: "to eat"},
    'run' : {verb: "go", object: "to run"},
    'dance' : {verb: "go", object: "to dance"},
    'swim' : {verb: "go", object: "to swim"},
    'basketball' : {verb: "play", object: "basketball"},
    'cycle' : {verb: "go", object: "to cycle"},
    'badminton' : {verb: "play", object: "badminton"},
    'karaoke' : {verb: "go", object: "to karaoke"},
    'movie' : {verb: "watch", object: "movies"},
    'shop' : {verb: "go", object: "to shopping"},
    'party' : {verb: "go", object: "to party"},
    'read' : {verb: "read", object: "books"},
    'game' : {verb: "play", object: "games"},
}

// Feeling happy
function transformMood (mood) {
    return "Feeling " + mood;
}

// with @DemoShizuka and @Doraemon.
function transformFriends (friends)  {
    if (friends.length == 0) {
        return ".";
    } else if (friends.length == 1) {
        return " with " + friends[0] + ".";
    } else {
        ret = " with " + friends[0];
        for (i=1; i<friends.length-1; i++) {
            ret += ", " + friends[i];
        }
        ret += " and " +  friends[friends.length-1] + ".";
        return ret;
    }
}

// Feeling happy with @DemoShizuka and @Doraemon.
function firstSentence (mood, friends) {
    return transformMood(mood) + transformFriends(friends);
}

// &subject=we&tense=present&progressive=progressive&verb=go&object=to eat
function constructGetUrl(friends, time, activity) {
    inputDict = {};
    if (friends.length == 0) {
        inputDict['subject'] = "i";
    } else {
        inputDict['subject'] = "we";
    }

    for (let pairs of Object.entries(timeDict[time])) {
        inputDict[pairs[0]] = pairs[1];
    }
    for (let pairs of Object.entries(activityDict[activity])) {
        inputDict[pairs[0]] = pairs[1];
    }
    inputString = "";
    for (let pairs of Object.entries(inputDict)) {
        inputString += "&" + pairs[0] + "=" + pairs[1];
    }
    return "https://linguatools-sentence-generating.p.rapidapi.com/realise?objdet=- " + inputString;
}

// We are going to eat.
async function secondSentence (friends, time, activity) {
    url =  constructGetUrl(friends, time, activity)
    let response = await fetch(url, {
        "method": "GET",
        "headers": {
            "x-rapidapi-host": "linguatools-sentence-generating.p.rapidapi.com",
            "x-rapidapi-key": "e08b0b9718mshf9caa6e045494b9p1d6fc2jsn503b0b5d87ac",
        },
    });
    let json = await response.json();
    return json.sentence;
}

async function generateSentence(friends, mood, time, activity) {
    const second = await secondSentence(friends, time, activity);
    return firstSentence(mood, friends) + " " + second;
}

async function test() {
    friends = [];
    for (var element of document.getElementById("friends").children) {
        if (element.selected) {
            friends.push(element.value);
        }
    }

    mood = "";
    for (var element of document.getElementById("mood")) {
        if (element.selected) {
            mood = element.value;
        }
    }

    time = "";
    for (var element of document.getElementById("time")) {
        if (element.selected) {
            time = element.value;
        }
    }

    activity = "";
    for (var element of document.getElementById("activity")) {
        if (element.selected) {
            activity = element.value;
        }
    }    

    console.log(friends);
    console.log(mood);
    console.log(time);
    console.log(activity);

    sentence = await generateSentence(friends, mood, time, activity);
    alert(sentence);
}
