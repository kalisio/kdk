// We need to dynamically import cesium to dynamically get constructors
export let Cesium

async function loadCesium() {
  Cesium = await import(`cesium`)
}

loadCesium()
