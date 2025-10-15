# Program 1: list_files.py
import os

def list_files_in_folder(folder_path):
    try:
        files = [f for f in os.listdir(folder_path) if os.path.isfile(os.path.join(folder_path, f))]
        print("Files inside the folder:")
        for file in files:
            print(file)
    except FileNotFoundError:
        print("❌ Folder not found. Please check the path.")

if __name__ == "__main__":
    folder_path = r"C:\Users\Ketan\Downloads\reseaech\New Research Paper"
    list_files_in_folder(folder_path)
