//variable
int buttonSensor1 = D4;
int buttonSensor2 = A1;
int lightSensor = A3;
int soundSensor = A0; 
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

  // Send everything on ONE line, separated by commas
  Serial.print(lightValue);   Serial.print(",");
  Serial.print(soundValue);   Serial.print(",");
  Serial.print(buttonValue1); Serial.print(",");
  Serial.print(buttonValue2); Serial.print(",");

  if (touchValue == HIGH && lastTouch == LOW){
    Serial.println("TAP");
  } else if (touchValue == HIGH){
    Serial.println("HOLD");
  } else {
    Serial.println("NONE");
  }

  lastTouch = touchValue;
  delay(50); 
}