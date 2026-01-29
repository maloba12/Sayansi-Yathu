import cadquery as cq
import os

# Ensure output directory exists
OUTPUT_DIR = "backend-python/assets/models"
os.makedirs(OUTPUT_DIR, exist_ok=True)

def create_beaker():
    """Creates a simple beaker."""
    height = 6.0
    radius = 2.5
    thickness = 0.2
    rim_thickness = 0.3
    
    # Main cylinder
    beaker = cq.Workplane("XY").circle(radius).extrude(height)
    
    # Hollow it out
    beaker = beaker.faces(">Z").shell(-thickness)
    
    # Add a rim
    rim = cq.Workplane("XY").workplane(offset=height).circle(radius + 0.1).circle(radius - thickness).extrude(rim_thickness)
    beaker = beaker.union(rim)
    
    # Add a spout
    spout = cq.Workplane("XY").workplane(offset=height - 1.0) \
        .moveTo(radius, 0).lineTo(radius + 1.0, 0).lineTo(radius, 1.0).close().extrude(1.0)
        # Simplified spout logic, boolean union might be needed but basic shape is start
        
    # Better spout approach using subtraction or lofting could be complex, 
    # sticking to a simple functional shape for now.
    
    return beaker

def create_flask():
    """Creates a Erlenmeyer flask."""
    base_radius = 3.0
    neck_radius = 1.0
    height_base = 4.0
    height_neck = 3.0
    thickness = 0.2
    
    # Cone base
    flask = cq.Workplane("XY").circle(base_radius).workplane(offset=height_base).circle(neck_radius).loft(combine=True)
    
    # Neck
    neck = cq.Workplane("XY").workplane(offset=height_base).circle(neck_radius).extrude(height_neck)
    flask = flask.union(neck)
    
    # Hollow
    flask = flask.faces(">Z").shell(-thickness)
    
    return flask

def create_test_tube():
    """Creates a test tube."""
    height = 8.0
    radius = 0.8
    thickness = 0.1
    
    # Cylinder
    tube = cq.Workplane("XY").circle(radius).extrude(height)
    
    # Rounded bottom (Sphere)
    bottom = cq.Workplane("XY").sphere(radius)
    # Move sphere to bottom? Actually Workplane starts at 0, extrude goes up.
    # We need sphere at 0, but sphere center is 0. 
    # Cut half sphere? 
    # Easier: Cylinder + Fillet
    
    tube = tube.faces("<Z").fillet(radius - 0.01) # Fillet bottom edge
    
    # Hollow
    tube = tube.faces(">Z").shell(-thickness)
    
    return tube

def main():
    print("Generating 3D assets...")
    
    try:
        beaker = create_beaker()
        cq.exporters.export(beaker, os.path.join(OUTPUT_DIR, "beaker.stl"))
        print(f"Saved {OUTPUT_DIR}/beaker.stl")
        
        flask = create_flask()
        cq.exporters.export(flask, os.path.join(OUTPUT_DIR, "flask.stl"))
        print(f"Saved {OUTPUT_DIR}/flask.stl")
        
        test_tube = create_test_tube()
        cq.exporters.export(test_tube, os.path.join(OUTPUT_DIR, "test_tube.stl"))
        print(f"Saved {OUTPUT_DIR}/test_tube.stl")
        
    except Exception as e:
        print(f"Error generating assets: {e}")
        print("Please ensure cadquery is installed (pip install cadquery-2)")

if __name__ == "__main__":
    main()
