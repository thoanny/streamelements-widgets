# Webcam

Taille du widget : 300&times;380

Ce widget affiche un cache pour la webcam avec :

- le pseudo dernier follower
- une barre de progression de followers
- le pseudo du dernier abonné
- une barre de progression des abonnés

## HTML

```html
<script src="https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4"></script>

<div class="w-66 rounded-xl m-4 flex flex-col shadow-md overflow-hidden">
  <div class="text-(--bg-color)">
    <svg id="b" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 264 264">
      <g id="c">
        <path
          d="M0,0v264h264V0H0ZM248,240c0,4.42-3.58,8-8,8H24c-4.42,0-8-3.58-8-8V24c0-4.42,3.58-8,8-8h216c4.42,0,8,3.58,8,8v216Z"
          fill="currentColor"
        />
      </g>
    </svg>
  </div>

  <div class="w-full flex flex-col gap-1 bg-(--bg-color) p-4 pt-0 -mt-2">
    <div id="followers" class="flex flex-col gap-0.5">
      <div class="flex gap-1 items-center px-1">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="currentColor"
          class="icon icon-tabler icons-tabler-filled icon-tabler-heart size-4 shrink-0"
        >
          <path stroke="none" d="M0 0h24v24H0z" fill="none" />
          <path
            d="M6.979 3.074a6 6 0 0 1 4.988 1.425l.037 .033l.034 -.03a6 6 0 0 1 4.733 -1.44l.246 .036a6 6 0 0 1 3.364 10.008l-.18 .185l-.048 .041l-7.45 7.379a1 1 0 0 1 -1.313 .082l-.094 -.082l-7.493 -7.422a6 6 0 0 1 3.176 -10.215z"
          />
        </svg>
        <div id="followers__latest" class="grow uppercase truncate"></div>
        <div id="followers__count" class="whitespace-nowrap"></div>
      </div>
      <div id="followers__progressbar">
        <div
          id="followers__progress"
          class="transition-[width] ease-in duration-300"
        ></div>
      </div>
    </div>
    <div id="subscribers" class="flex flex-col gap-0.5">
      <div class="flex gap-1 items-center px-1">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="currentColor"
          class="icon icon-tabler icons-tabler-filled icon-tabler-star size-4 shrink-0"
        >
          <path stroke="none" d="M0 0h24v24H0z" fill="none" />
          <path
            d="M8.243 7.34l-6.38 .925l-.113 .023a1 1 0 0 0 -.44 1.684l4.622 4.499l-1.09 6.355l-.013 .11a1 1 0 0 0 1.464 .944l5.706 -3l5.693 3l.1 .046a1 1 0 0 0 1.352 -1.1l-1.091 -6.355l4.624 -4.5l.078 -.085a1 1 0 0 0 -.633 -1.62l-6.38 -.926l-2.852 -5.78a1 1 0 0 0 -1.794 0l-2.853 5.78z"
          />
        </svg>
        <div id="subscribers__latest" class="grow uppercase truncate"></div>
        <div id="subscribers__count" class="whitespace-nowrap"></div>
      </div>
      <div id="subscribers__progressbar">
        <div
          id="subscribers__progress"
          class="transition-[width] ease-in ease-in duration-300"
        ></div>
      </div>
    </div>
  </div>
</div>
```

## CSS

```css
:root {
  --bg-color: {{backgroundColor}};
  --followers-color: {{followersColor}};
  --subscribers-color: {{subscribersColor}};
  --font-family: {{fontFamily}};
  --font-size: {{fontSize}};
  --font-weight: {{fontWeight}};
  --font-color: {{fontColor}};
}

body {
  font-family: var(--font-family);
  font-weight: var(--font-weight);
  font-size: var(--font-size);
  color: var(--font-color);
}

#followers svg {
  color: var(--followers-color);
}

#subscribers svg {
  color: var(--subscribers-color);
}

#followers__progressbar,
#subscribers__progressbar {
  background: color-mix(in srgb, var(--bg-color), black 15%);
  height: .75rem;
  border-radius: 999rem;
  overflow: hidden;
}

#followers__progress,
#subscribers__progress {
  height: 100%;
  width: 0%;
}

#followers__progress {
  background: var(--followers-color);
}

#subscribers__progress {
  background: var(--subscribers-color);
}

#followers__count,
#subscribers__count {
  font-size: .75rem;
}
```

