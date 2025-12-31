"""
Simple test endpoint to verify Python serverless function works
"""

def handler(event, context):
    return {
        "statusCode": 200,
        "body": "Vercel Python serverless function is working!"
    }