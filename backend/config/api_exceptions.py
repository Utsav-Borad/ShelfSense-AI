from rest_framework.views import exception_handler


def standard_exception_handler(exc, context):
    """Keep DRF validation and permission failures in the project API envelope."""
    response = exception_handler(exc, context)
    if response is None:
        return response

    if isinstance(response.data, dict) and {"status", "message"}.issubset(response.data):
        return response

    message = "Validation Error" if response.status_code == 400 else "Request failed."
    response.data = {"status": False, "message": message, "errors": response.data}
    return response
