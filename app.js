let modeOptions = document.querySelector('#modes');
let colorOptions = document.querySelector('#colors');
let brigthnessSlider = document.querySelector('#brightness_slider');
let device = document.querySelector('#device');
let leds = Array.from(document.querySelectorAll('.led_matrix_button'));
let onOffSwitch = document.querySelector('.onOffSwitch');
let radioButtuns = Array.from(onOffSwitch.children);

let ledsConfig = {
  led_0: false,
  led_1: false,
  led_2: false,
  led_3: false,
  led_4: false,
  led_5: false,
  led_6: false,
  led_7: false,
  led_8: false,
  led_9: false,
  led_10: false,
  led_11: false,
  led_12: false,
  led_13: false,
  led_14: false,
  led_15: false,
  led_16: false,
  led_17: false,
  led_18: false,
  led_19: false,
  led_20: false,
  led_21: false,
  led_21: false,
  led_22: false,
  led_23: false,
  led_24: false,
};

const getLedData = () => {
  fetch('https://light-waves-tmr-default-rtdb.firebaseio.com/ledMatrix.json')
    .then((res) => res.json())
    .then((data) => {
      ledsConfig = data;
      showLeds();
    })
    .catch((err) => {
      console.log(err);
    });
};

const getColorData = () => {
  fetch('https://light-waves-tmr-default-rtdb.firebaseio.com/color.json')
    .then((res) => res.json())
    .then((data) => {
      let colors = document.querySelector('#colors');
      let colorsArr = Array.from(colors);
      for (var i = 0; i < colorsArr.length; i++) {
        if (colorsArr[i].value == data) {
          colors.selectedIndex = i;
          break;
        }
      }
    })
    .then(() => {
      getLedData();
    })
    .catch((err) => {
      console.log(err);
    });
};

const getBrightnessData = () => {
  fetch('https://light-waves-tmr-default-rtdb.firebaseio.com/brightness.json')
    .then((res) => res.json())
    .then((data) => {
      brigthnessSlider.value = data;
    })
    .catch((err) => {
      console.log(err);
    });
};

const getModeData = () => {
  fetch('https://light-waves-tmr-default-rtdb.firebaseio.com/mode.json')
    .then((res) => res.json())
    .then((data) => {
      let modes = document.querySelector('#modes');
      let modesArr = Array.from(modes);
      for (var i = 0; i < modesArr.length; i++) {
        if (modesArr[i].value == data) {
          modes.selectedIndex = i;
          break;
        }
      }
    })
    .then(() => {
      getColorData();
      getBrightnessData();
    })
    .catch((err) => {
      console.log(err);
    });
};

const getDeviceType = (val) => {
  getModeData();
  fetch(`https://light-waves-tmr-default-rtdb.firebaseio.com/${val}.json`)
    .then((res) => res.json())
    .then((data) => {
      if (data) radioButtuns[0].checked = true;
      else radioButtuns[2].checked = true;
    })
    .then(() => {})
    .catch((err) => {
      console.log(err);
    });
};

const putLedData = (val) => {
  ledsConfig[val] = !ledsConfig[val];
  showLeds();
  let data = JSON.stringify(ledsConfig);
  fetch('https://light-waves-tmr-default-rtdb.firebaseio.com/ledMatrix.json', {
    method: 'PUT',
    body: data,
  })
    .then((res) => {})
    .catch((err) => {
      console.log(err);
    });
};

const putColorData = (val) => {
  showLeds();
  let data = JSON.stringify(colorOptions.value);
  fetch('https://light-waves-tmr-default-rtdb.firebaseio.com/color.json', {
    method: 'PUT',
    body: data,
  })
    .then((res) => {})
    .catch((err) => {
      console.log(err);
    });
};

const putModeData = (val) => {
  showLeds();
  let data = JSON.stringify(modes.value);
  fetch('https://light-waves-tmr-default-rtdb.firebaseio.com/mode.json', {
    method: 'PUT',
    body: data,
  })
    .then((res) => {})
    .catch((err) => {
      console.log(err);
    });
};

const putBrightnessData = (val) => {
  let data = JSON.stringify(val);
  fetch('https://light-waves-tmr-default-rtdb.firebaseio.com/brightness.json', {
    method: 'PUT',
    body: data,
  })
    .then((res) => {})
    .catch((err) => {
      console.log(err);
    });
};

const putOnOffState = (val) => {
  if (device.value) {
    let onOff = '';
    if (val === 'on') onOff = true;
    else onOff = false;
    let data = JSON.stringify(onOff);
    fetch(
      `https://light-waves-tmr-default-rtdb.firebaseio.com/${device.value}.json`,
      {
        method: 'PUT',
        body: data,
      }
    )
      .then((res) => {})
      .catch((err) => {
        console.log(err);
      });
  }
};

const showLeds = () => {
  let ledMatrix = document.querySelector('#led_matrix');
  let controlPanel = document.querySelector('.control_panel');
  if (modeOptions.value === 'Custom') {
    ledMatrix.style.display = 'flex';
    controlPanel.style.height = '700px';
    for (led in ledsConfig) {
      let current = document.querySelector(`#${led}`);
      if (ledsConfig[led] === true)
        current.style.background = colorOptions.value;
      else current.style.background = 'white';
    }
  } else {
    ledMatrix.style.display = 'none';
    controlPanel.style.height = '350px';
  }
};

const handleEvent = (event) => {
  if (event.target.id === 'colors') putColorData(event.target.value);
  else if (event.target.id === 'modes') putModeData(event.target.value);
  else if (event.target.id === 'brightness_slider')
    putBrightnessData(event.target.value);
  else if (event.target.id === 'device') getDeviceType(event.target.value);
  else if (event.target.name === 'switch') putOnOffState(event.target.value);
  else putLedData(event.target.id);
};

device.addEventListener('change', handleEvent);
modeOptions.addEventListener('change', handleEvent);
colorOptions.addEventListener('change', handleEvent);
brigthnessSlider.addEventListener('change', handleEvent);
radioButtuns[0].addEventListener('change', handleEvent);
radioButtuns[2].addEventListener('change', handleEvent);
leds.forEach((led) => {
  led.addEventListener('click', handleEvent);
});
