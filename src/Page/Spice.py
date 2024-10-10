import mysql.connector
import requests  # Import requests library for making HTTP requests
from sklearn.linear_model import LogisticRegression
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.pipeline import make_pipeline
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report, accuracy_score
import spacy

# Load spaCy model
nlp = spacy.load('en_core_web_sm')

# Sample dataset of comments labeled as good (1) or bad (0)
comments = [
 "very tasty",         # Good
    "good",               # Good
    "I love this blend",  # Good
    "not good",          # Bad
    "bad",               # Bad
    "too salty",         # Bad
    "excellent flavor",   # Good
    "it tastes great",    # Good
    "bad aftertaste",     # Bad
    "superb!",            # Good
    "would not recommend", # Bad
    "my favorite spice",  # Good
]

# Labels for the comments (1 for Good, 0 for Bad)
labels = [1, 1, 1, 0, 0, 0, 1, 1, 0, 1, 0, 1]

# Preprocess comments with spaCy
def preprocess_comment(comment):
    doc = nlp(comment)
    return " ".join([token.lemma_ for token in doc if not token.is_stop])

# Preprocess all comments
comments_processed = [preprocess_comment(comment) for comment in comments]

# Convert comments to TF-IDF features (include bigrams)
vectorizer = TfidfVectorizer(ngram_range=(1, 2))

# Split data into training and testing sets
X_train, X_test, y_train, y_test = train_test_split(comments_processed, labels, test_size=0.2, random_state=42)

# Create a pipeline for TF-IDF vectorization and Logistic Regression
pipeline = make_pipeline(vectorizer, LogisticRegression(class_weight='balanced', max_iter=200))

# Train the model
pipeline.fit(X_train, y_train)

# Function to classify and fetch all comments from the database
def fetch_and_classify_all_comments():
    try:
        # Connect to MySQL database
        connection = mysql.connector.connect(
            host="localhost",
            port=3306,
            user="root",
            password="",  # Add your MySQL password here
            database="spicecraft"
        )
        
        cursor = connection.cursor()

        # SQL query to fetch all spiceId and comments from the spice table
        select_query = "SELECT spiceId, comment FROM spice"
        cursor.execute(select_query)

        # Fetch all comments from the query
        all_comments = cursor.fetchall()

        # List to store spiceId of good comments
        good_comment_spice_ids = []

        # Loop through all fetched comments
        for row in all_comments:
            spice_id = row[0]
            actual_comment = row[1]

            # Preprocess and classify the comment using the trained model
            processed_comment = preprocess_comment(actual_comment)
            prediction = pipeline.predict([processed_comment])

            # If the comment is classified as "Good", store the spiceId
            if prediction == 1:
                good_comment_spice_ids.append(spice_id)

        # Send spiceId of all good comments to the Node.js backend
        if good_comment_spice_ids:
            # Make a POST request to the Node.js server
            response = requests.post(
                "http://localhost:5000/receiveComments",  # Node.js backend URL
                json={"spiceId": good_comment_spice_ids}  # Send the spiceIds as JSON
            )
            print(f"Sent good comment spice IDs: {good_comment_spice_ids}, Response: {response.status_code}")
        else:
            print("No 'Good' comments found.")

    except mysql.connector.Error as error:
        print(f"Error fetching or classifying comments: {error}")
    finally:
        # Close the connection
        if 'connection' in locals() and connection.is_connected():
            cursor.close()
            connection.close()


# Example usage
fetch_and_classify_all_comments()
