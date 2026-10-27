# Compte à rebours participatif

Taille du widget : 376&times;150

Affiche un compte à rebours à partir d'une date.

Les actions des spectateurs réduisent la date de fin :

- follows
- abonnements
- raids
- premier message de la session
- tout premier message sur le chat
- cheer (bits)

Un son au choix est joué à la fin.

## HTML

```html
<link
  rel="stylesheet"
  href="https://cdnjs.cloudflare.com/ajax/libs/normalize/8.0.1/normalize.min.css"
  integrity="sha512-NhSC1YmyruXifcj/KFRWoC561YpHpc5Jtzgvbuzx5VozKpWvQ+4nXhPdFgmx8xqexRcpAglTj9sIBWINXa8x5w=="
  crossorigin="anonymous"
  referrerpolicy="no-referrer"
/>
<div id="countdown"></div>
```

## CSS

```css
@import url('https://fonts.googleapis.com/css2?family={{digitFontFamily}}:wght@{{digitFontWeight}}&display=swap');
@import url('https://fonts.googleapis.com/css2?family={{textFontFamily}}:wght@{{textFontWeight}}&display=swap');

* {
    font-size: 16px;
}

#countdown {
    display: flex;
    column-gap: .5rem;
    padding: 1rem;
}

#countdown > div {
    background: {{backgroundColor}};
    color: {{fontColor}};
    border-radius: .5rem;
    padding: 1rem;
    display: flex;
    flex-direction: column;
    row-gap: .5rem;
    justify-content: center;
    align-items: center;
    text-align: center;
    width: 3rem;
}

#countdown strong {
    font-weight: bold;
    font-size: 2rem;
    font-family: "{{digitFontFamily}}";
    font-weight: "{{digitFontWeight}}";
}

#countdown span {
    text-transform: uppercase;
    font-size: .675rem;
    font-family: "{{textFontFamily}}";
    font-weight: "{{textFontWeight}}";
}
```

## JS

```js
const endDate = new Date().getTime();
let reductions = {
  follower: 0,
  subscriber: 0,
  raid: 0,
  sessionFirstMessage: 0,
  firstMessage: 0,
  cheer: 0,
};
let chatters;
let interval;
let sound;

let end = endDate;

const format = (ms) => {
  const s = Math.max(0, Math.floor(ms / 1000));
  const d = Math.floor(s / 86400);
  const h = String(Math.floor((s % 86400) / 3600)).padStart(2, "0");
  const m = String(Math.floor((s % 3600) / 60)).padStart(2, "0");
  const sec = String(s % 60).padStart(2, "0");
  if (s === 0) {
    if (sound) {
      const audio = new Audio(sound);
      audio.play();
    }
    clearInterval(interval);
  }
  return `
        <div>
            <strong>${d}</strong>
            <span>jours</span>
        </div>
        <div>
            <strong>${h}</strong>
            <span>heures</span>
        </div>
        <div>
            <strong>${m}</strong>
            <span>minutes</span>
        </div>
        <div>
            <strong>${sec}</strong>
            <span>secondes</span>
        </div>
    `;
};

const render = () => {
  document.getElementById("countdown").innerHTML = format(end - Date.now());
};

window.addEventListener("onWidgetLoad", (obj) => {
  const fieldData = obj.detail.fieldData;

  end = new Date(fieldData.endDate).getTime();

  reductions.follower = fieldData.timeForFollow;
  reductions.subscriber = fieldData.timeForSub;
  reductions.raid = fieldData.timeForRaid;
  reductions.sessionFirstMessage = fieldData.timeForSessionFirstMessage;
  reductions.firstMessage = fieldData.timeForFirstMessage;
  reductions.cheer = fieldData.timeForCheer;

  sound = fieldData.endSound;

  chatters = [];

  interval = setInterval(render, 1000);
  render();
});

window.addEventListener("onEventReceived", (obj) => {
  const { listener, event } = obj.detail;
  if (listener === "event") return;
  if (listener !== "message" && !listener.endsWith("-latest")) return;

  let seconds = 0;

  if (listener === "message") {
    if (event.data.tags["first-msg"] !== "0") {
      seconds = reductions.firstMessage;
    } else if (!chatters.includes(event.data.userId)) {
      seconds = reductions.sessionFirstMessage;
      chatters.push(event.data.userId);
    }
    end -= seconds * 60 * 1000;
    render();
    return;
  }

  const type = listener.replace("-latest", "");
  seconds = reductions[type];
  if (!seconds) return;

  if (type === "raid") {
    seconds *= event.amount;
  }

  if (type === "cheer") {
    seconds *= Number((event.amount / 50).toFixed());
  }

  end -= seconds * 60 * 1000;
  render();
});
```

## Fields

```json
{
  "endDate": {
    "type": "text",
    "label": "End date (Y-m-d H:i:s)"
  },
  "endSound": {
    "type": "sound-input",
    "label": "Sound play at the end"
  },
  "fontColor": {
    "type": "colorpicker",
    "label": "Font color",
    "value": "rgb(255, 255, 255)"
  },
  "backgroundColor": {
    "type": "colorpicker",
    "label": "Background color",
    "value": "rgba(36, 6, 73, 0.15)"
  },
  "digitFontFamily": {
    "type": "googleFont",
    "label": "Digit font family",
    "value": "Orbitron"
  },
  "digitFontWeight": {
    "type": "slider",
    "label": "Digit font weight",
    "min": 100,
    "max": 900,
    "step": 100,
    "value": 400
  },
  "textFontFamily": {
    "type": "googleFont",
    "label": "Text font family",
    "value": "Noto"
  },
  "textFontWeight": {
    "type": "slider",
    "label": "Text font weight",
    "min": 100,
    "max": 900,
    "step": 100,
    "value": 400
  },
  "timeForFollow": {
    "type": "number",
    "label": "Follow",
    "step": 1,
    "min": 0,
    "group": "Minutes"
  },
  "timeForSub": {
    "type": "number",
    "label": "Sub",
    "step": 1,
    "min": 0,
    "group": "Minutes"
  },
  "timeForRaid": {
    "type": "number",
    "label": "Raid (per viewer)",
    "step": 1,
    "min": 0,
    "group": "Minutes"
  },
  "timeForSessionFirstMessage": {
    "type": "number",
    "label": "Session first message",
    "step": 1,
    "min": 0,
    "group": "Minutes"
  },
  "timeForFirstMessage": {
    "type": "number",
    "label": "First message",
    "step": 1,
    "min": 0,
    "group": "Minutes"
  },
  "timeForCheer": {
    "type": "number",
    "label": "Cheer (per 50 bits)",
    "step": 1,
    "min": 0,
    "group": "Minutes"
  }
}
```