## JS

```js
let followersGoalStep = 100,
  subscribersGoalStep = 10;

const nextStep = (current, step) => {
  return Math.floor(current / step) * step + step;
};

const updateGoal = (type, step, current, latest) => {
  const goal = nextStep(current, step);

  document.getElementById(`${type}__latest`).innerText = latest;
  document.getElementById(`${type}__count`).innerText = `${current}/${goal}`;

  setTimeout(() => {
    document.getElementById(`${type}__progress`).style.width =
      `${((current % step) / step) * 100}%`;
  }, 300);
};

window.addEventListener("onWidgetLoad", function (obj) {
  const fieldData = obj.detail.fieldData;

  followersGoalStep = fieldData.followersGoalStep;
  subscribersGoalStep = fieldData.subscribersGoalStep;

  if (!obj.detail.session) {
    return;
  }

  const session = obj.detail.session;

  updateGoal(
    "followers",
    followersGoalStep,
    session.data["follower-total"].count,
    session.data["follower-latest"].name,
  );
  updateGoal(
    "subscribers",
    subscribersGoalStep,
    session.data["subscriber-total"].count,
    session.data["subscriber-latest"].name,
  );
});

window.addEventListener("onSessionUpdate", function (obj) {
  if (!obj.detail.session) {
    return;
  }

  const session = obj.detail.session;

  if (session.data.type === "follower") {
    updateGoal(
      "followers",
      followersGoalStep,
      session["follower-total"].count,
      session.data.name,
    );
  }

  if (session.data.type === "subscriber") {
    updateGoal(
      "subscribers",
      subscribersGoalStep,
      session["subscriber-total"].count,
      session.data.name,
    );
  }
});

window.addEventListener("onEventReceived", function (obj) {
  console.log("onEventReceived:", obj.detail);
  if (!obj.detail.session) {
    return;
  }
});
```

## Fields

```json
{
  "backgroundColor": {
    "type": "colorpicker",
    "label": "Background color",
    "value": "#00ff00",
    "group": "General"
  },
  "fontFamily": {
    "type": "googleFont",
    "label": "Font family",
    "group": "General"
  },
  "fontWeight": {
    "type": "dropdown",
    "label": "Font weight",
    "value": 400,
    "options": {
      "100": 100,
      "200": 200,
      "300": 300,
      "400": 400,
      "500": 500,
      "600": 600,
      "700": 700,
      "800": 800,
      "900": 900
    },
    "group": "General"
  },
  "fontSize": {
    "type": "dropdown",
    "label": "Font size",
    "value": "14px",
    "options": {
      "10px": "10px",
      "12px": "12px",
      "14px": "14px",
      "16px": "16px",
      "18px": "18px",
      "20px": "20px"
    },
    "group": "General"
  },
  "fontColor": {
    "type": "colorpicker",
    "label": "Font color",
    "value": "#000000",
    "group": "General"
  },
  "followersGoalStep": {
    "type": "number",
    "label": "Followers steps",
    "value": 100,
    "min": 1,
    "step": 1,
    "group": "Followers"
  },
  "followersColor": {
    "type": "colorpicker",
    "label": "Color",
    "value": "#e74c3c",
    "group": "Followers"
  },
  "subscribersGoalStep": {
    "type": "number",
    "label": "Subscribers steps",
    "value": 10,
    "min": 1,
    "step": 1,
    "group": "Subscribers"
  },
  "subscribersColor": {
    "type": "colorpicker",
    "label": "Color",
    "value": "#f1c40f",
    "group": "Subscribers"
  }
}
```
