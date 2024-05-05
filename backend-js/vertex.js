const { Storage } = require('@google-cloud/storage');
const { VertexAI } = require('@google-cloud/vertexai');
const {clientMongo} = require("./config");

const storage = new Storage();
const bucket = storage.bucket('screenshots-d1cba.appspot.com');
const vertexAI = new VertexAI({project: 'screenshots-d1cba', location: 'us-central1'});
const model = 'gemini-1.5-pro-preview-0409';

const generativeModel = vertexAI.preview.getGenerativeModel({
    model: model,
    generationConfig: {
        'maxOutputTokens': 8192,
        'temperature': 1,
        'topP': 0.95,
    },
});

async function analyzeContent(activityID, username, openFiles) {
    let prompt = {
        text: 'Please generate a JSON response containing an assessment of fraud risk (low, medium, high) and the percentage of fraud. Carefully analyze the provided screenshots, information about fraud attempts (fraudAttempts), and the monitoring application (monitorApp). The only permitted open tab is \'BLENDED LEARNING @ ASE - Google Chrome\'. The JSON should have the assesment and percentage.'
    };

    if(openFiles) {
        prompt.text += `The only permitted files have ${username} in the name.`;
    } else {
        prompt.text += 'No files should be open.';
    }

    let data = await getData(activityID, username);
    let jsonData = JSON.stringify(data);
    prompt.text += `\n ${jsonData}`;

    const contents = [{ role: 'user', parts: [prompt] }];

    const [files] = await bucket.getFiles({ prefix: `${activityID}/${username}/` });
    for (const file of files) {
        const fileUri = `gs://${bucket.name}/${file.name}`;
        contents[0].parts.push({ fileData: { mimeType: 'image/png', fileUri: fileUri } });
    }

    const req = { contents };

    const streamingResp = await generativeModel.generateContentStream(req);

    const response = await streamingResp.response;
    process.stdout.write('aggregated response: ' + JSON.stringify(response) + '\n');
    const textResponse = response.candidates[0].content.parts[0].text;
    const assessmentBlockMatch = textResponse.match(/```json\n({.*?})\n```/s);

    if (assessmentBlockMatch && assessmentBlockMatch[1]) {
        const assessmentData = JSON.parse(assessmentBlockMatch[1]);
        return assessmentData;
    } else {
        console.error('Could not find assessment data in the response');
    }
}

async function getData(activityID, username) {
    const examsDatabase = clientMongo.db('Exams');
    const exams = examsDatabase.collection('Exams');

    const query = { activityID: activityID, 'submits.username': username };
    const projection = { 'submits.$': 1 };
    const exam = await exams.findOne(query, { projection });

    return exam;
}

module.exports = analyzeContent;
