import sys
import mysql.connector
import numpy as np
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
    "very tasty", "good", "I love this blend", "Bland flavor", "bad", "too salty",
    "excellent flavor", "it tastes great", "bad aftertaste", "superb!",
    "would not recommend", "my favorite spice", "Didn’t like it",
"Not worth it",
"Overpowering taste",
"Smells weird",
"Leaves a bad aftertaste",
"Not fresh at all",
"Poor quality",
"Way too salty",
"Didn’t improve my dish",
"Not as described",
"Flavorless",
"Too bitter",
"Spices didn’t blend well",
"Very disappointed",
"Hard to work with",
"Tastes artificial",
"Didn’t meet my expectations",
"Love it",
"Affordable",
"Perfect blend",
"Great flavor",
"Highly recommend",
"Excellent balance of spices",
"Adds amazing depth to dishes",
"Really enhances the flavor",
"Fresh and flavorful",
"Great for every meal",
"Top quality ingredients",
"Outstanding aroma and taste",
"Fantastic for grilling",
"My favorite spice blend",
"Best mix I’ve tried",
"Delivers rich flavor",
"Subtle yet flavorful",
"Perfect for seasoning veggies",
"Easy to use and delicious",
"Great for everyday cooking",
]
labels = [1, 1, 1, -1, -1, -1, 1, 1, -1, 1, -1, 1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]

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
            prediction = 0
            # check actual comment is null
            if(actual_comment != ""):
                processed_comment = [preprocess_comment(comment) for comment in actual_comment.splitlines()]
                results = pipeline.predict(processed_comment)
                unique, counts = np.unique(results, return_counts=True)
                count_dict = dict(zip(unique, counts))
                prediction = count_dict.get(1, 0) - count_dict.get(-1, 0)
            if prediction > 0:
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