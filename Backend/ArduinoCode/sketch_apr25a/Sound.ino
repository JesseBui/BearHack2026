int pin = A0; // 

void setup() {
  Serial.begin(9600); 
  pinMode(pin, INPUT);

}

void loop() {
  int sensorValue = analogRead(pin); // Read the volume (0 to 1023)
  if (sensorValue > 200) { 
    Serial.println(sensorValue);
  }
  delay(50); // Small delay so the screen doesn't scroll too fast
}