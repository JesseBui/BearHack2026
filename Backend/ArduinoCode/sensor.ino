//variable
int buttonSensor1 = A0;
int buttonSensor2 = A1;
int lightSensor = A3;
int soundSensor = D4; 
int touchSensor = A2;
int lastTouch = 0;


//dev/cu.usbmodem9C139E9B8D5C2, 9600 
void setup() {
  Serial.begin(9600); 
  pinMode(buttonSensor1, INPUT);
  pinMode(buttonSensor2, INPUT);
  pinMode(lightSensor, INPUT);
  pinMode(soundSensor, INPUT);
  pinMode(touchSensor, INPUT);
}


void loop() {
  int soundValue = analogRead(soundSensor); 
  int lightValue = analogRead(lightSensor);
  int touchValue = digitalRead(touchSensor);
  int buttonValue1 = digitalRead(buttonSensor1);
  int buttonValue2 = digitalRead(buttonSensor2);

  Serial.println(lightValue);
  Serial.println(",");
  Serial.println(soundValue); //can implement threshold logic in python
  Serial.println(",");
  Serial.println(buttonValue1);
  Serial.println(",");
  Serial.println(buttonValue2);
  Serial.println(",");

  //check if user tap or hold, send 3 value
  if (touchValue == HIGH && lastTouch == LOW){
    Serial.println("TAP");
  } else if (touchValue == HIGH){
    Serial.println("HOLD");
  } else {
    Serial.println("NONE");
  }

  lastTouch = touchValue;




  delay(50); // Small delay so the screen doesn't scroll too fast
}