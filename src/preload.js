document.addEventListener("DOMContentLoaded", function(event) {
  const jsScript = document.createElement('script')
  jsScript.src =
    'https://coolJavascript.js'

  document.body.appendChild(jsScript)
});

const confettiSettings = {
  target: 'my-canvas',
  max: 150,
  animate: true,
  rotate: true
};
const confetti = new ConfettiGenerator(confettiSettings);
confetti.render();

const calcPercent = (v, t) => (t / v) * 100;

const count = document.getElementById('counter')
const progressBar = document.getElementById('victory-progress-bar')
const buttons = document.getElementById('difficulty-buttons')
const getCount = () => localStorage.getItem('count')
const setCount = (level) => localStorage.setItem('count', JSON.stringify(level))

let getCountData = JSON.parse(getCount())
let progress = 0

const getProgress = () => {
  getCountData = JSON.parse(getCount())
  progress = calcPercent(getCountData.nextLevel, getCountData.point)
  progressBar.style.width = `${progress}%`
}

if (getCount()) {
  count.innerHTML = getCountData.level
  getProgress()
} else {
  setCount({level: 0, point: 0, nextLevel: 5})
  getCountData = JSON.parse(getCount())
  count.innerHTML = String(0)
}

const levelUp = (points) => {
  if (getCountData.point + points < getCountData.nextLevel) {
    setCount({...getCountData, point: getCountData.point + points})
    getProgress()
  } else {
    if (getCountData.point + points === getCountData.nextLevel) {
      setCount({level: getCountData.level + 1, point: 0, nextLevel: getCountData.nextLevel + 5})
      count.innerHTML = getCountData.level + 1
      getProgress()
    } else {
      setCount({
        level: getCountData.level + 1,
        point: points - (getCountData.nextLevel - getCountData.point),
        nextLevel: getCountData.nextLevel + 5
      })
      count.innerHTML = getCountData.level + 1
      getProgress()
    }
  }
  buttons.style.display = 'none'
}

