import pygame
import random
import os

pygame.init()

width, height = 1000, 650
screen = pygame.display.set_mode((width, height))
pygame.display.set_caption("Mini Paint App")

WHITE = (255, 255, 255)
BLACK = (0, 0, 0)
GRAY = (220, 220, 220)
DARK = (80, 80, 80)
RED = (220, 40, 40)
BLUE = (40, 90, 220)
GREEN = (40, 170, 80)
PURPLE = (150, 70, 200)

toolbar_height = 80
canvas = pygame.Surface((width, height - toolbar_height))
canvas.fill(WHITE)

colors = [BLACK, RED, BLUE, GREEN, PURPLE]
brushes = ["Pen", "Paint Brush", "Spray"]

current_color = BLACK
current_brush = "Pen"

tool_sizes = {
    "Pen": 2,
    "Paint Brush": 8,
    "Spray": 12
}

drawing = False
last_pos = None

font = pygame.font.SysFont(None, 26)
clock = pygame.time.Clock()

pygame.mouse.set_visible(False)

# ---------------- LOAD TOOL IMAGES ----------------
def load_tool_image(filename, size):
    if os.path.exists(filename):
        img = pygame.image.load(filename).convert()
        img.set_colorkey((255, 255, 255))  # removes pure white background
        img = img.convert_alpha()
        return pygame.transform.scale(img, size)
    return None

pen_img = load_tool_image("pen.png", (40, 40))
paintbrush_img = load_tool_image("paintbrush.png", (50, 50))
spray_img = load_tool_image("spray.png", (50, 50))

# ---------------- TOOLBAR ----------------
def draw_toolbar():
    pygame.draw.rect(screen, GRAY, (0, 0, width, toolbar_height))

    screen.blit(font.render("Brush:", True, BLACK), (20, 15))

    x = 100
    for brush in brushes:
        rect = pygame.Rect(x, 10, 120, 35)
        pygame.draw.rect(screen, WHITE, rect)
        pygame.draw.rect(screen, BLUE if brush == current_brush else DARK, rect, 2)
        screen.blit(font.render(brush, True, BLACK), (x + 10, 18))
        x += 135

    screen.blit(font.render("Color:", True, BLACK), (520, 15))

    x = 590
    for color in colors:
        rect = pygame.Rect(x, 12, 30, 30)
        pygame.draw.rect(screen, color, rect)
        pygame.draw.rect(screen, BLUE if color == current_color else DARK, rect, 3)
        x += 45

    clear_rect = pygame.Rect(820, 10, 90, 35)
    pygame.draw.rect(screen, WHITE, clear_rect)
    pygame.draw.rect(screen, DARK, clear_rect, 2)
    screen.blit(font.render("Clear", True, BLACK), (842, 18))

# ---------------- DRAWING ----------------
def draw_with_brush(pos):
    x, y = pos
    y -= toolbar_height
    size = tool_sizes[current_brush]

    if current_brush == "Pen":
        pygame.draw.circle(canvas, current_color, (x, y), size)

    elif current_brush == "Paint Brush":
        for _ in range(12):
            ox = random.randint(-size, size)
            oy = random.randint(-size, size)
            pygame.draw.circle(canvas, current_color, (x + ox, y + oy), random.randint(2, size))

    elif current_brush == "Spray":
        for _ in range(30):
            ox = random.randint(-size * 2, size * 2)
            oy = random.randint(-size * 2, size * 2)
            if ox * ox + oy * oy <= (size * 2) ** 2:
                pygame.draw.circle(canvas, current_color, (x + ox, y + oy), 1)

def draw_smooth_line(start, end):
    if start is None or end is None:
        return

    dx = end[0] - start[0]
    dy = end[1] - start[1]
    distance = max(abs(dx), abs(dy))

    if distance == 0:
        draw_with_brush(start)
        return

    for i in range(distance + 1):
        x = int(start[0] + i / distance * dx)
        y = int(start[1] + i / distance * dy)

        if y > toolbar_height:
            draw_with_brush((x, y))

# ---------------- CURSOR IMAGE ----------------
def draw_cursor(mouse_pos):
    x, y = mouse_pos

    if y <= toolbar_height:
        pygame.mouse.set_visible(True)
        return
    else:
        pygame.mouse.set_visible(False)

    if current_brush == "Pen":
        if pen_img:
            screen.blit(pen_img, (x - 5, y - 35))
        else:
            pygame.draw.circle(screen, current_color, mouse_pos, 5)

    elif current_brush == "Paint Brush":
        if paintbrush_img:
            screen.blit(paintbrush_img, (x - 10, y - 40))
        else:
            pygame.draw.line(screen, current_color, (x - 18, y + 18), (x + 18, y - 18), 5)

    elif current_brush == "Spray":
        if spray_img:
            screen.blit(spray_img, (x - 20, y - 35))
        else:
            pygame.draw.circle(screen, current_color, mouse_pos, tool_sizes["Spray"] * 2, 2)

# ---------------- MAIN LOOP ----------------
running = True

while running:
    mouse_pos = pygame.mouse.get_pos()

    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            running = False

        elif event.type == pygame.MOUSEBUTTONDOWN:
            x, y = mouse_pos

            if y < toolbar_height:
                bx = 100
                for brush in brushes:
                    if pygame.Rect(bx, 10, 120, 35).collidepoint(mouse_pos):
                        current_brush = brush
                    bx += 135

                cx = 590
                for color in colors:
                    if pygame.Rect(cx, 12, 30, 30).collidepoint(mouse_pos):
                        current_color = color
                    cx += 45

                if pygame.Rect(820, 10, 90, 35).collidepoint(mouse_pos):
                    canvas.fill(WHITE)

            else:
                drawing = True
                last_pos = mouse_pos

        elif event.type == pygame.MOUSEBUTTONUP:
            drawing = False
            last_pos = None

    if drawing:
        draw_smooth_line(last_pos, mouse_pos)
        last_pos = mouse_pos

    screen.fill(WHITE)
    screen.blit(canvas, (0, toolbar_height))
    draw_toolbar()
    draw_cursor(mouse_pos)

    pygame.display.flip()
    clock.tick(120)

pygame.quit()