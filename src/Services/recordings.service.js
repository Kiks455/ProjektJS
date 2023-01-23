import axios from 'axios';
import Artist from '../classes/Artist';
import Recording from '../classes/Recording';

const recordingsAxiosInstance = axios.create({
    baseURL: "http://localhost:7777",
    timeout: 50000,
    responseType: 'json',
    headers: {
        'X-Requested-With': 'XMLHttpRequest',
        'Content-Type': 'application/json'
    }
})

async function addRecordings() {
    try{
        const musicBrainzResponse = await axios({
            url: 'https://musicbrainz.org/ws/2/recording/?query=arid:4d5447d7-c61c-4120-ba1b-d7f471d385b9',
            method: 'get',
            timeout: 1000,
            responseType: 'json',
            headers: {
                'Content-Type': 'application/json',
                "User-Agent": 'JSProject/1.0 (80607@student.pb.edu.pl)'
            }
        });
    
        const musicBrainzRecordings=musicBrainzResponse.data.recordings.filter((e, index)=>index<15);

        const recordings = musicBrainzRecordings.map(e => {
    
            const artists = e["artist-credit"].map(f => {
                const artist = new Artist(f.artist.id, f.artist.name);
    
                return artist;
            })
    
            let tags = [];
    
            if (e.tags) {
                tags = e.tags.map(g => {
                    const name = g.name;
    
                    return name;
                });
            }
    
            const exampleComments=[
                'Overall, the performance is too good. I enjoyed it',
                'I enjoyed every second of your performance.',
                'What a terrific performance!',
                'I loved almost everything about this recording. You need to perform more with your body and really commit to the performance.',
                'That was great! I loved how you acted throughout the song.',
                'Nice job! You have a great feel for this song. You bring a unique energy to the stage that sets you apart.',
                'Wow, with this performance, you set yourself apart from other singers. I think you need to have a bit more confidence while singing and looking at the audience. Try to vary it more and give us more dynamics to the performance.',
                'I like your voice, but I think you need to work on your stage presence. Thank you for the unbelievably great performance.',
                'The video is almost perfect.',
                'When you sing, it feels like there is music in the air.',
                'Superb musicianship, you play with confidence, and vocally you have a perfect tone. You are committed to the performance but remember to keep control even when you push that little more.',
                'You sound better than the original. I do not think I have ever heard a cover version that is as good as that.',
                'Your voice is soulful. That took my breath away! I wish I had a word to describe how I feel right now!',
                'Your performance made me speechless. So impressed. Bring variation to your performance and give the audience more dynamism. You show great musicianship, you play with confidence, and vocally you constantly show that you have a good tone. Your delivery is splendid, and it separates you and makes you stand out from your peers. You give everything of yourself while performing, and that is what others need to learn from you.'
            ];
        
            const comments = [];
            const usedIndexes = [];
            let index;
            let taken;
            let requiredLength = 3;
        
            while (comments.length < requiredLength) {
              index = parseInt((Math.random()*10).toFixed(0)%exampleComments.length);
              taken = usedIndexes.includes(index);
        
              if (taken === false) {
                usedIndexes.push(index);
                comments.push(exampleComments[index]);
              }
            }
    
            const rating=((Math.random() * 10).toFixed(0) % 5) + 1;
    
            const recording=new Recording(e.id, e.title, e.length, e["first-release-date"], tags, artists, rating, comments);
    
            return recording; 
    })

    const response = await recordingsAxiosInstance({
        url: '/recordings',
        method: 'post',
        data: recordings
    });

    return response;
}
catch(error){
    return error;
}
}

async function getRecordings() {
    try{
        const response = await recordingsAxiosInstance({
            url: '/recordings',
            method: 'get'
        })
    
        return response.data;
    }
    catch(error){
        return error;
    }
}

async function deleteRecording(id) {
    try{
        const response = await recordingsAxiosInstance({
            url: '/recording/' + id,
            method: 'delete'
        })
    
        return response;
    }
    catch(error){
        return error;
    }
}

function addNewRecording(recording) {
    try{
        const response = recordingsAxiosInstance.post("/recording", recording);
    
        return response;
    }
    catch(error){
        return error;
    }
    
}

function editRecording(index, recording) {
    try{
        const response = recordingsAxiosInstance.put("/recording/" + index, recording);
    
        return response;
    }
    catch(error){
        return error;
    }
    
}

const recordingsService = {
    addRecordings: addRecordings,
    getRecordings: getRecordings,
    deleteRecording: deleteRecording,
    addNewRecording: addNewRecording,
    editRecording: editRecording
}

export default recordingsService;