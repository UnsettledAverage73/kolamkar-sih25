from fastapi import FastAPI
from fastapi.responses import Response
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import svgwrite
import math

app = FastAPI()

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://kolamkar-s.onrender.com"], # Updated to Render frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class KolamParameters(BaseModel):
    axiom: str = "FBFBFBFB"
    rules: dict[str, str] = {"A": "AFBFA", "B": "AFBFBFBFA"}
    angle: int = 45
    dot_size: int = 10
    iterations: int = 2

# Function to expand the L-System string (from kolampython.py)
def expand_lsystem_string(axiom, rules, iterations):
    result = axiom
    for _ in range(iterations):
        result = "".join([rules.get(ch, ch) for ch in result])
    return result

def generate_kolam_svg(params: KolamParameters):
    dwg = svgwrite.Drawing('kolam.svg', profile='tiny', size=('600px', '600px'))
    dwg.add(dwg.rect(insert=(0, 0), size=('100%', '100%'), fill='white'))

    # Setup initial position, mirroring turtle's default
    # Turtle starts at (0,0) facing East. We want it centered.
    # For simplicity, let's map turtle coordinates to SVG coordinates
    # A 600x600 canvas, turtle center (0,0) would be SVG (300,300)
    current_x, current_y = 300, 300
    current_angle = 0 # Turtle starts facing East

    # Function to draw a line segment in SVG
    def draw_line_svg(length):
        nonlocal current_x, current_y, current_angle
        new_x = current_x + length * math.cos(math.radians(current_angle))
        new_y = current_y + length * math.sin(math.radians(current_angle))
        dwg.add(dwg.line(start=(current_x, current_y), end=(new_x, new_y), stroke='black', stroke_width=2))
        current_x, current_y = new_x, new_y

    # Function to draw an arc in SVG (simplified, need to adjust for turtle's circle logic)
    def draw_arc_svg(radius, angle_degrees):
        nonlocal current_x, current_y, current_angle

        # Convert current_angle to radians for math functions
        current_angle_rad = math.radians(current_angle)

        # Calculate the center of the circle for turtle's circle command
        # If radius > 0, center is radius units left of turtle's current heading
        # If radius < 0, center is radius units right of turtle's current heading
        
        # Calculate perpendicular angle to current heading
        # +90 degrees for left, -90 degrees for right
        if radius > 0: # Left turn arc
            center_angle_rad = current_angle_rad + math.pi / 2
        else: # Right turn arc
            center_angle_rad = current_angle_rad - math.pi / 2
            radius = abs(radius) # Use absolute radius for distance calculation

        center_x = current_x + radius * math.cos(center_angle_rad)
        center_y = current_y + radius * math.sin(center_angle_rad)

        # Calculate start and end angles for the SVG arc
        # Turtle's current heading is the tangent at the start of the arc
        start_angle_rad = math.atan2(current_y - center_y, current_x - center_x)
        end_angle_rad = start_angle_rad + math.radians(angle_degrees) # Add extent

        # SVG arc flags: large_arc_flag, sweep_flag
        # sweep_flag: 1 for clockwise, 0 for counter-clockwise
        # For turtle circle, positive radius is CCW, negative is CW
        sweep_flag = 1 if radius > 0 else 0
        if angle_degrees < 0: # If extent is negative, sweep direction is opposite
            sweep_flag = 1 - sweep_flag

        large_arc_flag = 1 if abs(angle_degrees) > 180 else 0

        # Calculate end point
        end_x = center_x + radius * math.cos(end_angle_rad)
        end_y = center_y + radius * math.sin(end_angle_rad)

        # Add arc to SVG
        path_data = f"M {current_x},{current_y} A {radius},{radius} 0 {large_arc_flag} {sweep_flag} {end_x},{end_y}"
        dwg.add(dwg.path(d=path_data, stroke='black', stroke_width=2, fill='none'))

        # Update current position and angle
        current_x, current_y = end_x, end_y
        current_angle += angle_degrees # Update current angle by the extent of the arc


    # Interpret the L-System string and draw
    lsystem_string = expand_lsystem_string(params.axiom, params.rules, params.iterations)

    # Initial setup for drawing
    # Go to initial position, similar to turtle.goto(-dot_size, dot_size)
    # Adjusting for SVG coordinate system where (0,0) is top-left
    current_x = 300 - params.dot_size
    current_y = 300 + params.dot_size # Y-axis inverted in SVG compared to turtle

    for symbol in lsystem_string:
        if symbol == "F":
            draw_line_svg(params.dot_size)
        elif symbol == "A":
            draw_arc_svg(params.dot_size, 90)
        elif symbol == "B":
            forward_units = 5 / (2 ** 0.5)
            draw_line_svg(forward_units)
            draw_arc_svg(forward_units, 270)

    return dwg.tostring()

@app.post("/generate-kolam-svg")
async def generate_kolam_design(params: KolamParameters):
    try:
        svg_data = generate_kolam_svg(params)
        return Response(content=svg_data, media_type="image/svg+xml")
    except Exception as e:
        import traceback
        return Response(content=f"<svg><text x=\"10\" y=\"20\" fill=\"red\">Error: {e}\n{traceback.format_exc()}</text></svg>", media_type="image/svg+xml", status_code=500)

@app.options("/generate-kolam-svg")
async def options_generate_kolam_design():
    return Response(status_code=200, headers={
        "Access-Control-Allow-Origin": "http://localhost:3000",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Max-Age": "86400" # Cache preflight response for 24 hours
    })
