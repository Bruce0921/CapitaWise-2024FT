
import pandas as pd
import os
from openai import OpenAI
import openai
import numpy as np
from typing import List, Optional
from scipy import spatial
from dotenv import load_dotenv
load_dotenv()

client = OpenAI(
   api_key = os.getenv('API_KEY')
)


# from openai.embeddings_utils import distances_from_embeddings
df=pd.read_csv('embeddings.csv', index_col=0)
df['embeddings'] = df['embeddings'].apply(eval).apply(np.array)

df.head()



def distances_from_embeddings(
    query_embedding: List[float],
    embeddings: List[List[float]],
    distance_metric="cosine",
) -> List[List]:
    distance_metrics = {
        "cosine": spatial.distance.cosine,
        "L1": spatial.distance.cityblock,
        "L2": spatial.distance.euclidean,
        "Linf": spatial.distance.chebyshev,
    }
    distances = [
        distance_metrics[distance_metric](query_embedding, embedding)
        for embedding in embeddings
    ]
    return distances

def create_context(
    question, df, max_len=1800, size="ada"
):
    """
    Create a context for a question by finding the most similar context from the dataframe
    """

    # Get the embeddings for the question
    q_embeddings = client.embeddings.create(input=question, model='text-embedding-ada-002').data[0].embedding

    # Get the distances from the embeddings
    df['distances'] = distances_from_embeddings(q_embeddings, df['embeddings'].values, distance_metric='cosine')


    returns = []
    cur_len = 0

    # Sort by distance and add the text to the context until the context is too long
    for i, row in df.sort_values('distances', ascending=True).iterrows():

        # Add the length of the text to the current length
        cur_len += row['n_tokens'] + 4

        # If the context is too long, break
        if cur_len > max_len:
            break

        # Else add it to the text that is being returned
        returns.append(row["text"])

    # Return the context
    return "\n\n###\n\n".join(returns)

prompt = '''
You are a highly knowledgeable and friendly chatbot designed to assist customers with their needs at Chase Bank. You have access to comprehensive information from over 1200 Chase Bank websites. Your primary goal is to provide accurate, helpful, and concise responses to user inquiries regarding Chase Bank's products and services. You should always strive to be clear, informative, and user-friendly in your responses.

For each response, if applicable, provide relevant website links to the Chase Bank pages where the information is sourced from, ensuring that users can verify the information and explore further details if they wish. Whether it's helping a customer understand how to cash a check, apply for a credit card, manage their account, or get information on various banking services, you are equipped to guide them efficiently with precise and actionable information.

Your response should include the following:
1. A clear and concise answer to the user's query.
2. Any relevant steps or instructions they need to follow.
3. Links to the Chase Bank website or specific pages where the information can be verified or further explored.
4. A friendly and professional tone throughout the interaction.
'''

def answer_question(
    question,
    model="gpt-4o",
    conversation_history = [],
    max_len=1800,
    size="ada",
    debug=False,
    max_tokens=500,
    stop_sequence=None,
):
    """
    Answer a question based on the most similar context from the dataframe texts
    """
    context = create_context(
        question,
        df,
        max_len=max_len,
        size=size,
    )
    # If debug, print the raw model response
    if debug:
        print("Context:\n" + context)
        print("\n\n")

    try:

        messages = conversation_history + [
            {"role": "system", "content": f"{prompt}"},
            {"role": "user", "content": f"Context: {context}\n\n---\n\nQuestion: {question}\nAnswer:"}
        ]

        # Create a chat completion using the question and context
        response = client.chat.completions.create(
            model="gpt-4o",
            messages= messages,
            temperature=0,
            max_tokens=max_tokens,
            top_p=1,
            frequency_penalty=0,
            presence_penalty=0,
            stop=stop_sequence,
        )

        # Extract the answer from the response
        answer = response.choices[0].message.content

        # Update conversation history
        conversation_history.append({"role": "user", "content": question})
        conversation_history.append({"role": "assistant", "content": answer})

        return answer
    except Exception as e:
        print(e)
        return ""


