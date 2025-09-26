import tensorflow as tf
from tensorflow.keras.models import Model
from tensorflow.keras.layers import Dense, GlobalAveragePooling2D, Dropout
from tensorflow.keras.optimizers import Adam
from tensorflow.keras.callbacks import EarlyStopping, ModelCheckpoint
from tensorflow.keras.applications import ResNet50 # Explicitly import ResNet50
from ml.data_loader import load_kolam_data
import os
import numpy as np

def build_analysis_model(num_classes):
    # Load pre-trained ResNet50 model without top classification layer
    base_model = ResNet50(
        weights='imagenet',
        include_top=False,
        input_shape=(256, 256, 3) # Standardized image size
    )

    # Freeze the base model layers
    base_model.trainable = False

    # Add custom classification layers on top
    x = base_model.output
    x = GlobalAveragePooling2D()(x)
    x = Dense(512, activation='relu')(x)
    x = Dropout(0.3)(x)
    predictions = Dense(num_classes, activation='sigmoid')(x) # Sigmoid for multi-label classification

    model = Model(inputs=base_model.input, outputs=predictions)

    # Compile the model
    model.compile(
        optimizer=Adam(learning_rate=0.001),
        loss='binary_crossentropy',
        metrics=['accuracy', tf.keras.metrics.Precision(), tf.keras.metrics.Recall()]
    )

    return model

def train_analysis_model(csv_path='combined_data.csv', model_save_path='ml/kolam_analysis_model.h5'):
    # Load and preprocess data
    (X_train, y_train), (X_val, y_val), (X_test, y_test), mlb_combined = load_kolam_data(csv_path)

    if X_train is None:
        print("Data loading failed. Cannot train model.")
        return

    num_classes = y_train.shape[1]
    model = build_analysis_model(num_classes)

    # Callbacks for training
    early_stopping = EarlyStopping(monitor='val_loss', patience=10, restore_best_weights=True)
    model_checkpoint = ModelCheckpoint(model_save_path, save_best_only=True, monitor='val_loss')

    print("\n--- Training Analysis Model ---")
    history = model.fit(
        X_train, y_train,
        epochs=50, # Can be adjusted, EarlyStopping will prevent overfitting
        batch_size=32,
        validation_data=(X_val, y_val),
        callbacks=[early_stopping, model_checkpoint]
    )

    print("\n--- Evaluating Analysis Model ---")
    loss, accuracy, precision, recall = model.evaluate(X_test, y_test)
    print(f"Test Loss: {loss:.4f}")
    print(f"Test Accuracy: {accuracy:.4f}")
    print(f"Test Precision: {precision:.4f}")
    print(f"Test Recall: {recall:.4f}")

    print(f"Model saved to {model_save_path}")
    return model, mlb_combined

if __name__ == '__main__':
    # Ensure the ml/kolam_images directory exists for data_loader
    os.makedirs('ml/kolam_images', exist_ok=True)
    
    # You need to manually download some images from combined_data.csv's Google Drive links
    # and place them in ml/kolam_images with names like 'k001.jpg', 'k002.jpg', etc.
    # For a full automated solution, you'd integrate Google Drive API for download.

    # Example: Run training (make sure you have images in ml/kolam_images)
    trained_model, label_binarizer = train_analysis_model()

    if trained_model:
        # Example prediction (using a dummy image)
        print("\n--- Example Prediction ---")
        dummy_img = np.random.rand(1, 256, 256, 3).astype(np.float32) # Random image
        predictions = trained_model.predict(dummy_img)
        predicted_labels_encoded = (predictions > 0.5).astype(int) # Threshold at 0.5
        predicted_labels = label_binarizer.inverse_transform(predicted_labels_encoded)
        print(f"Predicted Labels for dummy image: {predicted_labels}")
