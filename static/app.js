const form = document.getElementById("chatForm");
const input = document.getElementById("messageInput");
const chatBox = document.getElementById("chatBox");
const newChatBtn = document.getElementById("newChatBtn");
const micBtn = document.getElementById("micBtn");

let messages =
JSON.parse(localStorage.getItem("messages")) || [];

renderMessages();

function renderMessages(){

    chatBox.innerHTML="";

    messages.forEach(msg=>{

        const div=document.createElement("div");

        div.className =
        msg.role==="user"
        ? "user-message"
        : "ai-message";

        div.textContent=msg.content;

        chatBox.appendChild(div);

    });

    chatBox.scrollTop =
    chatBox.scrollHeight;

}

function saveMessages(){

    localStorage.setItem(
        "messages",
        JSON.stringify(messages)
    );

}

form.addEventListener(
"submit",
async(e)=>{

    e.preventDefault();

    const text =
    input.value.trim();

    if(!text) return;

    messages.push({
        role:"user",
        content:text
    });

    renderMessages();

    saveMessages();

    input.value="";

    try{

        const response =
        await fetch("/chat",{

            method:"POST",

            headers:{
                "Content-Type":
                "application/json"
            },

            body:JSON.stringify({
                message:text
            })

        });

        const data =
        await response.json();

        messages.push({

            role:"ai",

            content:data.reply

        });

        renderMessages();

        saveMessages();

        const speech =
        new SpeechSynthesisUtterance(
            data.reply
        );

        const voices =
        window.speechSynthesis
        .getVoices();

        const bestVoice =

        voices.find(
        v=>v.lang.startsWith("fr")
        )

        ||

        voices.find(
        v=>v.lang.startsWith("en")
        )

        ||

        voices[0];

        if(bestVoice){

            speech.voice =
            bestVoice;

        }

        window
        .speechSynthesis
        .speak(speech);

    }

    catch(error){

        console.log(error);

    }

});

input.addEventListener(
"keydown",
(e)=>{

    if(
        e.key==="Enter"
        &&
        !e.shiftKey
    ){

        e.preventDefault();

        form.requestSubmit();

    }

}
);

newChatBtn.addEventListener(
"click",
()=>{

    messages=[];

    localStorage.removeItem(
        "messages"
    );

    renderMessages();

}
);

const SpeechRecognition =
window.SpeechRecognition
||
window.webkitSpeechRecognition;

const recognition =
new SpeechRecognition();

recognition.continuous=false;

recognition.interimResults=false;

recognition.maxAlternatives=3;

micBtn.addEventListener(
"click",
()=>{

    recognition.lang =
    navigator.language
    ||
    "en-US";

    recognition.start();

}
);

recognition.onresult=
(event)=>{

    const text =

    event.results[0][0]
    .transcript;

    input.value=text;

    form.requestSubmit();

};