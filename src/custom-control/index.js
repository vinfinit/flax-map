module.exports = (map, ...controls) => {
  function Control(controlDiv, map, c) {
    const controlUI = document.createElement('div');
    controlUI.style.backgroundColor = '#fff';
    controlUI.style.borderRadius = '3px';
    controlUI.style.boxShadow = '0 2px 6px rgba(0,0,0,.3)';
    controlUI.style.cursor = 'pointer';
    controlUI.style.marginBottom = '2px';
    controlUI.style.textAlign = 'center';
    controlUI.title = c.name;
    controlDiv.appendChild(controlUI);

    // Set CSS for the control interior.
    const controlText = document.createElement('div');
    controlText.style.color = 'rgb(25,25,25)';
    controlText.style.fontFamily = 'Roboto,Arial,sans-serif';
    controlText.style.fontSize = '16px';
    controlText.style.lineHeight = '38px';
    controlText.style.paddingLeft = '5px';
    controlText.style.paddingRight = '5px';
    controlText.innerHTML = c.name;
    controlUI.appendChild(controlText);

    controlUI.addEventListener('click', () => {
      const active = c.handler();
      if (active) {
        controlUI.style.backgroundColor = c.color;
      } else {
        controlUI.style.backgroundColor = '#fff';
      }
    });
  }

  const controlDiv = document.createElement('div');
  controls.forEach(c => new Control(controlDiv, map, c));

  controlDiv.index = 1;
  map.controls[google.maps.ControlPosition.BOTTOM_LEFT].push(controlDiv);
}
