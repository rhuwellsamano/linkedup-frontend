var audio1 = document.getElementById("message-sound");


export function playMessageSound() {
  audio1.volume = 1.0;
  audio1.play();
}
