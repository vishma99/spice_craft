import sys
import mysql.connector
import requests
from sklearn.linear_model import LogisticRegression
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.pipeline import make_pipeline
from sklearn.model_selection import train_test_split
import spacy

# Load spaCy model
nlp = spacy.load('en_core_web_sm')

# Sample dataset and model training code (same as before)
comments = [
    "very tasty", "good", "I love this blend", "not good", "bad", "too salty",
    "excellent flavor", "it tastes great", "bad aftertaste", "superb!",
    "would not recommend", "my favorite spice",
]
labels = [1, 1, 1, 0, 0, 0, 1, 1, 0, 1, 0, 1]

def preprocess_comment(comment):
    doc = nlp(comment)
    return " ".join([token.lemma_ for token in doc if not token.is_stop])

comments_processed = [preprocess_comment(comment) for comment in comments]
vectorizer = TfidfVectorizer(ngram_range=(1, 2))
X_train, X_test, y_train, y_test = train_test_split(comments_processed, labels, test_size=0.2, random_state=42)
pipeline = make_pipeline(vectorizer, LogisticRegression(class_weight='balanced', max_iter=200))
pipeline.fit(X_train, y_train)

def fetch_and_classify_all_comments(host, port, user, password, database, node_backend_url):
    try:
        connection = mysql.connector.connect(
            host=host,
            port=int(port),
            user=user,
            password=password,
            database=database
        )
        
        cursor = connection.cursor()
        select_query = "SELECT spiceId, comment FROM spice"
        cursor.execute(select_query)
        all_comments = cursor.fetchall()

        good_comment_spice_ids = []

        for row in all_comments:
            spice_id = row[0]
            actual_comment = row[1]
            processed_comment = preprocess_comment(actual_comment)
            prediction = pipeline.predict([processed_comment])
            if prediction == 1:
                good_comment_spice_ids.append(spice_id)

        if good_comment_spice_ids:
            response = requests.post(
                node_backend_url,
                json={"spiceIds": good_comment_spice_ids}
            )
            print(f"Sent good comment spice IDs: {good_comment_spice_ids}, Response: {response.status_code}")
        else:
            print("No 'Good' comments found.")

    except mysql.connector.Error as error:
        print(f"Error fetching or classifying comments: {error}")
    finally:
        if 'connection' in locals() and connection.is_connected():
            cursor.close()
            connection.close()

if __name__ == "__main__":
    if len(sys.argv) != 7:
        print("Usage: python script.py <host> <port> <user> <password> <database> <node_backend_url>")
        sys.exit(1)
    
    fetch_and_classify_all_comments(*sys.argv[1:])