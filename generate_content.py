import sys
from datetime import datetime
import json
from openai import OpenAI
import os

client = OpenAI()

def generate():
    with open('okf/foundations/amplitude-time.md', 'r') as f:
        amp_time = f.read()
    with open('okf/foundations/periodicity.md', 'r') as f:
        periodicity = f.read()
    with open('okf/perception/information-and-expectation.md', 'r') as f:
        info_exp = f.read()

    prompt = f"""
    Synthesize the following OKF dependencies into a cohesive narrative covering:
    1. The Raw Material: Sound vs Information (noise vs periodic patterns).
    2. The Delight of the Pattern: Why the brain loves patterns and how expectations are formed (the "groove").
    3. The Joys of Listening: The payoff of the expected (recognition/resolution) and the thrill of the unexpected (subversion/tension).
    4. The Zoom Lens: Briefly explain how this same mechanics of periodicity applies at slow speeds (rhythm) and fast speeds (pitch), unifying them into a single phenomenon.
    5. Giving the Patterns a Name: Introduce Prime Period Theory briefly at the very end as simply a vocabulary for describing these shapes and patterns, much like geometry for a painter.

    Tone: Conversational, non-academic, accessible to non-musicians. Focus on physical and psychological intuition. Avoid traditional music theory jargon entirely (e.g., cadence, harmonic rhythm, major/minor). Use simple analogies.
    Audience: General public.
    Output only the markdown content, no frontmatter, no AGENT_GENERATE_BLOCK tags.

    Dependency 1 (okf/foundations/amplitude-time.md):
    {amp_time}

    Dependency 2 (okf/foundations/periodicity.md):
    {periodicity}

    Dependency 3 (okf/perception/information-and-expectation.md):
    {info_exp}
    """

    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {{"role": "system", "content": "You are a helpful assistant that synthesizes information."}},
            {{"role": "user", "content": prompt}}
        ]
    )

    return response.choices[0].message.content

if __name__ == '__main__':
    print(generate())
