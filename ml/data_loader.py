import pandas as pd
import numpy as np
import tensorflow as tf
import os
import re
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import MultiLabelBinarizer
from PIL import Image
import io
import requests

# For Google Drive downloads (requires a more robust solution for large files/many files)
# This is a placeholder and might require manual download or a Google Drive API setup.
# Function to download from Google Drive (simplified - might need user authentication or shared link access)
def download_file_from_google_drive(id, destination):
    URL = "https://docs.google.com/uc?export=download"
    session = requests.Session()
    response = session.get(URL, params = { 'id' : id }, stream = True)
    token = get_confirm_token(response)
    if token:
        params = { 'id' : id, 'confirm' : token }
        response = session.get(URL, params = params, stream = True)
    save_response_content(response, destination)

def get_confirm_token(response):
    for key, value in response.cookies.items():
        if key.startswith('download_warning'):
            return value
    return None

def save_response_content(response, destination):
    CHUNK_SIZE = 32768
    with open(destination, "wb") as f:
        for chunk in response.iter_content(CHUNK_SIZE):
            if chunk: # filter out keep-alive new chunks
                f.write(chunk)

def extract_gdrive_id(url):
    match = re.search(r'/d/([a-zA-Z0-9_-]+)', url)
    if match:
        return match.group(1)
    return None

def load_kolam_data(csv_path, img_dir="ml/kolam_images"):
    df = pd.read_csv(csv_path)

    # Prepare labels for multi-label classification
    # Assuming 'Style/Name' and 'Symmetry Information' are key labels
    # And potentially 'grid_size', 'line_type', 'complexity'
    
    # Example: Processing 'Symmetry Information' (Column 20)
    # This column contains values like "4-fold Rotational ; rotational_180, horizontal_reflection, vertical_reflection"
    # We need to split and get unique labels.
    all_symmetry_labels = set()
    for symmetries_str in df.iloc[:, 19].dropna(): # Column 20 is index 19
        parts = [s.strip() for s in symmetries_str.split(';') if s.strip()]
        for part in parts:
            sub_parts = [s.strip() for s in part.split(',') if s.strip()]
            for sub_part in sub_parts:
                all_symmetry_labels.add(sub_part)
    
    mlb_symmetry = MultiLabelBinarizer()
    df['encoded_symmetries'] = mlb_symmetry.fit_transform(
        df.iloc[:, 19].apply(lambda x: [s.strip() for part in str(x).split(';') for s in part.split(',') if s.strip()] if pd.notna(x) else [])
    ).tolist()

    # Example: Processing 'Style/Name' (Column 5)
    all_style_labels = set(df.iloc[:, 4].dropna().unique()) # Column 5 is index 4
    mlb_style = MultiLabelBinarizer()
    df['encoded_styles'] = mlb_style.fit_transform(
        df.iloc[:, 4].apply(lambda x: [str(x).strip()] if pd.notna(x) else [])
    ).tolist()

    # Combine all unique labels for multi-label binarization
    all_labels = sorted(list(all_symmetry_labels.union(all_style_labels)))
    mlb_combined = MultiLabelBinarizer(classes=all_labels)

    # Apply combined binarizer
    df['combined_labels'] = df.apply(lambda row: 
        [s.strip() for part in str(row.iloc[19]).split(';') for s in part.split(',') if s.strip()] + # Symmetries
        ([str(row.iloc[4]).strip()] if pd.notna(row.iloc[4]) else []) # Styles
        , axis=1)
    
    df['encoded_combined_labels'] = mlb_combined.fit_transform(df['combined_labels']).tolist()
    
    # Create image directory if it doesn't exist
    os.makedirs(img_dir, exist_ok=True)

    images = []
    labels = []
    
    # Assuming the 3rd column (index 2) is the Google Drive link
    for index, row in df.iterrows():
        gdrive_url = row.iloc[2]
        kolam_id = row.iloc[0] # Using Kolam ID for filename
        img_filename = f"{kolam_id}.jpg"
        img_path = os.path.join(img_dir, img_filename)

        # Placeholder for image loading/downloading
        # In a real scenario, you'd download the image if not present
        # For now, we'll try to load local dummy images or just pass None
        img = None
        if os.path.exists(img_path):
            try:
                img = Image.open(img_path).convert('RGB')
                img = img.resize((256, 256)) # Standardize size
                img = np.array(img) / 255.0 # Normalize pixel values
                images.append(img)
                labels.append(row['encoded_combined_labels'])
            except Exception as e:
                print(f"Error loading image {img_path}: {e}")
        else:
            print(f"Image not found locally: {img_path}. Please ensure images are downloaded.")
            # Here you would typically attempt to download if not found,
            # but direct Google Drive download requires more setup (API keys, authentication).
            # For this exercise, we'll skip entries without local images.

    if not images:
        print("No images loaded. Please ensure images are in the specified directory or implement download logic.")
        return None, None, None, None

    images = np.array(images)
    labels = np.array(labels)

    # Split data
    X_train, X_test, y_train, y_test = train_test_split(images, labels, test_size=0.2, random_state=42)
    X_train, X_val, y_train, y_val = train_test_split(X_train, y_train, test_size=0.125, random_state=42) # 0.125 of 0.8 is 0.1

    return (X_train, y_train), (X_val, y_val), (X_test, y_test), mlb_combined
