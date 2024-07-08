from rest_framework.response import Response

def create_response(data=None, message='', status_code=200, success=True):
    """
    Helper function to create a standardized API response.
    """
    return Response({
        'statusCode': status_code,
        'message': message,
        'success': success,
        'data': data,
    }, status=status_code)