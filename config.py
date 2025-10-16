import os

from dotenv import load_dotenv

load_dotenv()

OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY")
OPIK_API_KEY = os.getenv("OPIK_API_KEY")
OPENROUTER_BASE_URL = "https://openrouter.ai/api/v1"
MODEL_NAME = "openai/gpt-4o-mini"
MAX_TURNS = 10
MIN_TURNS_FOR_CONFIDENCE = 5
SIGNALS_PER_ISSUE = 2

ISSUES = [
    "The role of money in politics",
    "Health care affordability",
    "Inflation",
    "Federal budget deficit",
    "Poverty in America",
    "Ability of Republicans and Democrats to work together/government dysfunction",
    "Drug addiction/opioid crisis",
    "Moral values/social values",
    "Cost of living",
    "Government corruption",
    "Jobs and the economy",
    "Taxes and government spending",
    "Crime and public safety",
    "Immigration",
    "Racism/social equality"
]

