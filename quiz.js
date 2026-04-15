const api_key="AIzaSyDTDRQUtJrkY9AIyI81Qn0jWJa4oFeW32Q";
const URL =`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${api_key}`;
const start=document.querySelector(".start");
const home=document.querySelector("#home");
const quiz=document.querySelector("#quiz");
const question=document.querySelector("#question h2");
const options=document.querySelectorAll("#options button");
const next=document.querySelector(".next");
const answer=document.querySelector(".ans");
const answerScreen = document.querySelector("#answer-screen");
const aiText = document.querySelector("#ai-text");
const nextAnswer = document.querySelector(".next-answer");
const topbar=document.querySelector(".top-bar h2");
let mode="quiz";
let score=0;
let counter=0;
const Question_no=()=>{
  topbar.innerText=`Question No ${counter+1} of 10`
}

answer.onclick = async () => {
  quiz.style.display = "none";
  mode="answer";
  answerScreen.style.display = "flex";
  aiText.innerText = "Thinking...";
  const currentQuestion = quizData[counter];
  try {
    const res = await fetch(URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: `Select the correct option and explain:

                Question: ${currentQuestion.question}
                Options: ${currentQuestion.options.map(o => o.text).join(", ")}`
              }
            ]
          }
        ]
      })
    });

    const data = await res.json();

    const response = data?.candidates?.[0]?.content?.parts?.[0]?.text;

    aiText.innerText = response;

  } catch (err) {
    aiText.innerText = "Error getting answer";
  }
};
const reset=()=>{
  options.forEach(opt => {
  opt.style.backgroundColor = "";
  opt.disabled=false;
  opt.style.color="black";
  answer.style.display="none";
  });
}
const loadQuestion=()=>{
  if(counter>=quizData.length){
    topbar.style.display="none";
    question.innerText = `Quiz Finished! Score: ${score} out of 10`;
    quiz.style.textAlign="center";
    options.forEach(opt => opt.style.display = "none");
    next.style.display = "none";
    return;
  }
  question.innerText=quizData[counter].question;
  options.forEach((option,index)=>{
    option.innerText=quizData[counter].options[index].text;
    option.onclick= () => {
      answer.style.display="flex";
      options.forEach(opt=>opt.disabled=true);
      if(quizData[counter].options[index].correct){
        option.style.backgroundColor ="green";
        option.style.color="white";
        score+=1;
      } 
      else{
        option.style.backgroundColor ="red";
        option.style.color="white";
      }
    }
  });
};

start.addEventListener("click",()=>{
  Question_no();
  home.style.display="none";
  quiz.style.display="flex";
  loadQuestion();
});
next.onclick = () => {
  counter++;
  Question_no();
  reset();
  loadQuestion();
};
nextAnswer.onclick = () => {
  if (mode === "answer") {
    mode = "quiz";

    answerScreen.style.display = "none";
    quiz.style.display = "flex";
  }
  counter++;
  Question_no();
  reset();
  loadQuestion();
};
