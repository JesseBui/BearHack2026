import turtle

screen = turtle.Screen()
screen.title("Sensor Drawing Window")
screen.bgcolor("white")
screen.setup(width=900, height=600)

pen = turtle.Turtle()
pen.speed(0)
pen.pensize(5)
pen.color("black")

def draw(x, y):
    pen.goto(x, y)

def move(x, y):
    pen.penup()
    pen.goto(x, y)
    pen.pendown()

def clear_screen():
    pen.clear()

screen.onclick(move)
pen.ondrag(draw)

screen.listen()
screen.onkey(clear_screen, "c")

turtle.done()