window.onload = () => {

const startButton = document.getElementById('review_quiz');
const quizIntro = document.getElementById('quiz_intro');
const quizQuestionsHolder = document.getElementById('quiz_questions_holder');
const answerList = document.getElementById('answer_list');
const feature = document.getElementById('feature');

const questionHolder = document.getElementById('question_holder');
const questionBox = document.getElementById('question');
const questionNumber = document.getElementById('questionNumber');

const notification = document.getElementById('correctNotif');
const audio = document.getElementById('correctAnswerBeep');
const wrongAudio = document.getElementById('wrongAnswer');

const quizProgress = document.getElementById('question_progress');
const progressBar = document.getElementById('progress_bar');

const quizEnd = document.getElementById('end_quiz');

const maxOpacity = 100;

let soundsToPlay = [...Object.keys(Array(10).fill(0))];

let answerBoxes = [];

let questionIndex = 0;

// Initialize the question DOM
for(let i = 0; i < 4; i++)
{
    let letter = "אבגד"[i];
    let answerButton = document.createElement('button');
    answerButton.className = 'answer_container';

    let letterContainer = document.createElement('div');
    letterContainer.className = 'letterContainer';
    letterContainer.innerText = letter;

    let answerText = document.createElement('div');
    answerText.className = 'answer_text';

    let crossline = document.createElement('img');
    crossline.className = 'crossline';
    crossline.src = 'pictures/crossline.svg';

    answerButton.appendChild(letterContainer);
    answerButton.appendChild(answerText);
    answerButton.appendChild(crossline);

    let box = {"button": answerButton, "text": answerText, "crossline": crossline};

    answerButton.onclick = () => {
        if(box.correct)
            displayCorrectAnswer();
        else
        {
            crossline.classList.add('active');
            answerButton.classList.add('disabled');
            wrongAudio.play();
        }
    }

    answerBoxes.push(box);

    answerList.appendChild(answerButton);
}

function displayCorrectAnswer()
{
    questionHolder.style.opacity = 0.2;
    notification.style.display = 'block';

    audio.src = `sounds/${soundsToPlay.splice(Math.random() * soundsToPlay.length, 1)}.wav`;
    audio.play();
    audio.onended = () => setTimeout(async () => {
        notification.style.animationName = 'zoomOut';
        setTimeout(() => {
            notification.style.animationName = '';
            notification.style.display = '';
        }, 600);
        await fade(quizQuestionsHolder, false);
        questionHolder.style.opacity = 1;
        if(questionIndex < 10)
            loadQuestion();
        else
        {
            fade(quizEnd, true);
            feature.style.height = '';
        }
    }, 100);
}

function fade(element, fadeIn)
{
    return new Promise((resolve, reject) => {
        if(fadeIn)
            element.style.display = 'block';
        let opacity = Number(element.style.opacity * maxOpacity) || (fadeIn ? 0 : maxOpacity);
        let interval = setInterval(
            fadeIn ?
                () => {
                    element.style.opacity = ++opacity / maxOpacity;
                    if(opacity == maxOpacity)
                    {
                        clearInterval(interval);
                        resolve();
                    }
                }
            :
                () => {
                    element.style.opacity = --opacity / maxOpacity;
                    if(opacity == 0)
                    {
                        clearInterval(interval);
                        element.style.display = 'none';
                        resolve();
                    }
                }
        , 1);
    });
}

async function loadQuestion()
{
    let question = questions[questionIndex];
    questionNumber.innerText = ++questionIndex;
    questionBox.innerText = question.name;
    quizProgress.innerText = `${questionIndex} מתוך 10`;
    progressBar.style.width = `${questionIndex * 10}%`;

    for(let i = 0; i < 4; i++)
    {
        let box = answerBoxes[i], answer = question.answers[i], correct = answer[0] == '*';
        if(correct) answer = answer.slice(1);

        box.crossline.classList.remove('active');
        box.crossline.style.display = 'none';
        box.button.classList.remove('disabled');

        if(answer.endsWith('.png'))
        {
            box.text.innerHTML = `<img class="answer_image" src="pictures/tomQuestion/${answer}">`;
            box.button.style.width = '46%';
            box.button.style.margin = '2%';
        }
        else
        {
            box.text.innerText = answer;
            box.button.style.width = '';
            box.button.style.margin = '';
            box.text.style.fontSize = answer.length > 50 ? '8px' : '';
        }
        box.correct = correct;
    }

    await fade(quizQuestionsHolder, true);
    for(let i = 0; i < 4; i++)
        answerBoxes[i].crossline.style.display = '';
}


startButton.onclick = async () => {
    await fade(quizIntro, false);
    feature.style.height = '780px';
    loadQuestion();
}


};