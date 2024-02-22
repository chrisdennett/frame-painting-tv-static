const defaultSettings = {
    threshold: {
      type: "slider",
      min: 0,
      max: 255,
      step: 1,
      value: window.localStorage.getItem("threshold") || 12,
    },
    // flipY: {
    //   type: "checkbox",
    //   value: window.localStorage.getItem("flipY") === "false" ? false : true,
    // },
  };
  const settings = JSON.parse(JSON.stringify(defaultSettings));
  
  export function resetAllParams() {
    const keys = Object.keys(settings);
  
    for (let key of keys) {
      settings[key].value = parseFloat(defaultSettings[key].value);
    }
  }
  
  export function initControls(controlsElement) {
    const params = {};
    const keys = Object.keys(settings);
    for (let key of keys) {
      params[key] = parseFloat(defaultSettings[key].value);
    }
  
    for (let key of Object.keys(settings)) {
      const c = settings[key];
  
      let holdingDiv = document.createElement("div");
      holdingDiv.classList = ["control"];
  
      let labelElement = document.createElement("label");
      labelElement.innerHTML = key + ":";
      labelElement.classList = ["controlLabel"];
  
      // arr so can extra elements - e.g. for radio butt options
      let inputElements = [];
      let displayCurrentValue = true;
      let valueElement = document.createElement("span");
  
      if (c.type === "slider") {
        let inputElement = document.createElement("input");
        inputElement.style = "vertical-align: middle;";
        inputElement.type = "range";
        inputElement.min = c.min;
        inputElement.max = c.max;
        inputElement.step = c.step;
        inputElement.value = c.value;
  
        inputElement.addEventListener("input", (e) => {
          c.value = e.target.value;
          params[key] = parseFloat(c.value);
          valueElement.innerHTML = c.value;
          window.localStorage.setItem(key, c.value);
        });
        inputElements.push(inputElement);
        //
      } else if (c.type === "checkbox") {
        let inputElement = document.createElement("input");
        inputElement.type = "checkbox";
        inputElement.checked = c.value;
        inputElement.addEventListener("input", (e) => {
          c.value = e.target.checked;
          params[key] = c.value;
          valueElement.innerHTML = c.value;
          window.localStorage.setItem(key, c.value);
        });
        inputElements.push(inputElement);
        //
      } else if (c.type === "radio") {
        displayCurrentValue = false;
        for (let i = 0; i < c.options.length; i++) {
          let inputElement = document.createElement("input");
          inputElement.type = "radio";
          inputElement.id = c.options[i];
          inputElement.value = c.options[i];
          inputElement.name = key;
          inputElement.checked = c.value === c.options[i];
          inputElement.setAttribute("data-index", i);
          inputElements.push(inputElement);
          let label = document.createElement("label");
          label.setAttribute("for", c.options[i]);
          label.innerHTML = c.options[i];
          inputElements.push(label);
  
          inputElement.addEventListener("input", (e) => {
            c.value = e.target.value;
            params[key] = c.value;
            window.localStorage.setItem(key, c.value);
          });
        }
      }
  
      if (inputElements.length === 0) {
        return;
      }
  
      holdingDiv.appendChild(labelElement);
      for (let el of inputElements) {
        holdingDiv.appendChild(el);
      }
  
      if (displayCurrentValue) {
        valueElement.innerHTML = c.value;
        holdingDiv.appendChild(valueElement);
      }
  
      controlsElement.appendChild(holdingDiv);
    }
  
    return params;
  }