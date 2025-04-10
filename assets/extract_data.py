import os
import json

def generate_directory_json(root_dir):
    """Generates a JSON representation of directories and their files."""

    results = []
    for dir_name in sorted(os.listdir(root_dir)):
        dir_path = os.path.join(root_dir, dir_name)
        if os.path.isdir(dir_path):
            files = sorted(os.listdir(dir_path))
            image_files = [f for f in files if os.path.isfile(os.path.join(dir_path, f))]

            if image_files:
                capitalized_name = dir_name.capitalize()
                result = {
                    "name": capitalized_name,
                    "folder": dir_name,
                    "images": image_files,
                }
                results.append(result)

    return results

def write_json_file(data, output_file):
    """Writes the JSON data to a file."""
    with open(output_file, "w") as f:
        json.dump(data, f, indent=2)

if __name__ == "__main__":
    root_directory = "./assets"  # Use the current directory as the root
    output_filename = "data.json"

    if os.path.exists(root_directory) and os.path.isdir(root_directory):
        json_data = generate_directory_json(root_directory)
        write_json_file(json_data, output_filename)
        print(f"JSON data written to {output_filename}")
    else:
        print(f"Error: Directory '{root_directory}' not found.")
