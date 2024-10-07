from sklearn.linear_model import LogisticRegression
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.pipeline import make_pipeline
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report, accuracy_score
import spacy
import requests  # Import requests library

# Load spaCy model
nlp = spacy.load('en_core_web_sm')

# Sample dataset of comments labeled as good (1) or bad (0)
comments = [
    "TODO: Implement error handling for this function",  # Good
    "initialize variable",  # Bad
    "FIXME: This approach is slow, need optimization",  # Good
    "increment the value of x",  # Bad
    "NOTE: This function handles API requests",  # Good
    "HACK: This is a workaround",  # Good
    "Add 1 to x",  # Bad
    "Optimize this section",  # Good
    "TODO: Add better documentation",  # Good
    "loop starts here",  # Bad
    "This needs to be optimized",  # Good
    "This part of the code is not useful",  # Bad
    "Need to refactor this code",  # Good
    "Update the code as necessary",  # Good
    "for loop starts here",  # Bad
    "HACK: Fix this as a temporary solution",  # Good
]

# Labels for the comments (1 for Good, 0 for Bad)
labels = [1, 0, 1, 0, 1, 1, 0, 1, 1, 0, 1, 0, 1, 1, 0, 1]

# Preprocess comments with spaCy
def preprocess_comment(comment):
    doc = nlp(comment)
    return " ".join([token.lemma_ for token in doc if not token.is_stop])

# Preprocess all comments
comments_processed = [preprocess_comment(comment) for comment in comments]

# Convert comments to TF-IDF features (include bigrams)
vectorizer = TfidfVectorizer(ngram_range=(1, 2))

# Split data into training and testing sets (80% train, 20% test)
X_train, X_test, y_train, y_test = train_test_split(comments_processed, labels, test_size=0.2, random_state=42)

# Create a pipeline for TF-IDF vectorization and Logistic Regression
pipeline = make_pipeline(vectorizer, LogisticRegression(class_weight='balanced', max_iter=200))

# Train the model
pipeline.fit(X_train, y_train)

# Predict on test data
y_pred = pipeline.predict(X_test)

# Evaluate the model
print("Classification Report:\n", classification_report(y_test, y_pred))
print("Accuracy:", accuracy_score(y_test, y_pred))

# Function to classify new comments
def classify_comment(comment, spiceId):
    processed_comment = preprocess_comment(comment)
    prediction = pipeline.predict([processed_comment])
    
    result = "Good" if prediction == 1 else "Bad"
    
    # If classified as "Good", send it to the backend
    if prediction == 1:
        send_comment_to_backend(spiceId, comment)
    
    return result

# Function to send comment to the backend
def send_comment_to_backend(spiceId, comment):
    url = "http://localhost:5000/addComment"  # Your backend URL
    payload = {"spiceId": spiceId, "comment": comment}
    
    try:
        response = requests.post(url, json=payload)
        response.raise_for_status()  # Raise an error for bad responses (4xx or 5xx)
        print("Comment sent to the backend successfully!")
    except requests.exceptions.RequestException as e:
        print(f"Error sending comment: {e}")

# Example usage
new_comment = comment
spiceId = spiceId  # Replace this with the actual spice ID relevant to the comment
result = classify_comment(new_comment, spiceId)
print(f"The comment '{new_comment}' is classified as: {result}")
