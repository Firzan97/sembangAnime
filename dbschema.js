let db = {
    users: [
        {
            userId: "sasadasfasafdasa",
            email: "firzan@gmail.com",
            handle: "user",
            createdAt: "2019-03-15T10:59:52.798Z",
            imageUrl: "image/sasadasadfa/rwqeqeqrq",
            bio: "Hello, my name is user, nice to meet you",
            website: "https://user.com",
            location: "london,uk"
        }

    ],
    screams: [
        {
            userhandle: "user",
            body: "This is scream BODY",
            createdAt: "2020-08-19T09:08:17.668Z",
            likeCount: 5,
            commentCount: 2,
        }
    ],
    comments: [{
        userHandle: 'user',
        screamId: 'sasasasasasa',
        body: 'This is a sample scream',
        createdAt: '2020-08-22T10:59:52.798Z',
    }
    ]
};

const userDetails = {
    //redux data
    credentials: {
        userId: "dESSKtJLMGhJ0NJEDdNlU7X80rj1",
        email: "firzan22@gmail.com",
        handle: "Firzan22",
        createdAt: "2020-08-21T08:42:18.387Z",
        imageUrl: "https://firebasestorage.googleapis.com/v0/b/social-app-94f94.appspot.com/o/72440863.png?alt=media",
        bio: "My name is firzan",
        website: "http://user.com",
        location: "London,UK"
    },
    likes: [
        {
            userHandle: "user",
            screamId: "",
        },
        {
            userHandle: "user",
            screamId: "",
        }
    ]
}